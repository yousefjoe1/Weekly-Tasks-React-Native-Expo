import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Header from '@/components/common/Header';
import { AuthProvider } from '@/contexts/Auth';
import { usePushNotifications } from '@/featuers/Notifications/hooks/usePushNotifications';
import { NotificationProvider } from '@/featuers/Notifications/NotificationProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Header />
        <Text>Token: {expoPushToken?.data ?? ""}</Text>
        <Text>Notification: {data}</Text>
        {/* <GestureHandlerRootView> */}
        {/* <TouchableOpacity onPress={testNotification} >
          <Text>Test Notification</Text>
        </TouchableOpacity> */}

        {/* Renders on top of everything */}
        <NotificationProvider />
        {/* </GestureHandlerRootView> */}

        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
