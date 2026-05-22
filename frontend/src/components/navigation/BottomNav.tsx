import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ThemeColors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import { RootStackParamList } from '../../../App';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: Array<{ route: 'Home' | 'Camera' | 'Fruits' | 'Settings'; icon: string; label: string }> = [
  { route: 'Home', icon: '🏠', label: 'home' },
  { route: 'Camera', icon: '📷', label: 'scan' },
  { route: 'Fruits', icon: '🍎', label: 'fruits' },
  { route: 'Settings', icon: '⚙️', label: 'settings' },
];

export default function BottomNav() {
  const nav = useNavigation<Nav>();
  const route = useRoute();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = route.name === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => {
              if (!active) nav.navigate(tab.route);
            }}
          >
            <Text style={[styles.icon, active && styles.iconActive]}>{tab.icon}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{t(tab.label)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20, opacity: 0.65 },
  iconActive: { opacity: 1 },
  label: { fontSize: 11, color: colors.textSecondary, marginTop: 3 },
  labelActive: { color: colors.primary, fontWeight: '600' },
});
