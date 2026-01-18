import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageStrategy } from "./LocalStorageStrategy";
import { WeeklyTasksService } from "./weeklyTasksService";


const SYNCED_ONCE = 'synced_once'

export class WeeklyTasksSync {
    // Change this in your WeeklyTasksSync class:
    static async addTheNewTasks(userId: string | undefined) {
        try {
            const localTasks = await LocalStorageStrategy.getWeeklyTasks();
            const cloudTasks = await WeeklyTasksService.fetchTasks(userId);
            const cloudTasksIds = cloudTasks.map(el => el.id);
            const newTasks = localTasks.filter(el => !cloudTasksIds.includes(el.id));

            // Use for...of to properly await each step
            for (const task of newTasks) {
                const { ...rest } = task;
                await WeeklyTasksService.addTask(rest, userId);
                await LocalStorageStrategy.deleteBlock(task?.id);
            }
            return { message: 'Created New Task', code: 200 }
        } catch (error) {
            return { message: 'Error Creating New Task', code: 400, error }

        }
    }


    static async updateExistingTasks(userId: string | undefined) {
        const localTasks = await LocalStorageStrategy.getWeeklyTasks()
        const cloudTasks = await WeeklyTasksService.fetchTasks(userId)
        for (const task of localTasks) {
            const dbData = cloudTasks.find(dbTask => dbTask.id === task.id)

            if (dbData) {
                const newUpdateToDbTask = { ...dbData, days: task.days }
                await WeeklyTasksService.updateTask(dbData.id, newUpdateToDbTask, userId)
            }

        }
    }

    static async deleteMissingTasks(userId: string | undefined) {

        const localTasks = await LocalStorageStrategy.getWeeklyTasks()
        const cloudTasks = await WeeklyTasksService.fetchCloudTasks(userId)
        const localTasksIds = localTasks.map(el => el.id)
        const missingTasks = cloudTasks.filter(el => !localTasksIds.includes(el.id))


        for (const task of missingTasks) {
            await WeeklyTasksService.deleteTask(task.id, userId)
        }

    }

    static async handleSyncedOnce() {
        try {
            const syncedValue = await AsyncStorage.getItem(SYNCED_ONCE);
            if (syncedValue === undefined) {
                await AsyncStorage.setItem(SYNCED_ONCE, 'synced');
                return 'synced';
            }
            if (syncedValue === 'synced') {
                return 'synced';
            } else {
                return 'unsynced';
            }
        } catch (error) {
            console.error("Error reading tasks:", error);
            return 'unsynced';
        }

    }

    static async handleResetSync() {
        try {
            await AsyncStorage.setItem(SYNCED_ONCE, 'unsynced');
            return true
        } catch (error) {
            console.error("Error reading tasks:", error);
            return false
        }

    }
}