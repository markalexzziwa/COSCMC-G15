/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A7C59', // A nice, rich green
        secondary: '#A8763E', // A warm, earthy brown
        accent: '#F2A900', // A vibrant yellow for highlights
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}; 