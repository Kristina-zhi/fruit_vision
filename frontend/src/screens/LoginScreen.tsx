import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/AuthContext';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [reg, setReg] = useState(false);
  const [load, setLoad] = useState(false);
  const { login, register } = useAuth();
  const nav = useNavigation<Nav>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  async function submit() {
    if (!e || !p) {
      Toast.show({ type: 'error', text1: t('error'), text2: t('fill_all_fields') });
      return;
    }
    setLoad(true);
    try {
      reg ? await register(e, p) : await login(e, p);
      nav.replace('Home');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: t('error'), text2: err.response?.data?.message || err.message });
    } finally {
      setLoad(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.form}>
        <Text style={styles.title}>Fruit Vision</Text>
        <TextInput
          style={styles.input}
          placeholder={t('email')}
          placeholderTextColor={colors.textSecondary}
          value={e}
          onChangeText={setE}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          placeholderTextColor={colors.textSecondary}
          value={p}
          onChangeText={setP}
          secureTextEntry
        />
        <TouchableOpacity style={styles.btn} onPress={submit} disabled={load}>
          <Text style={styles.btnText}>{load ? t('loading') : reg ? t('register') : t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setReg(!reg)}>
          <Text style={styles.switch}>{reg ? t('login') : t('register')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  form: { padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16, color: colors.text },
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  switch: { color: colors.primary, textAlign: 'center', marginTop: 16, fontSize: 14 },
});
