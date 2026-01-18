'use client';
import { WeeklyTask } from "@/types";
import { useCallback, useEffect } from "react";
// import { WeeklyTasksService } from "@/services/weeklyTasksService";
// import { WeeklyTasksSync } from "@/services/weeklyTasksSyncService";
import { useAuth } from "@/contexts/Auth";
import useTasksStore from "@/store/tasksStore";
import { WeeklyTasksService } from "../services/weeklyTasksService";
import { WeeklyTasksSync } from "../services/weeklyTasksSyncService";
import { useNotificationStore } from "../store/useNotificationStore";


export function useWeeklyTasks() {

  const { setTasks, updateTask, removeTask, setLoading, setLoadingSync } = useTasksStore()
  const notify = useNotificationStore(state => state.notify);


  const { user } = useAuth();


  const getTasks = useCallback(async () => {
    setLoading(true)
    const tasks = await WeeklyTasksService.fetchTasks(user?.id)
    setTasks(tasks)
    setLoading(false)
  }, [user])


  const updateBlock = async (taskId: string, updates: Partial<WeeklyTask>) => {
    // Clear any previous error for this specific task before starting
    // dispatch(setError({ id: taskId, message: null }));
    // dispatch(setLoading(true))
    try {
      setLoading(true)
      const result = await WeeklyTasksService.updateTask(taskId, updates, user?.id);
      if (result.success) {
        notify('Task updated successfully', 'success');
        updateTask(taskId, updates);
      } else {
        notify(result.error, 'error');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      notify(message, 'error');
    } finally {
      setLoading(false)
    }
  };

  const deleteBlock = async (taskId: string) => {
    try {
      await WeeklyTasksService.deleteTask(taskId, user?.id)
      removeTask(taskId)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task'
      // dispatch(setError({ id: taskId, message }))
    }
  }

  const SyncFromLocalToCloud = async () => {
    // const isSynced = await WeeklyTasksSync.handleSyncedOnce()

    if (user?.id) {
      setLoadingSync(true)
      await WeeklyTasksSync.addTheNewTasks(user?.id)
      await WeeklyTasksSync.updateExistingTasks(user?.id)
      await WeeklyTasksSync.deleteMissingTasks(user?.id)
      await WeeklyTasksService.saveSnapShot(user?.id)
      setLoadingSync(false)
    }
    getTasks()
    // dispatch(setSyncLoading(false))
  }

  const shouldReset = async () => {
    await WeeklyTasksService.saveSnapShot(user?.id)
  }


  useEffect(() => {
    SyncFromLocalToCloud()
    shouldReset()
  }, [user?.id])


  return {
    updateBlock,
    deleteBlock,
    getTasks
  };
}