import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../../theme/colors';
import { useTranslation } from 'react-i18next';

interface Props { onPhotoTaken: (uri: string) => void; }

export default function CameraView({ onPhotoTaken }: Props) {
  const ref = useRef<ExpoCameraView>(null);
  const [perm, req] = useCameraPermissions();
  const { t } = useTranslation();

  if (!perm) return <View style={styles.container} />;
  if (!perm.granted) return (
    <View style={styles.container}>
      <Text style={styles.msg}>Allow camera access</Text>
      <TouchableOpacity style={styles.btn} onPress={req}><Text style={styles.btnText}>Grant</Text></TouchableOpacity>
    </View>
  );

  async function take() { const p = await ref.current?.takePictureAsync(); if (p) onPhotoTaken(p.uri); }

  return (
    <View style={styles.container}>
      <ExpoCameraView ref={ref} style={styles.cam} facing="back">
        <View style={styles.ctrl}><TouchableOpacity style={styles.cap} onPress={take}><View style={styles.inner} /></TouchableOpacity></View>
      </ExpoCameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, cam: { flex: 1 }, ctrl: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  cap: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  inner: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.white },
  msg: { fontSize: 16, textAlign: 'center', marginTop: 50 },
  btn: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, margin: 20 },
  btnText: { color: colors.white, textAlign: 'center', fontSize: 16 },
});
