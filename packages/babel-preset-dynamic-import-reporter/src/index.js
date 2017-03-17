import path from 'path';
import transformDynamicImportReporter from 'babel-plugin-transform-dynamic-import-reporter';

export default function(babel, opts, { dirname }) {
  console.assert(opts.reportingRoute, "`babel-preset-dynamic-import-reporter` is missing a `reportingRoute` option");
  return {
    plugins: [
      [transformDynamicImportReporter, {
        baseDir: path.resolve(dirname, opts.baseDir || "."),
        reportingRoute: opts.reportingRoute,
      }],
    ],
  };
}
