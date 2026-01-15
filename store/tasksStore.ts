import { WeeklyTask } from '@/types';
import { create } from 'zustand';

// 1. تعريف شكل الـ Store (State + Actions)
interface TasksState {
    tasks: WeeklyTask[];
    setTasks: (tasks: WeeklyTask[]) => void;
    addTask: (task: WeeklyTask) => void;
    removeTask: (task: WeeklyTask) => void;
    updateTask: (task: WeeklyTask) => void;
}

// 2. تمرير الـ Interface كـ Generic للـ create function
const useTasksStore = create<TasksState>((set) => ({
    tasks: [],

    setTasks: (tasks) => set((state) => ({
        tasks: state.tasks = tasks
    })),

    addTask: (task) =>
        set((state) => ({
            tasks: [...state.tasks, task]
        })),

    removeTask: (task) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== task.id)
        })),

    updateTask: (task) =>
        set((state) => ({
            tasks: state.tasks.map((t) => t.id === task.id ? task : t)
        })),
}))

export default useTasksStore