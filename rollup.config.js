import buble from "rollup-plugin-buble";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.es.js', format: 'es' },
  ],
  external: [
    "arr-flatten",
    "path-to-regexp",
    "@helpfulhuman/router-kit",
    "history/createBrowserHistory",
  ],
  exports: "named",
  plugins: [
    resolve({
      jsnext: true,
    }),
    buble(),
  ],
  onwarn (message) {
    if (/external dependency/.test(message)) return;
    console.error(message);
  }
};