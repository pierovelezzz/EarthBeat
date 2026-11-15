"""Generate the V4 expansion grids and maps with NumPy, netCDF4 and Pillow."""

from calendar import monthrange
import csv
from datetime import date
import io
import json
from pathlib import Path
from urllib.request import urlopen

import netCDF4
import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "_work" / "expansion"
MAPS = ROOT / "prototipos" / "I11-eic" / "discos-extra"
SIZE = (28, 16)
OCEAN = (-140, -16, -70, 16)
PERU = (-82, -10, -74, -3)
POWER = ("https://power.larc.nasa.gov/api/temporal/monthly/regional?"
         "latitude-min=-10&latitude-max=-3&longitude-min=-82&longitude-max=-74"
         "&parameters=PRECTOTCORR&community=AG&start=2017&end=2017&format=CSV")
HYCOM = "https://ncss.hycom.org/thredds/ncss/grid/GLBy0.08/expt_93.0/uv3z/2023"


def cached(name, url):
    file = CACHE / name
    if not file.exists():
        with urlopen(url, timeout=45) as response:
            file.write_bytes(response.read())
    return file


def regrid(values, longitude, latitude, bounds):
    west, south, east, north = bounds
    lat_edges = np.linspace(north, south, SIZE[1] + 1)
    lon_edges = np.linspace(west, east, SIZE[0] + 1)

    def indices(axis, a, b):
        # A coarse source can have no coordinate in a finer output bin.
        hits = np.flatnonzero((axis >= min(a, b)) & (axis < max(a, b)))
        return hits if len(hits) else [int(np.argmin(np.abs(axis - (a + b) / 2)))]

    cells = []
    for top, bottom in zip(lat_edges, lat_edges[1:]):
        ys = indices(latitude, top, bottom)
        for left, right in zip(lon_edges, lon_edges[1:]):
            sample = values[np.ix_(ys, indices(longitude, left, right))]
            valid = sample[np.isfinite(sample)]
            cells.append(round(float(valid.mean()), 3) if len(valid) else None)
    return cells


def sst(stamp):
    ym = stamp.strftime("%Y%m")
    url = f"https://www.ncei.noaa.gov/pub/data/cmb/ersst/v5/netcdf/ersst.v5.{ym}.nc"
    with netCDF4.Dataset(cached(f"ersst-{ym}.nc", url)) as source:
        return regrid(source["ssta"][0, 0].filled(np.nan), source["lon"][:] - 360, source["lat"][:], OCEAN)


def currents(stamp):
    ym = stamp.strftime("%Y%m")
    url = (f"{HYCOM}?var=water_u&var=water_v&north=16&south=-16&west=-140&east=-70"
           f"&horizStride=8&time={stamp.isoformat()}T12%3A00%3A00Z&vertCoord=0&accept=netcdf")
    with netCDF4.Dataset(cached(f"currents-{ym}.nc", url)) as source:
        u = source["water_u"][0, 0].filled(np.nan)
        v = source["water_v"][0, 0].filled(np.nan)
        return regrid(np.hypot(u, v), source["lon"][:] - 360, source["lat"][:], OCEAN)


def rain_grids():
    source = cached("power.csv", POWER).read_text(encoding="utf-8").split("-END HEADER-", 1)[1].strip()
    rows = list(csv.DictReader(io.StringIO(source)))
    longitude = sorted({float(row["LON"]) for row in rows})
    latitude = sorted({float(row["LAT"]) for row in rows})
    months = ("JAN", "FEB", "MAR", "APR", "MAY", "JUN")
    for month, name in enumerate(months, 1):
        values = np.full((len(latitude), len(longitude)), np.nan)
        for row in rows:
            daily = float(row[name])
            if daily >= 0:
                values[latitude.index(float(row["LAT"])), longitude.index(float(row["LON"]))] = daily * monthrange(2017, month)[1]
        yield regrid(values, np.array(longitude), np.array(latitude), PERU)


def draw_map(cells, bounds, levels, borders, path):
    def color(value):
        if value is None:
            return "#222c39"
        return next((ink for minimum, ink in reversed(levels) if value >= minimum), levels[0][1])

    width, height = 840, 480
    image = Image.new("RGB", SIZE)
    image.putdata([tuple(bytes.fromhex(color(value)[1:])) for value in cells])
    image = image.resize((width, height), Image.Resampling.NEAREST)
    draw = ImageDraw.Draw(image)
    west, south, east, north = bounds
    for feature in borders["features"]:
        geometry = feature["geometry"]
        polygons = geometry["coordinates"]
        for polygon in polygons if geometry["type"] == "MultiPolygon" else [polygons]:
            for ring in polygon:
                xs, ys = zip(*ring)
                if max(xs) < west or min(xs) > east or max(ys) < south or min(ys) > north:
                    continue
                points = [((x - west) / (east - west) * width, (north - y) / (north - south) * height) for x, y in ring]
                draw.line(points, fill="#e5edf7", width=2)
    image.save(path, quality=88)


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    MAPS.mkdir(parents=True, exist_ok=True)
    borders = json.loads(cached("borders.geojson", "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson").read_text(encoding="utf-8"))
    sst_dates = [date(1997, m, 1) for m in range(9, 13)] + [date(1998, m, 1) for m in range(1, 3)]
    rain_dates = [date(2017, m, 1) for m in range(1, 7)]
    current_dates = [date(2023, m, 15) for m in range(1, 7)]
    discs = [
        dict(id="nino1997", kind="sst", title="El Niño 1997–98", english="El Niño 1997–98", lead="inti", unit="°C",
             source="NOAA NCEI · ERSST v5", sourceUrl="https://www.ncei.noaa.gov/products/extended-reconstructed-sst",
             levels=list(zip([-4,-3,-2,-1,0,1,2,3,4], ["#243c91","#335fc0","#438ed1","#7cbcd9","#cbd9d8","#efd276","#f29a51","#d6553c","#9a3043"])),
             dates=sst_dates, grids=map(sst,sst_dates), bounds=OCEAN),
        dict(id="lluvias2017", kind="rain", title="Lluvias del norte del Perú", english="Rainfall in northern Peru", lead="yaku", unit="mm",
             source="NASA POWER · MERRA-2 PRECTOTCORR", sourceUrl="https://power.larc.nasa.gov/docs/services/api/temporal/monthly/",
             levels=list(zip([0,20,50,100,200,300,450], ["#e5ede0","#bacfb1","#80bbae","#4eaaa5","#387c9b","#416bb9","#574390"])),
             dates=rain_dates, grids=rain_grids(), bounds=PERU),
        dict(id="corrientes2023", kind="currents", title="Corrientes del Pacífico", english="Pacific Ocean currents", lead="mama", unit="m/s",
             source="HYCOM + NCODA · GOFS 3.1", sourceUrl="https://ncss.hycom.org/thredds/catalogs/GLBy0.08/expt_93.0_uv3z.html",
             levels=list(zip([0,.1,.2,.35,.5,.75,1], ["#263857","#305781","#347d99","#3b9b9d","#57b69b","#9ac879","#e4cc76"])),
             dates=current_dates, grids=map(currents,current_dates), bounds=OCEAN),
    ]
    for disc in discs:
        disc["files"], disc["frames"] = [], []
        grids, bounds = disc.pop("grids"), disc.pop("bounds")
        for index, cells in enumerate(grids):
            filename = f'{disc["id"]}-{index + 1}.webp'
            draw_map(cells, bounds, disc["levels"], borders, MAPS / filename)
            disc["files"].append("discos-extra/" + filename)
            disc["frames"].append(cells)
        disc["dates"] = [stamp.isoformat() for stamp in disc["dates"]]
        assert len(disc["dates"]) == len(disc["frames"]) == len(disc["files"]) == 6
    (ROOT / "data" / "expansion-discs.json").write_text(json.dumps(discs, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
