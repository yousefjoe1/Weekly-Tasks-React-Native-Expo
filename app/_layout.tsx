import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Header from '@/components/common/Header';
import { AuthProvider } from '@/contexts/Auth';
import { NotificationProvider } from '@/featuers/Notifications/NotificationProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// import AsmahAllah from '@/featuers/Notifications/sevices/azkar';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import { useEffect } from 'react';
// import { Platform } from 'react-native';



import AsmahAllah from '@/featuers/Notifications/services/asmah-allah';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });


// export async function registerForPushNotificationsAsync() {
//   // 1. إعداد القناة للأندرويد (ضروري جداً للإشعارات المحلية)
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   // 2. طلب التصريح من المستخدم (Permission Only)
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//       alert('لم يتم تفعيل صلاحية الإشعارات!');
//       return false;
//     }

//     // ملاحظة: قمنا بحذف كود getExpoPushTokenAsync نهائياً لمنع خطأ Firebase
//     console.log("✅ Permissions granted, skipping Firebase Token.");
//     return true;
//   } else {
//     console.log('Must use physical device for full notification features');
//     return false;
//   }
// }



// const STORAGE_KEY = '@notification_interval';

// export async function registerForPushNotificationsAsync() {
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//       alert('لم يتم تفعيل صلاحية الإشعارات!');
//       return false;
//     }

//     console.log("✅ Permissions granted");
//     return true;
//   } else {
//     console.log('Must use physical device for full notification features');
//     return false;
//   }
// }

// async function scheduleNotificationsFromStorage() {
//   try {
//     const savedInterval = await AsyncStorage.getItem(STORAGE_KEY);

//     if (savedInterval) {
//       const intervalHours = parseInt(savedInterval);
//       const intervalInSeconds = intervalHours * 60 * 60;

//       // إلغاء القديم
//       await Notifications.cancelAllScheduledNotificationsAsync();

//       const item = await AsmahAllah.startNotification();


//       // ✅ إشعار واحد متكرر فقط!
//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: `﴿ ${item.name} ﴾`, // العنوان Bold تلقائياً
//           body: item.details,
//           sound: true,
//           priority: Notifications.AndroidNotificationPriority.HIGH,
//         },
//         trigger: {
//           type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//           seconds: intervalInSeconds,
//           repeats: true, // ✅ يتكرر للأبد بدون حدود
//         },
//       });
//       await AsmahAllah.updateNotificationIndex();

//       console.log(`✅ Repeating notification rescheduled (every ${intervalHours} hours)`);
//     }
//   } catch (error) {
//     console.error('Error scheduling notifications:', error);
//   }
// }



export default function RootLayout() {
  const colorScheme = useColorScheme();


  // useEffect(() => {
  //   // 1. طلب الصلاحيات والتأكد منها
  //   registerForPushNotificationsAsync();

  //   // 2. دالة الجدولة الدورية (تذكير كل 15 دقيقة لمدة 12 ساعة)
  //   async function setupReminders() {
  //     // مسح القديم لتجنب التكرار عند كل مرة تفتح فيها التطبيق
  //     await Notifications.cancelAllScheduledNotificationsAsync();

  //     const fifteenMinutesInSeconds = 15 * 60;
  //     const totalReminders = 48; // يغطي 12 ساعة (4 إشعارات في الساعة * 12)

  //     for (let i = 1; i <= totalReminders; i++) {
  //       await Notifications.scheduleNotificationAsync({
  //         content: {
  //           title: "تذكير المهام 📝",
  //           body: "هل تحققت من قائمتك الآن؟",
  //           sound: true,
  //           priority: Notifications.AndroidNotificationPriority.HIGH,
  //         },
  //         trigger: {
  //           type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  //           seconds: fifteenMinutesInSeconds * i,
  //         },
  //       });
  //     }
  //     console.log("✅ Done: 48 Notifications Scheduled");
  //   }

  //   setupReminders();

  //   // 3. Listeners (اختياري لو عايز تعمل أكشن لما المستخدم يضغط على الإشعار)
  //   const notificationListener = Notifications.addNotificationReceivedListener(notification => {
  //     // console.log(notification);
  //   });

  //   const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
  //     // هنا ممكن توجه المستخدم لصفحة معينة لما يضغط على الإشعار
  //   });

  //   return () => {
  //     notificationListener.remove();
  //     responseListener.remove();
  //   };
  // }, []);

  // useEffect(() => {
  //   const setup = async () => {
  //     await registerForPushNotificationsAsync();
  //     await scheduleNotificationsFromStorage();
  //   };

  //   setup();

  //   const notificationListener = Notifications.addNotificationReceivedListener(notification => {
  //     // يمكنك التعامل مع الإشعار هنا
  //   });

  //   const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
  //     // يمكنك التنقل لصفحة معينة هنا
  //   });

  //   return () => {
  //     notificationListener.remove();
  //     responseListener.remove();
  //   };
  // }, []);
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