# babel-preset-dynamic-import-reporter

Report timing data about `import()` back to an endpoint using a POST request.

## Example

**In**

```js
import("./bar.js");
import("./baz.js");
```

**Out**

```js
const _currentDate = Date.now();

function _reportDynamicImport(currentModule, requestedModule) {
  let timing = Date.now() - _currentDate;

  fetch("/api/report-module-import", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timing,
      currentModule,
      requestedModule
    })
  });
}

_reportDynamicImport("foo.js", "./bar.js"), import("./bar.js");
_reportDynamicImport("foo.js", "./baz.js"), import("./baz.js");
```

## Installation

```sh
$ npm install babel-preset-dynamic-import-reporting
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "presets": [
    ["dynamic-import-reporting", {
      "reportingRoute": "/api/report-module-import"
    }]
  ]
}
```

### Via CLI

```sh
$ babel --presets [ dynamic-import-reporting --reportingRoute "/api/report-module-import" ] script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  presets: [
    ["dynamic-import-reporting", {
      reportingRoute: "/api/report-module-import"
    }]
  ]
});
```
