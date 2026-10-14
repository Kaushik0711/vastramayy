/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss}",
  ],
  theme: {
    extend: {
      colors: {
        // Curated Brand Palette
        brand: {
          espresso: {
            DEFAULT: '#38231F',
            50: '#F5EFEB',
            100: '#E7DDD7',
            200: '#D0BCB2',
            300: '#B6978B',
            400: '#7B4C42',
            500: '#54342E',
            600: '#38231F', // Base Espresso
            700: '#2C1A17',
            800: '#201210',
            900: '#140A09',
          },
          plum: {
            DEFAULT: '#3D1838',
            50: '#F7EDF6',
            100: '#EBD4EA',
            200: '#D7ADD5',
            300: '#BE7FBB',
            400: '#8A3B83',
            500: '#5D2456',
            600: '#3D1838', // Base Deep Plum
            700: '#2E112A',
            800: '#200B1D',
            900: '#130511',
          },
          terracotta: {
            DEFAULT: '#873E36',
            50: '#FDF4F3',
            100: '#F9E4E2',
            200: '#F2C5C1',
            300: '#E79D96',
            400: '#BA574D',
            500: '#873E36', // Base Terracotta
            600: '#73332C',
            700: '#5D2822',
            800: '#461D19',
            900: '#311310',
          },
          gold: {
            DEFAULT: '#B99B69',
            50: '#FAF7F1',
            100: '#F3EDE0',
            200: '#E5DAC0',
            300: '#D4C39B',
            400: '#B99B69', // Base Antique Gold
            500: '#9E804E',
            600: '#7F6539',
            700: '#614B27',
            800: '#45341A',
            900: '#2B200E',
          },
          ivory: {
            DEFAULT: '#F5EFE6',
            50: '#FCFAF7',
            100: '#F5EFE6', // Base Warm Ivory
            200: '#EBE2D5',
            300: '#DED2C1',
            400: '#CEBEA9',
            500: '#B5A28A',
            600: '#99846C',
            700: '#7B6852',
            800: '#5A4A3A',
            900: '#3B3025',
          },
          sage: {
            DEFAULT: '#65715A',
            50: '#F4F6F3',
            100: '#E6EAE4',
            200: '#CCD5C9',
            300: '#ADBC99',
            400: '#839274',
            500: '#65715A', // Base Sage
            600: '#525C48',
            700: '#3E4736',
            800: '#2B3225',
            900: '#1B2017',
          },
          ink: {
            DEFAULT: '#201C1B',
            50: '#F5F4F4',
            100: '#E6E4E4',
            200: '#CAC7C6',
            300: '#A7A3A2',
            400: '#686362',
            500: '#423E3D',
            600: '#2B2625',
            700: '#201C1B', // Base Ink
            800: '#171312',
            900: '#0C0A09',
          },
          white: '#FFFFFF',
        },
        // Semantic Token Mappings
        surface: {
          page: '#F5EFE6',       // Warm Ivory background
          card: '#FFFFFF',       // Pure white card
          elevated: '#FAF7F2',   // Layered tinted surface
          dark: '#38231F',       // Espresso dark mode / campaign
          plum: '#3D1838',       // Deep Plum jewel surface
          overlay: 'rgba(32, 28, 27, 0.65)',
        },
        text: {
          primary: '#201C1B',    // Ink
          secondary: '#685F5D',  // Muted charcoal
          accent: '#B99B69',     // Antique gold
          light: '#F5EFE6',      // Warm ivory for dark surfaces
        },
        border: {
          subtle: 'rgba(56, 35, 31, 0.10)',
          medium: 'rgba(56, 35, 31, 0.18)',
          gold: 'rgba(185, 155, 105, 0.35)',
        },
        // Backward compatibility mappings
        vastra: {
          gold: {
            50: '#FAF7F1',
            100: '#F3EDE0',
            200: '#E5DAC0',
            300: '#D4C39B',
            400: '#B99B69',
            500: '#9E804E',
            600: '#7F6539',
            700: '#614B27',
            800: '#45341A',
            900: '#2B200E',
          },
          maroon: {
            50: '#FDF4F3',
            100: '#F9E4E2',
            200: '#F2C5C1',
            300: '#E79D96',
            400: '#BA574D',
            500: '#873E36',
            600: '#73332C',
            700: '#5D2822',
            800: '#461D19',
            900: '#311310',
          },
          navy: {
            50: '#F5F4F4',
            100: '#E6E4E4',
            200: '#CAC7C6',
            300: '#A7A3A2',
            400: '#54342E',
            500: '#38231F',
            600: '#2C1A17',
            700: '#201C1B',
            800: '#1A1414',
            900: '#0C0A09',
            950: '#080606',
          },
          emerald: {
            50: '#F4F6F3',
            100: '#E6EAE4',
            200: '#CCD5C9',
            300: '#ADBC99',
            400: '#839274',
            500: '#65715A',
            600: '#525C48',
            700: '#3E4736',
            800: '#2B3225',
            900: '#1B2017',
          },
          sand: {
            50: '#FCFAF7',
            100: '#F5EFE6',
            200: '#EBE2D5',
            300: '#DED2C1',
            400: '#CEBEA9',
            500: '#B5A28A',
            600: '#99846C',
            700: '#7B6852',
            800: '#5A4A3A',
            900: '#3B3025',
          },
          charcoal: {
            50: '#F5F4F4',
            100: '#E6E4E4',
            200: '#CAC7C6',
            300: '#A7A3A2',
            400: '#686362',
            500: '#423E3D',
            600: '#2B2625',
            700: '#201C1B',
            800: '#171312',
            900: '#0C0A09',
          }
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        cursive: ['"Alex Brush"', '"Playfair Display"', 'cursive'],
      },
      borderRadius: {
        'arch': '120px 120px 12px 12px',
        'arch-sm': '60px 60px 8px 8px',
        'arch-lg': '160px 160px 16px 16px',
      },
      boxShadow: {
        'subtle': '0 2px 8px -1px rgba(32, 28, 27, 0.04)',
        'elevated': '0 10px 25px -4px rgba(56, 35, 31, 0.08), 0 4px 6px -2px rgba(56, 35, 31, 0.03)',
        'luxury': '0 20px 35px -8px rgba(56, 35, 31, 0.12), 0 0 1px 1px rgba(185, 155, 105, 0.2)',
        '3d-lift': '0 15px 30px -5px rgba(56, 35, 31, 0.15), 0 8px 10px -6px rgba(56, 35, 31, 0.08)',
        'gold-glow': '0 0 20px rgba(185, 155, 105, 0.25)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
