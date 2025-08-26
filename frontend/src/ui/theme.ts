export const palette = {
  bg: '#0a0e1a',
  bgSecondary: '#0f1419', 
  card: '#1a2332',
  cardAlt: '#0d253d',
  cardBackground: 'rgba(26,35,50,0.6)',
  cardHover: '#243447',
  primary: '#00d4ff',
  text: '#f0f4f8',
  textSecondary: '#b8c5d1',
  muted: '#7a8ca0',
  tint: '#00d4ff',
  tintSecondary: '#0099cc',
  accent: '#ff6b6b',
  success: '#4ecdc4',
  warning: '#ffe66d',
  error: '#ff5757',
  purple: '#a78bfa',
  orange: '#ffa726',
};

export const gradients = {
  primary: ['#0a0e1a', '#1a2332', '#0f2741'],
  secondary: ['#0f2741', '#243447', '#1a2332'],
  accent: ['#00d4ff', '#0099cc', '#0066cc'],
  card: ['rgba(26,35,50,0.8)', 'rgba(15,39,65,0.6)'],
  overlay: ['rgba(10,14,26,0.9)', 'rgba(26,35,50,0.7)'],
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  heading1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  title: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 20,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
};