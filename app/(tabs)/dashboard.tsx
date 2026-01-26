import { useAuth } from '@/contexts/Auth';
import NotificationSettings from '@/featuers/Notifications/NotificationSettings';
import { WeeklyTasksSync } from '@/featuers/weeklyTasks/services/weeklyTasksSyncService';
import { getWeekDates, getWeekDays } from '@/featuers/weeklyTasks/utils/utils';
import { WeeklySnapshot } from '@/types';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const DashBoard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [snapData, setSnapData] = useState<WeeklySnapshot[] | null>(null);

    const getSnapShot = async () => {
        setLoading(true);
        try {
            const snapShot = await WeeklyTasksSync.fetchSnapshot(user?.id);
            setSnapData(snapShot);
        } catch (error) {
            console.error("Error fetching snapshots:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            getSnapShot();
        }
    }, [user?.id]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            <NotificationSettings />
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

            {snapData && snapData.length === 0 && (
                <View style={styles.centerBox}>
                    <Text style={styles.title}>No History</Text>
                </View>
            )}

            {snapData && snapData.length > 0 && (
                <View>
                    <Text style={styles.title}>History</Text>
                    {snapData.map((snap) => {
                        const weekDays = getWeekDays();
                        const snapWeekStart = snap.week_start ? new Date(snap.week_start) : new Date();
                        const snapWeekDates = getWeekDates(snapWeekStart);

                        return (
                            <View key={snap.id} style={styles.snapCard}>
                                <Text style={styles.archivedText}>
                                    Archived At: {new Date(snap.archived_at).toLocaleString()}
                                </Text>
                                <Text style={styles.weekRange}>
                                    Week: {snap.week_start ? format(new Date(snap.week_start), 'MMM dd, yyyy') : 'N/A'}
                                    {' - '}
                                    {snap.week_end ? format(new Date(snap.week_end), 'MMM dd, yyyy') : 'N/A'}
                                </Text>

                                <View style={styles.taskList}>
                                    {snap.week_data.map((task) => {
                                        if (!task.days) return null;

                                        return (
                                            <View key={task.id} style={styles.taskCard}>
                                                <Text style={styles.taskContent}>{task.content}</Text>

                                                <View style={styles.daysRow}>
                                                    {weekDays.map((day, index) => {
                                                        if (!task.days) return null;
                                                        const daysArray = weekDays.map(day => {
                                                            const dayKey = day as keyof typeof task.days;
                                                            return task?.days?.[dayKey] ?? false;
                                                        });
                                                        const completed = daysArray[index];
                                                        return (
                                                            <View key={day} style={styles.dayContainer}>
                                                                <View style={[styles.checkCircle, { borderColor: completed ? '#22c55e' : '#d1d5db', borderWidth: 1, borderRadius: 20 }]}>
                                                                    <Text>
                                                                        {completed && '✅'}
                                                                    </Text>
                                                                </View>
                                                                <Text style={styles.dayLabel}>{day.substring(0, 3)}</Text>
                                                                <Text style={styles.dateLabel}>{format(snapWeekDates[index], 'dd')}</Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingTop: 30,
        // marginTop: 50
    },
    contentContainer: {
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    loader: {
        marginVertical: 20,
    },
    centerBox: {
        alignItems: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1f2937',
    },
    snapCard: {
        marginBottom: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        backgroundColor: '#f9fafb',
    },
    archivedText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    weekRange: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 16,
    },
    taskList: {
        gap: 12,
    },
    taskCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 8,
        padding: 12,
    },
    taskContent: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
        color: '#111827',
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayContainer: {
        alignItems: 'center',
        width: 40,
    },
    checkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    dayLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4b5563',
    },
    dateLabel: {
        fontSize: 10,
        color: '#9ca3af',
    },
});

export default DashBoard;