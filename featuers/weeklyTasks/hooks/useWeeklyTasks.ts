'use client';
import { WeeklyTask } from "@/types";
import { useCallback, useEffect } from "react";
// import { WeeklyTasksService } from "@/services/weeklyTasksService";
// import { WeeklyTasksSync } from "@/services/weeklyTasksSyncService";
import { useAuth } from "@/contexts/Auth";
import useTasksStore from "@/store/tasksStore";


export function useWeeklyTasks() {

  const { setTasks, updateTask, removeTask } = useTasksStore()


  const { user } = useAuth();


  const getTasks = useCallback(async () => {
    // dispatch(setLoading(true))
    const tasks = await WeeklyTasksService.fetchTasks(user?.id)
    // dispatch(setTasks(tasks))
  }, [user, dispatch])


  const updateBlock = async (taskId: string, updates: Partial<WeeklyTask>) => {
    // Clear any previous error for this specific task before starting
    // dispatch(setError({ id: taskId, message: null }));
    // dispatch(setLoading(true))
    try {
      await WeeklyTasksService.updateTask(taskId, updates, user?.id);
      // dispatch(updateTask({ id: taskId, updates }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      // dispatch(setError({ id: taskId, message }));
    }
  };

  const deleteBlock = async (taskId: string) => {
    // dispatch(setLoading(true))
    try {
      await WeeklyTasksService.deleteTask(taskId, user?.id)
      // dispatch(removeTask(taskId))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task'
      // dispatch(setError({ id: taskId, message }))
    }
  }

  const SyncFromLocalToCloud = async () => {
    // dispatch(setSyncLoading(true))
    if (user?.id) {
      await WeeklyTasksSync.addTheNewTasks(user?.id)
      await WeeklyTasksSync.updateExistingTasks(user?.id)
      await WeeklyTasksSync.deleteMissingTasks(user?.id)
      await WeeklyTasksService.saveSnapShot(user?.id)
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