(() => {
  "use strict";
  const expression = /\{\{\s*([\w.]+)\s*\}\}/g;
  const binding = /^\{\{\s*([\w.]+)\s*\}\}$/;
  const read = path => {
    const keys = path.split(".");
    return scope => {
      for (const key of keys) scope = scope?.[key];
      return scope;
    };
  };
  const direct = value => read(value.match(binding)?.[1] ?? "");
  const interpolate = template => {
    const single = template.match(binding);
    if (single) {
      const value = read(single[1]);
      return scope => String(value(scope) ?? "");
    }
    const parts = [];
    let end = 0;
    for (const match of template.matchAll(expression)) {
      parts.push({ text: template.slice(end, match.index), value: read(match[1]) });
      end = match.index + match[0].length;
    }
    const tail = template.slice(end);
    return scope => {
      let result = "";
      for (const part of parts) result += part.text + (part.value(scope) ?? "");
      return result + tail;
    };
  };
  const dynamic = value => value.includes("{{");
  const compile = nodes => Array.from(nodes).flatMap(compileNode);

  function compileNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.data;
      if (!dynamic(text)) return [];
      const renderText = interpolate(text);
      return [scope => {
        const value = renderText(scope);
        if (node.data !== value) node.data = value;
      }];
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return [];
    const tag = node.localName;
    const nativeList = tag === "template" && node.hasAttribute("data-sc-for");
    if (tag === "sc-if" || tag === "sc-for" || nativeList) {
      const list = tag === "sc-for" || nativeList;
      const alias = node.getAttribute(nativeList ? "data-sc-as" : "as");
      const readItems = direct(node.getAttribute(nativeList ? "data-sc-for" : list ? "list" : "value"));
      const template = document.createElement("template");
      template.content.append(...(nativeList ? node.content.childNodes : node.childNodes));
      const anchor = document.createComment(tag);
      node.replaceWith(anchor);
      const entries = [];
      return [scope => {
        const value = readItems(scope);
        const items = list ? value ?? [] : value ? [null] : [];
        while (entries.length > items.length) {
          const { start, end } = entries.pop();
          while (start.nextSibling !== end) start.nextSibling.remove();
          start.remove();
          end.remove();
        }
        items.forEach((item, i) => {
          const next = list ? Object.assign(Object.create(scope), { [alias]: item }) : scope;
          let entry = entries[i];
          if (!entry) {
            const fragment = template.content.cloneNode(true);
            const updates = compile(fragment.childNodes);
            const start = document.createComment("");
            const end = document.createComment("");
            fragment.prepend(start);
            fragment.append(end);
            entry = { start, end, updates };
            entries.push(entry);
            entry.updates.forEach(update => update(next));
            anchor.before(fragment);
          } else {
            entry.updates.forEach(update => update(next));
          }
        });
      }];
    }
    const updates = compile(node.childNodes);
    for (const { name, value } of Array.from(node.attributes)) {
      if (!dynamic(value)) continue;
      if (name === "data-grid" && tag === "canvas") {
        node.removeAttribute(name);
        const readColors = direct(value);
        let previous;
        updates.push(scope => {
          const colors = readColors(scope);
          if (!colors || colors === previous) return;
          const context = node.getContext("2d");
          if (!context) return;
          previous = colors;
          context.fillStyle = "#383d50";
          context.fillRect(0, 0, node.width, node.height);
          colors.forEach((color, i) => {
            context.fillStyle = color;
            context.fillRect((i % 28) * 10, Math.floor(i / 28) * 10, 9, 9);
          });
        });
      } else if (name.startsWith("on")) {
        node.removeAttribute(name);
        const handler = direct(value);
        updates.push(scope => { node[name] = handler(scope) ?? null; });
      } else if (name === "disabled" || name === "hidden" || name === "checked" || name === "open") {
        node.removeAttribute(name);
        const readState = direct(value);
        updates.push(scope => { const on = !!readState(scope); node.toggleAttribute(name, on); if (name === "checked") node.checked = on; });
      } else if (name === "value" && ["select", "input", "textarea"].includes(tag) && node.type !== "file") {
        node.removeAttribute(name);
        const readValue = interpolate(value);
        updates.push(scope => { const selected = readValue(scope); if (node.value !== selected) node.value = selected; });
      } else {
        const readValue = interpolate(value);
        updates.push(scope => {
          const result = readValue(scope);
          if ((name === "src" || name === "href") && result === "") node.removeAttribute(name);
          else if (node.getAttribute(name) !== result) node.setAttribute(name, result);
        });
      }
    }
    return updates;
  }

  let component;
  let bindings;
  const render = () => {
    const scope = component.renderVals();
    bindings.forEach(update => update(scope));
  };
  window.DCLogic = class {
    constructor(props) { this.props = props; }
    setState(patch, complete) {
      Object.assign(this.state, patch);
      render();
      complete?.();
    }
  };
  window.mountTerrasonic = Component => {
    const template = document.querySelector("#terrasonic-template");
    const root = template.content.cloneNode(true);
    const helmet = root.querySelector("helmet");
    document.head.append(...helmet.children);
    helmet.remove();
    bindings = compile(root.childNodes);
    component = new Component({});
    render();
    template.replaceWith(root);
    component.componentDidMount?.();
    if (location.hash === "#banda") {
      component.tourEnd();
      component.goTab("band");
    } else if (location.hash === "#escuchar" || location.hash === "#listen") {
      component.goTab("juke");
    } else if (location.hash === "#jugar" || location.hash === "#play") {
      component.goTab("game");
    }
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", render);
    window.addEventListener("pagehide", event => {
      if (event.persisted) {
        // A history-cache entry can return with the same component and files.
        // Pause transient work without permanently disposing that component.
        component.stopSpeech?.();
        component.stop?.();
        component.cancelBandClip?.();
        component.cinema?.finish(false);
        component.routeFinish?.();
      } else component.componentWillUnmount?.();
    });
    window.addEventListener("pageshow", event => {
      if (event.persisted) {
        render();
        component.ensureNavVisible?.();
        component.onTourResize?.();
      }
    });
  };
  document.addEventListener("DOMContentLoaded", () => {
    const source = document.querySelector("script[data-dc-script]");
    const runtime = document.createElement("script");
    runtime.textContent = source.textContent + "\nmountTerrasonic(Component);";
    document.body.append(runtime);
  });
})();
