module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};

/*
  Add the following preset as well if using React.js in your project.
  It replaces the 'react' import source when importing functions, and adds some
  optimization under the hood.

  https://babeljs.io/docs/en/babel-preset-react/#react-automatic-runtime

**/
