/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'braze': {
          purple: '#801ED7',
          action: '#5710E5',
          'purple-light': '#7C3AED',
          'purple-lighter': '#A855F7',
          'purple-dark': '#300266',
          orange: '#FFA524',
          pink: '#FFA4FB',
        },
        'container': {
          white: '#FFFFFF',
          orange: '#FFA524',
          purple: '#801ED7',
          pink: '#FFA4FB',
          'dark-purple': '#300266',
          'braze-action': '#5710E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'title-mobile': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'subtitle': ['16px', { lineHeight: '1.5' }],
        'subtitle-mobile': ['14px', { lineHeight: '1.5' }],
        'search': ['14px', { lineHeight: '1.5' }],
        'category': ['14px', { lineHeight: '1.5' }],
        'category-mobile': ['12px', { lineHeight: '1.5' }],
      },
      spacing: {
        'header-mobile': '216px',
        'header-sm': '280px',
        'header-lg': '344px',
      },
      borderRadius: {
        'standard': '12px',
        'large': '24px',
      },
      padding: {
        'card-mobile': '12px',
        'card-desktop': '32px',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to bottom right, #5710E5, #7C3AED, #A855F7)',
        'gradient-bg': 'linear-gradient(to bottom right, rgb(248 250 252), rgba(239 246 255 / 0.3), rgba(250 245 255 / 0.2))',
        'gradient-card': 'linear-gradient(to bottom right, #ffffff, #fafbff)',
      },
    },
  },
  plugins: [],
}

