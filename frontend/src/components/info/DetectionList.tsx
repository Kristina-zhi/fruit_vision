import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeColors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../../App';
import { Detection } from '../../types/fruit';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DetectionList({ detections }: { detections: Detection[] }) {
  const { t } = useTranslation();
  const nav = useNavigation<Nav>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.c}>
      <Text style={styles.title}>{t('detections')}</Text>
      {detections.map((d, i) => {
        const name = d.fruit?.display_name || d.class_name;
        const fruitName = d.fruit?.name || d.class_name;
        return (
          <TouchableOpacity
            key={`${fruitName}-${i}`}
            style={styles.card}
            onPress={() => nav.navigate('FruitInfo', { name: fruitName })}
          >
            <View style={styles.row}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
            <Text style={styles.conf}>{t('confidence')}: {(d.confidence * 100).toFixed(1)}%</Text>
            {d.fruit?.calories != null ? (
              <Text style={styles.meta}>{d.fruit.calories} {t('kcal')} / 100 {t('gram')}</Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  c: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: colors.primary, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  arrow: { fontSize: 22, color: colors.primary, lineHeight: 22 },
  conf: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  meta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
