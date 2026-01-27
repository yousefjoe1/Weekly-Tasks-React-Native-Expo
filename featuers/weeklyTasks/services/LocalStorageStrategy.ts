import { WeeklySnapshot, WeeklyTask } from "@/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endOfWeek, startOfWeek } from "date-fns";
import { shouldResetWeek } from "../utils/utils";

export const STORAGE_KEY = 'my-notion-app-data';
const SNAPSHOT_KEY = 'my-notion-app-snapshots';

export class LocalStorageStrategy {

  // Helper to get raw data
  private static async getData(): Promise<WeeklyTask[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading tasks:", error);
      return [];
    }
  }

  // Helper to save raw data
  private static async saveData(data: WeeklyTask[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }

  static async getSnapshotData(): Promise<WeeklySnapshot[]> {
    try {
      const data = await AsyncStorage.getItem(SNAPSHOT_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  static async getWeeklyTasks(): Promise<WeeklyTask[]> {
    return await this.getData();
  }

  static async saveAllData(data: WeeklyTask[]): Promise<void> {
    await this.saveData(data);
  }

  static async addBlock(block: WeeklyTask): Promise<void> {
    const data = await this.getData();
    data.push(block);
    await this.saveData(data);
  }

  static async updateBlock(blockId: string, updates: Partial<WeeklyTask>): Promise<void> {
    const data = await this.getData();
    const blockIndex = data.findIndex(b => b.id === blockId);

    if (blockIndex !== -1) {
      data[blockIndex] = {
        ...data[blockIndex],
        ...updates,
      };
      await this.saveData(data);
    }
  }

  static async saveWeeklySnapshot(userId: string | undefined): Promise<void> {

    // 1. جلب المهام الحالية
    const tasks = await this.getData();
    if (!tasks || tasks.length === 0) return;

    // 2. التحقق هل نحتاج Reset؟
    const needsReset = tasks?.some((block) => {
      const dateToCompare = block.updated_at;
      return dateToCompare && shouldResetWeek(dateToCompare);
    });

    if (needsReset) {

      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });


      // 3. تجهيز السناب شوت
      const snapshot = {
        user_id: userId,
        archived_at: now.toISOString(),
        week_start: weekStart.toISOString(),
        week_end: weekEnd.toISOString(),
        week_data: tasks.map(block => ({
          id: block.id,
          content: block.content,
          days: block.days
        }))
      };

      // 4. حفظ السناب شوت في الـ Local Storage
      const existingSnapshots = await this.getSnapshotData() || [];
      existingSnapshots.push(snapshot);
      await AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(existingSnapshots));

      // ---------------------------------------------------------
      // 5. الخطوة الأهم لمنع التكرار: تحديث المهام الأصلية
      // ---------------------------------------------------------
      const resetTasks = tasks.map(block => ({
        ...block,
        days: {}, // تصفير الأيام
        updated_at: now.toISOString() // تحديث التاريخ لليوم (عشان ميعملش Reset تاني)
      }));

      // حفظ المهام "الجديدة" مكان القديمة
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetTasks));

      console.log("✅ LocalStorage Snapshot saved and tasks reset for the new week.");
    }
  }

  static async clearTasks(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  static async deleteBlock(blockId: string, userId: string | undefined): Promise<void> {
    const data = await this.getData();
    const newData = data.filter(b => b.id !== blockId);
    if (userId === undefined) {
      const currentIds = JSON.parse(localStorage.getItem('current-tasks-local-ids') || '[]')
      if (currentIds === undefined || currentIds == null) {
        localStorage.setItem('current-tasks-local-ids', JSON.stringify([blockId]))
      } else {
        currentIds.push(blockId)
        localStorage.setItem('current-tasks-local-ids', JSON.stringify(currentIds))
      }
    }
    this.saveData(newData);
  }
}