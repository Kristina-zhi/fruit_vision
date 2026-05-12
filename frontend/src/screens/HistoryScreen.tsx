import React, { useEffect, useMemo, useState } from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../api/client';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../App';
import { AnalyzeResponse, HistoryResponse } from '../types/fruit';

type Nav = NativeStackNavigationProp<RootStackParamList, 'History'>;

export default function HistoryScreen() {
  const [items, setItems] = useState<AnalyzeResponse[]>([]);
  const [load, setLoad] = useState(true);
  const nav = useNavigation<Nav>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result: HistoryResponse = await api.analyze.getHistory(0, 50);
        if (active) setItems(result.items || []);
      } catch (err: any) {
        Toast.show({ type: 'error', text1: t('error'), text2: err.message });
      } finally {
        if (active) setLoad(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (load) return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => nav.navigate('Results', { analyzeId: item.id })}>
          <Text style={styles.name}>{item.file_name}</Text>
          <Text style={styles.date}>{item.analyzed_at}</Text>
          <Text style={styles.det}>{t('detections_count', { count: item.detections?.length || 0 })}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.empty}>{t('empty_history')}</Text>}
    />
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center' },
  card: { backgroundColor: colors.surface, margin: 8, padding: 16, borderRadius: 8, elevation: 2, borderLeftWidth: 4, borderLeftColor: colors.primary },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  date: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  det: { fontSize: 14, color: colors.primary, marginTop: 8 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40, fontSize: 16 },
});
