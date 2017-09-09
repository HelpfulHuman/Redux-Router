import buble from "rollup-plugin-buble";

export default {
  input: "src/index.js",
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.es.js', format: 'es' },
  ],
  exports: "named",
  plugins: [ buble() ],
  onwarn (message) {
    if (/external dependency/.test(message)) return;
    console.error(message);
  }
};