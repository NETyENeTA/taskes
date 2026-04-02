function highlightJson(json) {
  if (typeof json !== "string") {
    json = JSON.stringify(json, null, 2);
  }
  // Регулярка ищет ключи, строки, числа и булевы значения
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "json-number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "json-key";
        } else {
          cls = "json-string";
        }
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    },
  );
}

(function() {
    const originalLog = console.log;
    const logContainer = document.getElementById('logimaster');

    console.log = function(...args) {
        originalLog.apply(console, args);

        const item = document.createElement('div');
        item.className = 'log-item';

        const content = args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                // Если это массив или объект — делаем его скрываемым
                const isArray = Array.isArray(arg);
                const label = isArray ? `Array(${arg.length})` : `Object { ... }`;
                const jsonHtml = highlightJson(arg);

                return `
                    <details>
                        <summary>${label}</summary>
                        <pre>${jsonHtml}</pre>
                    </details>
                `;
            }
            return `<span>${arg}</span>`;
        }).join(' ');

        item.innerHTML = content;
        logContainer.appendChild(item);
    };
})();