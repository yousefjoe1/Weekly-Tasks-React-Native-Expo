import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import AsmahAllah from "../services/asmah-allah";

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
