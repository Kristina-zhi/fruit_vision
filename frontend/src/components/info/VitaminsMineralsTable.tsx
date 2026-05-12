import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeColors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import { Nutrient } from '../../types/fruit';

interface Props {
  vitamins: Nutrient[];
  minerals: Nutrient[];
}

export default function VitaminsMineralsTable({ vitamins, minerals }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderGroup = (title: string, items: Nutrient[]) => {
    if (!items.length) return null;
    return (
      <View style={styles.group}>
        <Text style={styles.groupTitle}>{title}</Text>
        {items.map((item, index) => (
          <View key={`${item.name}-${index}`} style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (!vitamins.length && !minerals.length) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{t('vitamins_minerals')}</Text>
        <Text style={styles.muted}>{t('no_data')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('vitamins_minerals')}</Text>
      {renderGroup(t('vitamins'), vitamins)}
      {renderGroup(t('minerals'), minerals)}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginTop: 16, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 10 },
  group: { marginBottom: 8 },
  groupTitle: { fontSize: 13, fontWeight: '700', color: colors.primaryDark, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 6, marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  name: { fontSize: 14, color: colors.text, flex: 1, paddingRight: 8 },
  amount: { fontSize: 14, fontWeight: '600', color: colors.primaryDark },
  muted: { fontSize: 14, color: colors.textSecondary },
});
