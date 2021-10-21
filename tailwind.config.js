module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
       'hero-page': "url('/assets/img/starterpage-bg.jpg')"
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
