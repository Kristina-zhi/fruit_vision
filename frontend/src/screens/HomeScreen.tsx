import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../api/client';
import { useAuth } from '../store/AuthContext';
import BottomNav from '../components/navigation/BottomNav';
import { RootStackParamList } from '../../App';
import { AnalyzeResponse, HistoryResponse } from '../types/fruit';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useTranslation();
  const { email } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [recent, setRecent] = useState<AnalyzeResponse[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const result: HistoryResponse = await api.analyze.getHistory(0, 3);
          if (active) setRecent(result.items || []);
        } catch (err: any) {
          Toast.show({ type: 'error', text1: t('error'), text2: err.message });
        }
      })();
      return () => { active = false; };
    }, [])
  );

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>{t('welcome')}</Text>
        <Text style={styles.email}>{email || t('guest')}</Text>

        <TouchableOpacity style={styles.scanCard} onPress={() => nav.navigate('Camera')}>
          <Text style={styles.scanIcon}>📷</Text>
          <View style={styles.scanText}>
            <Text style={styles.scanTitle}>{t('scan_fruit')}</Text>
            <Text style={styles.scanSubtitle}>{t('scan_fruit_hint')}</Text>
          </View>
          <Text style={styles.scanArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recent_scans')}</Text>
          <TouchableOpacity onPress={() => nav.navigate('History')}>
            <Text style={styles.link}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>

        {recent.length ? (
          recent.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.scanRow}
              onPress={() => nav.navigate('Results', { analyzeId: item.id })}
            >
              <View style={styles.scanDot} />
              <View style={styles.scanRowText}>
                <Text style={styles.scanName} numberOfLines={1}>{item.file_name}</Text>
                <Text style={styles.scanDate}>{item.analyzed_at}</Text>
              </View>
              <Text style={styles.scanCount}>{item.detections?.length || 0}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.empty}>{t('empty_history')}</Text>
        )}

        <TouchableOpacity style={styles.catalogButton} onPress={() => nav.navigate('Fruits')}>
          <Text style={styles.catalogTitle}>🍏 {t('all_fruits')}</Text>
          <Text style={styles.catalogSubtitle}>{t('catalog_hint')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: colors.text },
  email: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  scanCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 16, padding: 18 },
  scanIcon: { fontSize: 30, marginRight: 14 },
  scanText: { flex: 1 },
  scanTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
  scanSubtitle: { fontSize: 13, color: colors.white, opacity: 0.85, marginTop: 3 },
  scanArrow: { fontSize: 28, color: colors.white },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  link: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  scanRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  scanDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: 10 },
  scanRowText: { flex: 1 },
  scanName: { fontSize: 15, fontWeight: '600', color: colors.text },
  scanDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  scanCount: { fontSize: 14, fontWeight: '700', color: colors.primary },
  empty: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  catalogButton: { marginTop: 20, backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  catalogTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  catalogSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
