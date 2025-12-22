import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { api } from '../api/client';
import { useAuth } from '../store/AuthContext';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../App';
import CameraView from '../components/camera/CameraView';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

export default function CameraScreen() {
  const [uri, setUri] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigation<Nav>(); const { t } = useTranslation(); const { logout } = useAuth();

  async function pick() {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!r.canceled && r.assets[0]) setUri(r.assets[0].uri);
  }

  async function analyze() {
    if (!uri) return; setBusy(true);
    try {
      const fd = new FormData();
      const name = uri.split('/').pop() || 'photo.jpg';
      fd.append('file', { uri, name, type: `image/${name.split('.').pop()}` } as any);
      const r = await api.analyze.analyzeImage(fd);
      nav.navigate('Results', { analyzeId: r.id });
    } catch (err: any) { Toast.show({ type: 'error', text1: t('error'), text2: err.response?.data?.message || err.message }); }
    finally { setBusy(false); }
  }

  async function doLogout() { await logout(); nav.replace('Login'); }

  if (show) return (
    <View style={styles.container}>
      <CameraView onPhotoTaken={(u) => { setUri(u); setShow(false); }} />
      <TouchableOpacity style={styles.cancel} onPress={() => setShow(false)}><Text style={styles.cancelText}>{t('cancel')}</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={doLogout}><Text style={styles.logout}>{t('logout')}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('History')}><Text style={styles.hist}>{t('history')}</Text></TouchableOpacity>
      </View>
      {uri ? <Image source={{ uri }} style={styles.preview} /> : <View style={styles.placeholder}><Text style={styles.placeholderText}>{t('select_source')}</Text></View>}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={() => setShow(true)}><Text style={styles.btnText}>{t('take_photo')}</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.gal]} onPress={pick}><Text style={styles.btnText}>{t('upload_from_gallery')}</Text></TouchableOpacity>
      </View>
      {uri && <TouchableOpacity style={[styles.btn, styles.analyze]} onPress={analyze} disabled={busy}><Text style={styles.btnText}>{busy ? t('loading') : t('analyze')}</Text></TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  logout: { color: colors.error, fontSize: 16 }, hist: { color: colors.primary, fontSize: 16 },
  preview: { flex: 1, resizeMode: 'contain', margin: 16 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: colors.textSecondary, fontSize: 18 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  btn: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, flex: 1, margin: 4, alignItems: 'center' },
  gal: { backgroundColor: colors.accent },
  analyze: { margin: 16, backgroundColor: colors.primaryDark },
  btnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  cancel: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: colors.error, padding: 10, borderRadius: 8 },
  cancelText: { color: colors.white, fontSize: 14 },
});
