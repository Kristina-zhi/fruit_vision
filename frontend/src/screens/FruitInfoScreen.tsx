import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { colors } from '../theme/colors';
import { api } from '../api/client';
import { RootStackParamList } from '../../App';
import NutritionTable from '../components/info/NutritionTable';

type Nav = NativeStackNavigationProp<RootStackParamList, 'FruitInfo'>;
type R = RouteProp<RootStackParamList, 'FruitInfo'>;

export default function FruitInfoScreen() {
  const route = useRoute<R>();
  const nav = useNavigation<Nav>();
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await api.fruits.getByName(route.params.name);
        if (active) setData(result);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          Toast.show({ type: 'info', text1: t('fruit_not_found'), text2: route.params.name });
        } else {
          Toast.show({ type: 'error', text1: t('error'), text2: err.message });
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [route.params.name]);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;
  }

  if (!data) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyTitle}>{t('fruit_not_found')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => nav.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        {data.image_url ? (
          <Image source={{ uri: data.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        <View style={[styles.gradientLayer, styles.gradientTop]} />
        <View style={[styles.gradientLayer, styles.gradientMiddle]} />
        <View style={[styles.gradientLayer, styles.gradientBottom]} />
        <View style={styles.heroText}>
          <Text style={styles.title}>{data.display_name || data.name}</Text>
          <Text style={styles.subtitle}>
            {data.calories ?? 0} {t('kcal')}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>{data.description}</Text>

        <View style={styles.chips}>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>{t('season')}</Text>
            <Text style={styles.chipValue}>{data.season || '—'}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>{t('origin')}</Text>
            <Text style={styles.chipValue}>{data.location || '—'}</Text>
          </View>
        </View>

        <NutritionTable nutrition={data.nutrition} calories={data.calories} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('vitamins_minerals')}</Text>
          {data.vitamins?.map((item: any, index: number) => (
            <View key={`v-${index}`} style={styles.nutrientRow}>
              <Text style={styles.nutrientName}>{item.name}</Text>
              <Text style={styles.nutrientAmount}>{item.amount}</Text>
            </View>
          ))}
          {data.minerals?.map((item: any, index: number) => (
            <View key={`m-${index}`} style={styles.nutrientRow}>
              <Text style={styles.nutrientName}>{item.name}</Text>
              <Text style={styles.nutrientAmount}>{item.amount}</Text>
            </View>
          ))}
          {!data.vitamins?.length && !data.minerals?.length && (
            <Text style={styles.muted}>{t('no_data')}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center' },
  emptyScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 20 },
  backButton: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  hero: { height: 280, position: 'relative', backgroundColor: colors.primaryLight },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: { backgroundColor: colors.primaryLight },
  gradientLayer: { position: 'absolute', left: 0, right: 0 },
  gradientTop: { top: 0, height: 90, backgroundColor: 'rgba(0,0,0,0.18)' },
  gradientMiddle: { top: 90, height: 100, backgroundColor: 'rgba(0,0,0,0.28)' },
  gradientBottom: { bottom: 0, height: 110, backgroundColor: 'rgba(0,0,0,0.62)' },
  heroText: { position: 'absolute', left: 20, right: 20, bottom: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: colors.white },
  subtitle: { fontSize: 16, color: colors.white, marginTop: 4, opacity: 0.92 },
  content: { padding: 16 },
  description: { fontSize: 15, lineHeight: 22, color: colors.text, marginBottom: 16 },
  chips: { flexDirection: 'row', marginBottom: 16 },
  chip: { flex: 1, backgroundColor: colors.surface, borderRadius: 10, padding: 12, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  chipLabel: { fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipValue: { fontSize: 14, color: colors.text, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginTop: 16, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 10 },
  nutrientRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  nutrientName: { fontSize: 14, color: colors.text, flex: 1, paddingRight: 8 },
  nutrientAmount: { fontSize: 14, fontWeight: '600', color: colors.primaryDark },
  muted: { fontSize: 14, color: colors.textSecondary },
});
