import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { Nutrition } from '../../types/fruit';
import { dailyValuePercent, NutritionKey } from '../../utils/nutrition';

interface Props {
  nutrition?: Nutrition | null;
  calories?: number;
}

interface Row {
  key: NutritionKey;
  label: string;
  value: number;
  unit: string;
}

export default function NutritionTable({ nutrition, calories }: Props) {
  const { t } = useTranslation();

  const rows: Row[] = [
    { key: 'calories', label: t('calories'), value: nutrition?.calories ?? calories ?? 0, unit: t('kcal') },
    { key: 'proteins', label: t('proteins'), value: nutrition?.proteins ?? 0, unit: t('gram') },
    { key: 'fats', label: t('fats'), value: nutrition?.fats ?? 0, unit: t('gram') },
    { key: 'carbohydrates', label: t('carbohydrates'), value: nutrition?.carbohydrates ?? 0, unit: t('gram') },
    { key: 'fiber', label: t('fiber'), value: nutrition?.fiber ?? 0, unit: t('gram') },
    { key: 'water', label: t('water'), value: nutrition?.water ?? 0, unit: t('gram') },
  ];

  const formatValue = (row: Row) => {
    if (row.key === 'calories') return `${Math.round(row.value)} ${row.unit}`;
    return `${Number(row.value).toFixed(1)} ${row.unit}`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('nutrition_per_100g')}</Text>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.label, styles.headerText]}>{t('indicator')}</Text>
        <Text style={[styles.value, styles.headerText]}>{t('value')}</Text>
        <Text style={[styles.percent, styles.headerText]}>{t('daily_value_short')}</Text>
      </View>
      {rows.map((row) => (
        <View key={row.key} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{formatValue(row)}</Text>
          <Text style={styles.percent}>{dailyValuePercent(row.key, row.value)}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerRow: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  headerText: { fontWeight: '700', color: colors.primaryDark },
  label: { flex: 1.3, fontSize: 14, color: colors.textSecondary },
  value: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'right' },
  percent: { width: 64, fontSize: 14, fontWeight: '600', color: colors.primaryDark, textAlign: 'right' },
});
