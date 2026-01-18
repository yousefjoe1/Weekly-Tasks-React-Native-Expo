import { create } from "zustand";

// store/useNotificationStore.ts
type NotificationType = 'error' | 'success' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationState {
    notifications: Notification[];
    notify: (message: string, type?: NotificationType) => void;
    dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    notify: (message, type = 'error') => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
            notifications: [...state.notifications, { id, message, type }],
        }));
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 4000);
    },
    dismiss: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));