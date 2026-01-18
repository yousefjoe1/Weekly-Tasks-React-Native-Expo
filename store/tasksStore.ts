import { WeeklyTask } from '@/types';
import { create } from 'zustand';

// 1. تعريف شكل الـ Store (State + Actions)
interface TasksState {
    tasks: WeeklyTask[];
    loading: boolean;
    setTasks: (tasks: WeeklyTask[]) => void;
    addTask: (task: WeeklyTask) => void;
    removeTask: (task: string) => void;
    updateTask: (id: string, updates: Partial<WeeklyTask>) => void;
    setLoading: (loading: boolean) => void;
}

// 2. تمرير الـ Interface كـ Generic للـ create function
const useTasksStore = create<TasksState>((set) => ({
    tasks: [],
    loading: false,

    setLoading: (value) => set(() => ({
        loading: value
    })),
    setTasks: (tasks: WeeklyTask[]) => set((state) => ({
        tasks: state.tasks = tasks
    })),

    addTask: (task) =>
        set((state) => ({
            tasks: [...state.tasks, task]
        })),

    removeTask: (taskId) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId)
        })),

    updateTask: (id: string, updates: Partial<WeeklyTask>) =>
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id
                    ? { ...t, ...updates }
                    : t
            ),
            loading: false
        })),
}))

export default useTasksStore