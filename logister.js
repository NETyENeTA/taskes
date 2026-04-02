// 1. ПОДЦВЕТКА JSON
function highlightJson(json) {
  if (typeof json !== "string") json = JSON.stringify(json, null, 2);
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "json-number";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "json-key" : "json-string";
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      }
      return `<span class="${cls}">${match}</span>`;
    },
  );
}

// 2. ПЕРЕХВАТ CONSOLE.LOG
(function () {
  const originalLog = console.log;
  const container = document.getElementById("logimaster");

  console.log = function (...args) {
    originalLog.apply(console, args);
    const item = document.createElement("div");
    item.className = "log-item";

    const content = args
      .map((arg) => {
        if (typeof arg === "object" && arg !== null) {
          const isArr = Array.isArray(arg);
          const label = isArr ? `Array(${arg.length})` : `Object`;
          return `
                            <details>
                                <summary>${label}</summary>
                                <pre>${highlightJson(arg)}</pre>
                            </details>
                        `;
        }
        return `<strong>${arg}</strong>`;
      })
      .join(" ");

    item.innerHTML = content;
    container.appendChild(item);
  };
})();

// 3. УПРАВЛЕНИЕ КНОПКАМИ
function toggleAll(open) {
  document.querySelectorAll("details").forEach((d) => (d.open = open));
}
