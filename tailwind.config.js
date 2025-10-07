/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette Garden Gold Green (basée sur les templates)
        'brand-green': '#00C853',
        'brand-gold': '#FFD700',
        'brand-silver': '#C0C0C0',
        'brand-black': '#0A0A0A',
        'brand-gray': '#1A1A1A',
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
        'dark-border': '#2D2D2D',
        'gold-text': '#FFD700',
        
        // Couleurs utilitaires (gardées pour compatibilité)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(255, 215, 0, 0.4)',
        'green-glow': '0 0 15px rgba(0, 200, 83, 0.4)',
        'gold-focus': '0 0 0 3px rgba(255, 215, 0, 0.2)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(45deg, #FFD700, #E4A11B)',
        'hero-gradient': 'linear-gradient(to top, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, 0.6) 50%, rgba(10, 10, 10, 1) 100%)',
      },
    },
  },
  plugins: [],
}
