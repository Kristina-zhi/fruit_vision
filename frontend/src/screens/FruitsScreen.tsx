import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../api/client';
import BottomNav from '../components/navigation/BottomNav';
import { RootStackParamList } from '../../App';
import { FruitSummary } from '../types/fruit';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Fruits'>;

export default function FruitsScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [items, setItems] = useState<FruitSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result: FruitSummary[] = await api.fruits.list();
        if (active) setItems(result);
      } catch (err: any) {
        Toast.show({ type: 'error', text1: t('error'), text2: err.message });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <View style={styles.screen}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.content}
          data={items}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={styles.empty}>{t('no_fruits')}</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => nav.navigate('FruitInfo', { name: item.name })}
            >
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <Text style={styles.placeholderText}>{item.display_name.charAt(0)}</Text>
                </View>
              )}
              <Text style={styles.name} numberOfLines={1}>{item.display_name}</Text>
              <Text style={styles.calories}>{item.calories ?? 0} {t('kcal')} / 100 {t('gram')}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <BottomNav />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: 12, paddingBottom: 24 },
  loader: { flex: 1, justifyContent: 'center' },
  row: { gap: 12 },
  card: { flex: 1, backgroundColor: colors.surface, borderRadius: 14, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  image: { width: '100%', height: 120, resizeMode: 'cover' },
  imagePlaceholder: { backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 40, fontWeight: 'bold', color: colors.primaryDark },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, paddingHorizontal: 10, paddingTop: 10 },
  calories: { fontSize: 12, color: colors.textSecondary, paddingHorizontal: 10, paddingBottom: 10, marginTop: 3 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40, fontSize: 16 },
});
