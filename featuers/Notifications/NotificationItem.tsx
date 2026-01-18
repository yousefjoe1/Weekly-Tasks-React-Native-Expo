// components/ToastItem.tsx
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNotificationStore } from '../weeklyTasks/store/useNotificationStore';

export type NotificationType = 'error' | 'success' | 'info';

export const ToastItem = ({ id, message, type }: { id: string, message: string, type: NotificationType }) => {
    const dismiss = useNotificationStore((state) => state.dismiss);
    const opacity = new Animated.Value(0);

    useEffect(() => {
        // Fade in
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleDismiss = () => {
        dismiss(id)
    }

    return (
        <Animated.View style={[styles.toast, styles[type]]}>
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity onPress={handleDismiss}>
                <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    error: { backgroundColor: '#ef4444' },
    success: { backgroundColor: '#22c55e' },
    info: { backgroundColor: '#3b82f6' },
    text: { color: '#fff', fontWeight: '600' },
});