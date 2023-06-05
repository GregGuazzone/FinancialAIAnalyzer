/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#a0aec0',
        600: '#718096',
        700: '#4a5568',
        800: '#2d3748',
        900: '#1a202c'
      },
      bluegrey : {
        100: '#b3cae6',
        200: '#6694cc',
        300: '#5387c6',
        400: '#336199',
        500: '#203d60'
      },
      blue: {
        100: '#b3cae6',
        200: '#6694cc',
        300: '#5387c6',
        400: '#336199',
        500: '#203d60',
        600: '#1a365d',
        700: '#102a4c',
        800: '#081c36',
        900: '#040e1b'
        
      },
    },
        extend: {},
  },
  plugins: [],
}
