import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Header from '@/components/common/Header';
import { AuthProvider } from '@/contexts/Auth';
import { NotificationProvider } from '@/featuers/Notifications/NotificationProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';


import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';


export const unstable_settings = {
  anchor: '(tabs)',
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export async function registerForPushNotificationsAsync() {
  // 1. إعداد القناة للأندرويد (ضروري جداً للإشعارات المحلية)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // 2. طلب التصريح من المستخدم (Permission Only)
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('لم يتم تفعيل صلاحية الإشعارات!');
      return false;
    }

    // ملاحظة: قمنا بحذف كود getExpoPushTokenAsync نهائياً لمنع خطأ Firebase
    console.log("✅ Permissions granted, skipping Firebase Token.");
    return true;
  } else {
    console.log('Must use physical device for full notification features');
    return false;
  }
}


export default function RootLayout() {
  const colorScheme = useColorScheme();


  useEffect(() => {
    // 1. طلب الصلاحيات والتأكد منها
    registerForPushNotificationsAsync();

    // 2. دالة الجدولة الدورية (تذكير كل 15 دقيقة لمدة 12 ساعة)
    async function setupReminders() {
      // مسح القديم لتجنب التكرار عند كل مرة تفتح فيها التطبيق
      await Notifications.cancelAllScheduledNotificationsAsync();

      const fifteenMinutesInSeconds = 15 * 60;
      const totalReminders = 48; // يغطي 12 ساعة (4 إشعارات في الساعة * 12)

      for (let i = 1; i <= totalReminders; i++) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "تذكير المهام 📝",
            body: "هل تحققت من قائمتك الآن؟",
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: fifteenMinutesInSeconds * i,
          },
        });
      }
      console.log("✅ Done: 48 Notifications Scheduled");
    }

    setupReminders();

    // 3. Listeners (اختياري لو عايز تعمل أكشن لما المستخدم يضغط على الإشعار)
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      // console.log(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // هنا ممكن توجه المستخدم لصفحة معينة لما يضغط على الإشعار
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Header />
        {/* <GestureHandlerRootView> */}

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