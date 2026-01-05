import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useTranslation } from 'react-i18next';

interface D { class_id: number; class_name: string; confidence: number; bbox: any; }

export default function DetectionList({ detections }: { detections: D[] }) {
  const { t } = useTranslation();
  return (
    <View style={styles.c}>
      <Text style={styles.title}>{t('detections')}</Text>
      {detections.map((d, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.name}>{d.class_name}</Text>
          <Text style={styles.conf}>{t('confidence')}: {(d.confidence * 100).toFixed(1)}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  c: { padding: 16 }, title: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: colors.primary, elevation: 2 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  conf: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
});
