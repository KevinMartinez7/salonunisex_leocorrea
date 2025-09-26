/** @type {import('tailwindcss').Config} */
export default {
content: [
"./src/**/*.{html,ts}",
],
theme: {
extend: {
fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },    
colors: {
brand: {
black: '#0f0f10',
white: '#f7f7f7',
accent: '#9a8c7a' // puedes ajustar el acento
}
},
boxShadow: {
soft: '0 10px 25px rgba(0,0,0,.08)'
},
borderRadius: {
xl2: '1.25rem'
}
},
},
plugins: [],
}