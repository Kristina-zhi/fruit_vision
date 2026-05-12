export type ThemeColors = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  error: string;
  success: string;
  warning: string;
  text: string;
  textSecondary: string;
  border: string;
  white: string;
  black: string;
  overlay: string;
  carbs: string;
};

export const lightColors: ThemeColors = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',
  accent: '#FF9800',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF7EE',
  error: '#F44336',
  success: '#2E7D32',
  warning: '#F57C00',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.45)',
  carbs: '#42A5F5',
};

export const darkColors: ThemeColors = {
  primary: '#66BB6A',
  primaryDark: '#81C784',
  primaryLight: '#1B3B1D',
  accent: '#FFB74D',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#263026',
  error: '#EF5350',
  success: '#81C784',
  warning: '#FFB74D',
  text: '#F5F5F5',
  textSecondary: '#B0B0B0',
  border: '#333333',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
  carbs: '#64B5F6',
};

// Light palette is kept as the default for code that does not use the theme hook yet.
export const colors = lightColors;
