import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { Nutrition } from '../../types/fruit';
import { macroDistribution } from '../../utils/nutrition';

interface Props {
  nutrition?: Nutrition | null;
}

export default function MacroChart({ nutrition }: Props) {
  const { t } = useTranslation();
  const shares = macroDistribution(nutrition);
  const total = shares.proteins + shares.fats + shares.carbohydrates;

  const entries = [
    { key: 'proteins', label: t('proteins'), value: shares.proteins, color: colors.primary },
    { key: 'fats', label: t('fats'), value: shares.fats, color: colors.accent },
    { key: 'carbohydrates', label: t('carbohydrates'), value: shares.carbohydrates, color: '#42A5F5' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('macro_distribution')}</Text>
      {total <= 0 ? (
        <Text style={styles.muted}>{t('no_data')}</Text>
      ) : (
        <>
          <View style={styles.bar}>
            {entries.map((entry) => (
              <View
                key={entry.key}
                style={{ flex: Math.max(entry.value, 0.01), backgroundColor: entry.color }}
              />
            ))}
          </View>
          <View style={styles.legend}>
            {entries.map((entry) => (
              <View key={entry.key} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: entry.color }]} />
                <Text style={styles.legendLabel}>{entry.label}</Text>
                <Text style={styles.legendValue}>{entry.value}%</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginTop: 16, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 12 },
  bar: { flexDirection: 'row', height: 22, borderRadius: 11, overflow: 'hidden', backgroundColor: colors.border },
  legend: { marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { flex: 1, fontSize: 14, color: colors.text },
  legendValue: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  muted: { fontSize: 14, color: colors.textSecondary },
});
