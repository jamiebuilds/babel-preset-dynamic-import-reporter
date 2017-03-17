import syntaxDynamicImport from "babel-plugin-syntax-dynamic-import";
import {relative as getRelativePath} from 'path';

export default function({ types: t, template }) {
  let VISITED = Symbol('visited');

  let createInitDate = template('const INIT_DATE = Date.now()');
  let createImportHelper = template(`
    function IMPORT_HELPER(currentModule, requestedModule) {
      let diff = Date.now() - INIT_DATE;

      fetch(ROUTE, {
        method: 'POST',
        body: JSON.stringify({
          currentModule,
          requestedModule
        })
      });
    }
  `);

  let addHelper = (path, opts) => {
    let initDateId = path.scope.generateUidIdentifier('currentDate');
    let importHelperId = path.scope.generateUidIdentifier('reportDynamicImport');

    let program = path.findParent(p => p.isProgram());
    let firstStatement = program.get('body')[0];

    firstStatement.insertBefore(createInitDate({
      INIT_DATE: initDateId
    }));

    firstStatement.insertBefore(createImportHelper({
      INIT_DATE: initDateId,
      IMPORT_HELPER: importHelperId,
      ROUTE: t.stringLiteral(opts.route)
    }));

    return importHelperId;
  };

  return {
    inherits: syntaxDynamicImport,
    visitor: {
      CallExpression(path) {
        if (path.node[VISITED]) return;
        if (!path.get('callee').isImport()) return;

        let filename = this.file.opts.filename;
        let baseDir = this.opts.baseDir;
        let reportingRoute = this.opts.reportingRoute;

        console.assert(filename, "`babel-plugin-transform-dynamic-import-reporter` is missing a `filename`");
        console.assert(baseDir, "`babel-plugin-transform-dynamic-import-reporter` is missing a `baseDir`");
        console.assert(reportingRoute, "`babel-plugin-transform-dynamic-import-reporter` is missing a `reportingRoute`");

        let relativePath = getRelativePath(baseDir, filename);

        path.node[VISITED] = true;

        if (!this.helperId) {
          this.helperId = addHelper(path, {
            route: this.opts.reportingRoute
          });
        }

        let importString = path.get('arguments')[0];

        path.replaceWith(
          t.sequenceExpression([
            t.callExpression(this.helperId, [
              t.stringLiteral(relativePath),
              t.stringLiteral(importString.node.value)
            ]),
            path.node
          ])
        );
      }
    }
  };
}
