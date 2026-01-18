// components/NotificationProvider.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationStore } from '../weeklyTasks/store/useNotificationStore';
import { ToastItem } from './NotificationItem';

export const NotificationProvider = () => {
    const notifications = useNotificationStore((state) => state.notifications);
    if (notifications.length === 0) return null;
    return (
        <View pointerEvents="box-none" style={styles.container}>
            <SafeAreaView>
                {notifications.map((n) => (
                    <ToastItem key={n.id} {...n} />
                ))}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50, // Adjust based on your header height
        left: 20,
        right: 20,
        zIndex: 9999,
    },
});