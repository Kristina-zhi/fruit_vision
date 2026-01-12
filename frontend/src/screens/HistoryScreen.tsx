import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { api } from '../api/client';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList, 'History'>;

export default function HistoryScreen() {
  const [items, setItems] = useState<any[]>([]); const [load, setLoad] = useState(true);
  const nav = useNavigation<Nav>(); const { t } = useTranslation();
  useEffect(() => { (async () => { try { setItems((await api.analyze.getHistory(0, 50)).items || []); } catch (err: any) { Toast.show({ type: 'error', text1: t('error'), text2: err.message }); } finally { setLoad(false); } })(); }, []);
  if (load) return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;
  return (
    <FlatList style={styles.container} data={items} keyExtractor={(i) => String(i.id)}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => nav.navigate('Results', { analyzeId: item.id })}>
          <Text style={styles.name}>{item.file_name}</Text><Text style={styles.date}>{item.analyzed_at}</Text>
          <Text style={styles.det}>{item.detections?.length || 0} detections</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.empty}>{t('no_results')}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center' },
  card: { backgroundColor: colors.surface, margin: 8, padding: 16, borderRadius: 8, elevation: 2, borderLeftWidth: 4, borderLeftColor: colors.primary },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  date: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  det: { fontSize: 14, color: colors.primary, marginTop: 8 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40, fontSize: 16 },
});
