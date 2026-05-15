import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../store/AuthContext';
import { setAppLanguage } from '../i18n';
import { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const nav = useNavigation<Nav>();
  const { t, i18n } = useTranslation();
  const { colors, isDark, setMode } = useTheme();
  const { logout } = useAuth();
  const [language, setLanguage] = useState(i18n.language === 'en' ? 'en' : 'ru');
  const styles = useMemo(() => createStyles(colors), [colors]);

  async function changeLanguage(next: 'ru' | 'en') {
    setLanguage(next);
    await setAppLanguage(next);
  }

  async function doLogout() {
    await logout();
    nav.replace('Login');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>{t('appearance')}</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('dark_theme')}</Text>
          <Switch
            value={isDark}
            onValueChange={(value) => setMode(value ? 'dark' : 'light')}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isDark ? colors.primary : colors.surface}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t('language')}</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.languageRow, language === 'ru' && styles.languageRowActive]}
          onPress={() => changeLanguage('ru')}
        >
          <Text style={styles.languageText}>{t('russian')}</Text>
          {language === 'ru' ? <Text style={styles.check}>✓</Text> : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.languageRow, styles.languageRowLast, language === 'en' && styles.languageRowActive]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={styles.languageText}>{t('english')}</Text>
          {language === 'en' ? <Text style={styles.check}>✓</Text> : null}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{t('about')}</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('version')}</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={doLogout}>
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 18, marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  rowLabel: { fontSize: 16, color: colors.text },
  rowValue: { fontSize: 16, color: colors.textSecondary },
  languageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  languageRowLast: { borderBottomWidth: 0 },
  languageRowActive: { backgroundColor: colors.surfaceAlt },
  languageText: { fontSize: 16, color: colors.text },
  check: { fontSize: 18, fontWeight: '700', color: colors.primary },
  logoutButton: { marginTop: 28, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.error, borderRadius: 12, padding: 16, alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: '600', color: colors.error },
});
