module.exports = {
  content: ['./src/**/*.vue', './public/*.html'],
  theme: {
    extend: {
      fontFamily: {
        title: ['galdwinlight'],
        subtitle: ['ubuntu'],
      },
      colors: {
        primary: {
          300: '#a0ec93',
          400: '#90e481',
          500: '#73d162',
          600: '#1d8361',
        },
      },
    },
  },
  plugins: [],
};
