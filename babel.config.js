// eslint-disable-next-line
module.exports = {
  presets: [
    [
      '@babel/preset-env',
    ],
  ],
  plugins: [
    // for vuex-class-component
    [ '@babel/plugin-proposal-decorators', { legacy: true } ],
    [ '@babel/plugin-proposal-class-properties', { legacy: true } ],
  ],
}
