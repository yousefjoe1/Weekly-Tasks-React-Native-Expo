// services/weeklyTasksService.ts
import { supabase } from '@/db/supabase';
import { WeeklyTask } from '@/types';
import { Result } from '../types/Resut';
import { ApiErrorMessage } from '../types/taskTypes';
import { shouldResetWeek } from '../utils/utils';
import { LocalStorageStrategy } from './LocalStorageStrategy';

/**
 * Service layer handles ALL data operations
 * Benefits:
 * - Separates business logic from UI
 * - Easy to test in isolation
 * - Reusable across different components
 * - Single place to modify API calls
 */

export class WeeklyTasksService {

    static async fetchCloudTasks(userId: string | undefined): Promise<WeeklyTask[]> {
        if (userId) {
            const { data, error } = await supabase
                .from('weekly_tasks')
                .select('*')
                .eq('userId', userId)

            if (error) throw error
            return data || []
        } else {
            return []
        }
    }

    // Fetch tasks from appropriate source
    static async fetchTasks(userId: string | undefined): Promise<WeeklyTask[]> {
        if (userId) {
            const { data, error } = await supabase
                .from('weekly_tasks')
                .select('*')
                .eq('userId', userId)

            if (error) throw error
            return data || []
        } else {
            return LocalStorageStrategy.getWeeklyTasks()
        }
    }

    // Add new task
    static async addTask(task: WeeklyTask, userId: string | undefined): Promise<Result<WeeklyTask>> {
        try {
            if (userId) {
                const { id, ...insertData } = task;
                const { data, error } = await supabase
                    .from('weekly_tasks')
                    .insert({ ...insertData, userId })
                    .select().single();

                // if (error) throw new Error(error.message);
                if (error) {
                    return { success: false, error: error.message }
                }
                await LocalStorageStrategy.addBlock(data);

                return { success: true, data };
            } else {
                await LocalStorageStrategy.addBlock(task);
                return { success: true, data: task };
            }
        } catch (error: any) {
            // Here you can log to Sentry/LogRocket for senior-level observability
            console.error("Service Error:", error);
            return {
                success: false,
                error: error.message || 'An unexpected error occurred'
            };
        }
    }

    // Update existing task
    static async updateTask(
        taskId: string,
        updates: Partial<WeeklyTask>,
        userId: string | undefined
    ): Promise<Result<null>> {
        try {
            if (userId) {
                const { error } = await supabase
                    .from('weekly_tasks')
                    .update(updates)
                    .eq('id', taskId)
                    .eq('userId', userId); // Fixed: was hardcoded to 9
                console.log("🚀 ~ WeeklyTasksService ~ updateTask ~ error:", error)

                if (error) {
                    return { success: false, error: error.message }
                }
            }

            await LocalStorageStrategy.updateBlock(taskId, updates);
            return { success: true, data: null };
        } catch (e: any) {
            return { success: false, error: e.message }
        }
    }

    // Delete task
    static async deleteTask(taskId: string, userId: string | undefined): Promise<ApiErrorMessage<void>> {
        if (userId) {
            const { error } = await supabase
                .from('weekly_tasks')
                .delete()
                .eq('id', taskId)
                .eq('userId', userId)

            if (error) return { message: 'Error Deleting Task', code: 400, error }
        }

        await LocalStorageStrategy.deleteBlock(taskId)
        return { message: 'Task Deleted', code: 200 }
    }

    static async saveSnapShot(userId: string | undefined): Promise<void> {
        if (userId) {
            const tasks = await this.fetchTasks(userId)
            const needsReset = tasks?.some(
                (block) => block.updated_at && shouldResetWeek(new Date(block.updated_at))
            )
            if (needsReset) {
                const snapshotData = tasks.map(block => ({
                    id: block.id,
                    content: block.content,
                    days: block.days
                }));


                const snapshot = {
                    user_id: userId,
                    archived_at: new Date().toISOString(),
                    week_data: snapshotData
                };

                await supabase.from('weekly_snapshots').insert(snapshot);
            } else {

                LocalStorageStrategy.saveWeeklySnapshot(userId);
            }

        }
    }

    static async saveSnapShotNow(userId: string | undefined): Promise<void> {
        if (userId) {
            const tasks = await this.fetchTasks(userId)

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

            await supabase.from('weekly_snapshots').insert(snapshot);
        } else {
            LocalStorageStrategy.saveWeeklySnapshot(userId);
        }




    }
}