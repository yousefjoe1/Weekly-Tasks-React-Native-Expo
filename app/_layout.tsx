import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Header from '@/components/common/Header';
import { AuthProvider } from '@/contexts/Auth';
import { NotificationProvider } from '@/featuers/Notifications/NotificationProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';


import AsmahAllah from '@/featuers/Notifications/services/asmah-allah';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND_NOTIFICATION_TASK";

// تعريف المهمة التي ستنفذها الخلفية
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {

    const item = await AsmahAllah.startNotification();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `﴿ ${item.name} ﴾`, // العنوان Bold تلقائياً
        body: item.details,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
    await AsmahAllah.updateNotificationIndex();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false, // ✅ التغيير الأساسي هنا (إضافة Set)
    // التنسيقات الإضافية للـ iOS لمنع الـ Deprecation warning
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const setupBackgroundTasks = async () => {
      // 1. طلب إذن الإشعارات
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      // 2. تسجيل المهمة لتعمل كل ساعتين (7200 ثانية)
      await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 60 * 15, // 15 دقيقة
        stopOnTerminate: false,    // استمرار العمل حتى لو أغلق المستخدم التطبيق تماماً
        startOnBoot: true,         // البدء تلقائياً عند إعادة تشغيل الجهاز
      });
    };
    const setupNotifications = async () => {
      // إعداد القناة لأندرويد
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // طلب الإذن وتسجيل المهمة...
    };
    setupNotifications();

    setupBackgroundTasks();
  }, []);


  // const testNotification = async () => {

  //   try {
  //     // الحصول على الاسم
  //     const item = await AsmahAllah.startNotification();
  //     console.log("🚀 ~ testNotification ~ item:", item)

  //     // إرسال الإشعار فوراً (للاختبار)
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: `﴿ ${item.name} ﴾`,
  //         body: item.details,
  //         sound: true,
  //         priority: Notifications.AndroidNotificationPriority.HIGH,
  //       },
  //       trigger: null, // null يعني فوراً
  //     });

  //     await AsmahAllah.updateNotificationIndex();
  //     return BackgroundFetch.BackgroundFetchResult.NewData;
  //   } catch (error) {
  //     return BackgroundFetch.BackgroundFetchResult.Failed;
  //   }

  // };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Header />
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
