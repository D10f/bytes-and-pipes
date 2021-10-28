module.exports = {
  presets: [
    '@babel/preset-env',
    [ '@babel/preset-react', { automatic: true } ],
    '@babel/preset-typescript',
  ],
  plugins: [
    'react-refresh/babel',
    '@babel/plugin-transform-runtime'
  ]
};
