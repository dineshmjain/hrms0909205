/** @type {import('tailwindcss').Config} */

import withMT from "@material-tailwind/react/utils/withMT";
module.exports = withMT({
content: [
    "./ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["popins",], // Add your custom font here
      },
      letterSpacing: {
        widest: '-0.025em', // confirm this still exists
      },
      colors: {
        theme3: '#0f0525',
        // background: "#e2e8f5",
        background: "#f1f5f9",
        // background: "#d3ddf2",
        // background: "#bbc7e3",
        tableBg: "#ffffff",
        tableBgHover: "#f3f4f6",
        backgroundHover: "#cbd1dd",
        theme4: '#E0E0E0',
        // tableBg: '#ffffff',
        // tableBgHover: '#e6e6e6',
        primary: '#0084d1',
        secondary: '#fefefe',
        primaryLight:"#c8f4ff",
        primaryMedium:"#81d0ff",
        primaryDark:"#00708c",
        // pop: '#0097bc',
        pop: '#32363A',
        popLight: '#f1f5f9',
        popMedium: '#cdd0d4',
        // pop: '#FF461D',
        // popLight:"#ffdad2",
        // popDark:"#e63f1a",
        tertiary: '#000000',
        black: '#000000',
        quaternary: '#ffffff',
        borderColor: '#e9eaec',
        'header': 'linear-gradient(180deg, rgba(0,132,209,1) 0%, rgba(50,54,58,1) 100%)',
        "custom-head":'#575757',
        "custom-head-light":'#575757',

      },
      // colors: {
      //   theme3: '#0f0525',
      //   // background: "#e2e8f5",
      //   background: "#ebf5ff",
      //   // background: "#d3ddf2",
      //   // background: "#bbc7e3",
      //   tableBg: "#ffffff",
      //   tableBgHover: "#f3f4f6",
      //   backgroundHover: "#cbd1dd",
      //   theme4: '#E0E0E0',
      //   // tableBg: '#ffffff',
      //   // tableBgHover: '#e6e6e6',
      //   primary: '#32363A',
      //   secondary: '#fefefe',
      //   // pop: '#0097bc',
      //   pop: '#0084d1',
      //   popLight:"#c8f4ff",
      //   popDark:"#00708c",
      //   // pop: '#FF461D',
      //   // popLight:"#ffdad2",
      //   // popDark:"#e63f1a",
      //   tertiary: '#000000',
      //   black: '#000000',
      //   quaternary: '#ffffff',
      //   borderColor: '#e9eaec',
      //   'header': 'linear-gradient(180deg, rgba(0,132,209,1) 0%, rgba(50,54,58,1) 100%)'
      // },
      screens: {
        maxsm: { max: '640px' },
        maxmd: { max: '768px' },
        maxlg: { max: '1024px' },
        maxxl: { max: '1280px' },
        max2xl: { max: '1536px' },
        sm: { min: '640px' },
        md: { min: '768px' },
        lg: { min: '1024px' },
        xl: { min: '1280px' },

      },
      boxShadow: {
        'hrms': '0 2px 4px rgba(0,0,20,.08),0 1px 2px rgba(0,0,20,.08)',
        'dropdown': '0px 0px 20px -8px #000,0 1px 2px rgba(0,0,20,.08)',
        'nav': '0px 0px 37px -21px #000',
        // 'hrms': '0px 0px 10px -6px #000',
      },
      backgroundImage: {
        'header': 'linear-gradient(180deg, rgba(0,132,209,1) 0%, rgba(50,54,58,1) 100%)'
      },
      borderColor: theme => ({
        ...theme('colors'),
      }),

    }
  },
  plugins: [],
});
