import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

interface Nutrition {
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  fiber?: number;
  water?: number;
}

interface Props {
  nutrition?: Nutrition | null;
  calories?: number;
}

export default function NutritionTable({ nutrition, calories }: Props) {
  const { t } = useTranslation();

  const rows = [
    { label: t('calories'), value: calories ?? 0, unit: t('kcal') },
    { label: t('proteins'), value: nutrition?.proteins ?? 0, unit: t('gram') },
    { label: t('fats'), value: nutrition?.fats ?? 0, unit: t('gram') },
    { label: t('carbohydrates'), value: nutrition?.carbohydrates ?? 0, unit: t('gram') },
    { label: t('fiber'), value: nutrition?.fiber ?? 0, unit: t('gram') },
    { label: t('water'), value: nutrition?.water ?? 0, unit: t('gram') },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('nutrition_per_100g')}</Text>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>
            {Number(row.value).toFixed(1)} {row.unit}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 14, color: colors.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: colors.text },
});
