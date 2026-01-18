import { WeeklySnapshot, WeeklyTask } from "@/types";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const tasks = await this.getData();
    const snapshotData = tasks.map(block => ({
      id: block.id,
      content: block.content,
      days: block.days
    }));

    const snapshot = {
      userId: userId,
      archived_at: new Date().toISOString(),
      week_data: snapshotData
    };

    try {
      await AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.error("Error saving snapshot:", error);
    }
  }

  static async clearTasks(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  static async deleteBlock(blockId: string): Promise<void> {
    const data = await this.getData();
    const newData = data.filter(b => b.id !== blockId);
    await this.saveData(newData);
  }
}