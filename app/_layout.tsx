import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Header from '@/components/common/Header';
import { AuthProvider } from '@/contexts/Auth';
import { NotificationProvider } from '@/featuers/Notifications/NotificationProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';



import AsmahAllah from '@/featuers/Notifications/services/asmah-allah';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { useEffect } from 'react';
import { Platform } from 'react-native';
const TASK = "NAMES_TASK";

TaskManager.defineTask(TASK, async () => {
  try {
    const now = Date.now();
    const last = Number(await AsyncStorage.getItem("last"));
    const interval = Number(await AsyncStorage.getItem("interval"));

    if (!interval) return BackgroundFetch.BackgroundFetchResult.NoData;

    if (!last) {
      await AsyncStorage.setItem("last", now.toString());
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    if (now - last >= interval) {

      const item = await AsmahAllah.startNotification();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `﴿ ${item.name} ﴾`,
          body: item.details,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });

      await AsmahAllah.updateNotificationIndex();
      await AsyncStorage.setItem("last", now.toString());

      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (e) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask() {
  await BackgroundFetch.registerTaskAsync(TASK, {
    minimumInterval: 60 * 15,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
export const unstable_settings = {
  anchor: '(tabs)',
};

// const TASK = "NAMES_TASK";

// TaskManager.defineTask(TASK, async () => {
//   try {
//     const now = Date.now();
//     const last = Number(await AsyncStorage.getItem("last"));
//     const interval = Number(await AsyncStorage.getItem("interval"));

//     // لو المستخدم لسه ماضافش interval
//     if (!interval) return BackgroundFetch.BackgroundFetchResult.NoData;

//     // لو مفيش last احطه لأول مرة
//     if (!last) {
//       await AsyncStorage.setItem("last", now.toString());
//       return BackgroundFetch.BackgroundFetchResult.NewData;
//     }

//     // check trigger
//     if (now - last >= interval) {

//       const item = await AsmahAllah.startNotification();

//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: `﴿ ${item.name} ﴾`,
//           body: item.details,
//           sound: true,
//           priority: Notifications.AndroidNotificationPriority.HIGH,
//         },
//         trigger: null,
//       });

//       await AsmahAllah.updateNotificationIndex();
//       await AsyncStorage.setItem("last", now.toString());

//       return BackgroundFetch.BackgroundFetchResult.NewData;
//     }

//     return BackgroundFetch.BackgroundFetchResult.NoData;
//   } catch (e) {
//     return BackgroundFetch.BackgroundFetchResult.Failed;
//   }
// });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Keep for older Android compatibility
    shouldPlaySound: true,
    shouldSetBadge: false, // REQUIRED by the new types
    shouldShowBanner: true, // Modern replacement for Alert
    shouldShowList: true,   // Modern replacement for Alert
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const setIntervalHours = async (h: number) => {
    await AsyncStorage.setItem("interval", (h * 3600 * 1000).toString());
    // مفيش reset للـ index
    // مفيش reset للـ last
  };

  const setHours = async (h: number) => {
    await AsyncStorage.setItem("interval", (h * 3600 * 1000).toString());
  };

  useEffect(() => {
    const registerTask = async () => {
      try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK);
        if (!isRegistered) {
          await BackgroundFetch.registerTaskAsync(TASK, {
            minimumInterval: 60 * 15, // 15 minutes (minimum allowed by Android/iOS)
            stopOnTerminate: false,
            startOnBoot: true,
          });
          console.log('Task registered successfully');
        }
      } catch (err) {
        console.error('Task registration failed:', err);
      }
    };

    registerTask();
  }, []);

  useEffect(() => {
    const setupBackgroundTasks = async () => {
      // 1. طلب إذن الإشعارات
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      // 2. تسجيل المهمة لتعمل كل ساعتين (7200 ثانية)
      await registerBackgroundTask()
    };
    const setupNotifications = async () => {
      // إعداد القناة لأندرويد
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      // طلب الإذن وتسجيل المهمة...
    };
    setupNotifications();

    setupBackgroundTasks();
    setHours(2)
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
