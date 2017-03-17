const _currentDate = Date.now();

function _reportDynamicImport(currentModule, requestedModule) {
  let diff = Date.now() - _currentDate;

  fetch("/api/report-module-import", {
    method: 'POST',
    body: JSON.stringify({
      currentModule,
      requestedModule
    })
  });
}

_reportDynamicImport("actual.js", "./bar.js"), import("./bar.js");
