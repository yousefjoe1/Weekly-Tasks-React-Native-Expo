import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STORAGE_KEY = '@notification_interval';

export default function NotificationSettings() {
    const [selectedHours, setSelectedHours] = useState<number | null>(null);
    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSavedInterval();
    }, []);

    const loadSavedInterval = async () => {
        setLoading(true);
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                setSelectedHours(parseInt(saved));
            }
        } catch (error) {
            console.error('Error loading interval:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectInterval = async (hours: number) => {
        try {
            setLoading(true);
            // حفظ الاختيار
            await AsyncStorage.setItem(STORAGE_KEY, hours.toString());
            setSelectedHours(hours);

            // جدولة الإشعارات
            await scheduleNotifications(hours);

            Alert.alert(
                'تم بنجاح ✅',
                `سيتم تذكيرك كل ${hours} ساعة${hours > 2 ? 'ات' : hours === 2 ? 'تين' : ''}`,
                [{ text: 'حسناً' }]
            );
        } catch (error) {
            console.error('Error setting interval:', error);
            Alert.alert('خطأ', 'حدث خطأ في حفظ الإعدادات');
        } finally {
            setLoading(false);
        }
    };

    const scheduleNotifications = async (intervalHours: number) => {
        setLoading(true);
        // إلغاء كل الإشعارات السابقة
        await Notifications.cancelAllScheduledNotificationsAsync();

        const intervalInSeconds = intervalHours * 60 * 60;

        // ✅ الحل: استخدام إشعار واحد متكرر بدلاً من مئات الإشعارات!
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "تذكير المهام 📝",
                body: "هل تحققت من قائمتك الآن؟",
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: intervalInSeconds,
                repeats: true, // ✅ المفتاح السحري: repeats: true
            },
        });
        setLoading(false);
        console.log(`✅ Repeating notification scheduled (every ${intervalHours} hours)`);
    };


    const disableNotifications = async () => {
        setLoading(true);
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            await AsyncStorage.removeItem(STORAGE_KEY);
            setSelectedHours(null);
            Alert.alert('تم ✅', 'تم إيقاف جميع الإشعارات');
        } catch (error) {
            console.error('Error disabling notifications:', error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>اختر فترة التذكير</Text>
            <Text style={styles.subtitle}>كم ساعة بين كل تذكير؟</Text>
            {
                loading && <ActivityIndicator />
            }
            <View style={styles.grid}>
                {hours.map((hour) => (
                    <TouchableOpacity
                        disabled={loading}
                        key={hour}
                        style={[
                            styles.hourButton,
                            selectedHours === hour && styles.selectedButton,
                        ]}
                        onPress={() => handleSelectInterval(hour)}
                    >
                        <Text style={[
                            styles.hourText,
                            selectedHours === hour && styles.selectedText,
                        ]}>
                            {hour}
                        </Text>
                        <Text style={[
                            styles.hourLabel,
                            selectedHours === hour && styles.selectedText,
                        ]}>
                            {hour === 1 ? 'ساعة' : hour === 2 ? 'ساعتين' : 'ساعات'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedHours && (
                <TouchableOpacity
                    style={styles.disableButton}
                    onPress={disableNotifications}
                >
                    <Text style={styles.disableText}>إيقاف الإشعارات</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    hourButton: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    selectedButton: {
        backgroundColor: '#007AFF',
        borderColor: '#0051D5',
    },
    hourText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    hourLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    selectedText: {
        color: '#fff',
    },
    disableButton: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#ff3b30',
        borderRadius: 10,
        alignItems: 'center',
    },
    disableText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

