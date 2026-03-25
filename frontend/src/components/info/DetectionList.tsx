import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../../App';

interface D { class_id: number; class_name: string; confidence: number; bbox: any; }
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DetectionList({ detections }: { detections: D[] }) {
  const { t } = useTranslation();
  const nav = useNavigation<Nav>();

  return (
    <View style={styles.c}>
      <Text style={styles.title}>{t('detections')}</Text>
      {detections.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() => nav.navigate('FruitInfo', { name: d.class_name })}
        >
          <View style={styles.row}>
            <Text style={styles.name}>{d.class_name}</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
          <Text style={styles.conf}>{t('confidence')}: {(d.confidence * 100).toFixed(1)}%</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  c: { padding: 16 }, title: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: colors.primary, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  arrow: { fontSize: 22, color: colors.primary, lineHeight: 22 },
  conf: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
});
