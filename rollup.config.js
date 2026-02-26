import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  plugins: [json()],  
  output: [
    {
      file: 'dist/ai-summarize-widget.umd.js',
      format: 'umd',
      name: 'AISummarizeWidget'
    },
    {
      file: 'dist/ai-summarize-widget.min.js',
      format: 'umd',
      name: 'AISummarizeWidget',
      plugins: [terser()]
    },
    {
      file: 'dist/ai-summarize-widget.esm.js',
      format: 'es'
    }
  ]
};