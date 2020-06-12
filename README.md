# nexe-webpack-plugin

> Webpack plugin to emit binary package compiled by nexe

## Getting Started

Installation:

```console
$ npm install -D nexe-webpack-plugin
```

Configuration:

**webpack.config.js**

```js
const { NexePlugin } = require('nexe-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: 'entry.js',
  output: {
    path: 'build',
  },
  plugins: [
    new NexePlugin({
      output: 'sample-bin',
    }),
  ],
};
```

This emits `build/entry.js` and `build/sample-bin` that is compiled by nexe.

## License

MIT &copy; fmatzy
