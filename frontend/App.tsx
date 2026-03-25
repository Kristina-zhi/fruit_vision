import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import './src/i18n';
import { AuthProvider } from './src/store/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import CameraScreen from './src/screens/CameraScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import FruitInfoScreen from './src/screens/FruitInfoScreen';

export type RootStackParamList = {
  Login: undefined;
  Camera: undefined;
  Results: { analyzeId: number };
  History: undefined;
  FruitInfo: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Fruit Vision' }} />
      <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera' }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Stack.Screen name="FruitInfo" component={FruitInfoScreen} options={{ title: 'Fruit' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);
  if (!appReady) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </AuthProvider>
        <StatusBar style="auto" />
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
