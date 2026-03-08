/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/client/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          purple: {
            50: '#F5E6F7',
            100: '#E8D5F0',
            200: '#D4B8E4',
            300: '#C09AD7',
            400: '#AC7CCB',
            500: '#9B5DBF',
            600: '#7B2D8E',
            700: '#5E226C',
            800: '#41174A',
            900: '#240B29',
          },
          whatsapp: {
            50: '#E8F8EE',
            100: '#C5EBD7',
            200: '#9EDBBE',
            300: '#77CEA5',
            400: '#50C28C',
            500: '#25D366',
            600: '#1DB954',
            700: '#158F42',
            800: '#0F6531',
            900: '#083B1F',
          },
        },
      },
    },
    plugins: [],
}
