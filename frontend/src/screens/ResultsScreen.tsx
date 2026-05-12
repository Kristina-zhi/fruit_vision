import React, { useEffect, useMemo, useState } from 'react';
import { Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../api/client';
import DetectionList from '../components/info/DetectionList';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../App';
import { AnalyzeResponse } from '../types/fruit';

type R = RouteProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const route = useRoute<R>();
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [load, setLoad] = useState(true);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result: AnalyzeResponse = await api.analyze.getById(route.params.analyzeId);
        if (active) setData(result);
      } catch (err: any) {
        Toast.show({ type: 'error', text1: t('error'), text2: err.message });
      } finally {
        if (active) setLoad(false);
      }
    })();
    return () => { active = false; };
  }, [route.params.analyzeId]);

  if (load) return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('analyze_image')}</Text>
      <Text style={styles.sub}>{data?.file_name}</Text>
      <Text style={styles.date}>{data?.analyzed_at}</Text>
      {data?.detections?.length ? (
        <DetectionList detections={data.detections} />
      ) : (
        <Text style={styles.empty}>{t('no_results')}</Text>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, padding: 16, paddingBottom: 8 },
  sub: { fontSize: 14, color: colors.textSecondary, paddingHorizontal: 16 },
  date: { fontSize: 12, color: colors.textSecondary, paddingHorizontal: 16, marginBottom: 16 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40, fontSize: 16 },
});
