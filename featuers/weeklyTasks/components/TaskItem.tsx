import useTasksStore from '@/store/tasksStore';
import { WeeklyTask } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getWeekDates, getWeekDays } from '../utils/utils';


interface ItemTask {
    item: WeeklyTask;
    onUpdate: (taskid: string, updates: Partial<WeeklyTask>) => void;
    onDelete: (taskId: string) => void;
}

const CELL_WIDTH = 110; // Fixed width for each day column

const TaskItem = ({ item, onUpdate, onDelete }: ItemTask) => {
    const { loading } = useTasksStore()
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(item.content);

    const weekDays = getWeekDays();
    const weekDates = getWeekDates();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const deleteTask = useTasksStore((state) => state.removeTask)
    const handleSave = () => {
        onUpdate(item.id, { content: content });
        setIsEditing(false);
    };
    const handleDelete = async () => {
        onDelete(item.id)
        deleteTask(item.id)
        setIsDeleteOpen(false)
    }

    const toggleDay = (day: string) => {
        const currentDays = item.days || {};
        onUpdate(item.id, {
            days: {
                ...currentDays,
                [day]: !currentDays[day],
            },
        });
    };


    return (
        <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
                <Text>{item.content}</Text>
                <View style={{ flexDirection: 'row', gap: 20 }} >
                    <TouchableOpacity style={styles.updateBtn} onPress={() => setIsEditing(true)}>
                        <AntDesign name="edit" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => setIsDeleteOpen(true)}>
                        <AntDesign name="delete" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {
                isEditing &&
                <View style={{ marginBottom: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>

                    <TextInput
                        editable={!loading}
                        value={content}
                        onChangeText={setContent}
                        placeholder="e.g. Morning Workout"
                        placeholderTextColor="#94a3b8"
                        style={styles.input}
                    />
                    <View style={{ flexDirection: 'row', gap: 12 }} >

                        <TouchableOpacity style={styles.updateBtn} onPress={() => handleSave()}>
                            <AntDesign name="check" size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteBtn} onPress={() => setIsEditing(false)}>
                            <AntDesign name="close" size={20} color="white" />
                        </TouchableOpacity>

                    </View>
                </View>
            }

            <View style={styles.outerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.table}>

                        {/* Table Header */}
                        <View style={styles.headerRow}>
                            {weekDays.map((day, index) => (
                                <View key={day} style={styles.headerCell}>
                                    <Text style={styles.headerDayText}>{day}</Text>
                                    <Text style={styles.headerDateText}>
                                        {format(weekDates[index], "MMM dd")}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Table Body */}
                        <View style={styles.bodyRow}>
                            {/* Loading Overlay */}
                            {loading && (
                                <View style={styles.loaderOverlay}>
                                    <ActivityIndicator color="#3b82f6" />
                                </View>
                            )}

                            {weekDays.map((day) => {
                                const isCompleted = item.days?.[day];

                                return (
                                    <View
                                        key={day}
                                        style={[
                                            styles.cell,
                                            isCompleted ? styles.cellCompleted : styles.cellEmpty
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => toggleDay(day)}
                                            style={styles.toggleButton}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[
                                                styles.checkCircle,
                                                isCompleted ? styles.checkCircleActive : styles.checkCircleInactive
                                            ]}>
                                                <Text style={[
                                                    styles.checkMark,
                                                    isCompleted ? styles.checkMarkVisible : styles.checkMarkHidden
                                                ]}>
                                                    ✓
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>

                    </View>
                </ScrollView>
            </View>
            <Modal animationType="slide" transparent={true} visible={isDeleteOpen}>
                <View style={styles.modalContent}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Are you sure you want to delete this task?</Text>
                    <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center' }} >
                        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                            <AntDesign name="delete" size={20} color="black" />
                            <Text>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsDeleteOpen(false)}>
                            <AntDesign name="close-circle" size={24} color="black" />
                            <Text>No</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>
        </View>
    )
}

export default TaskItem

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#f8fafc',
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        color: '#0f172a',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        // width: '90%'
        flexGrow: 1
    },
    modalContent: {
        height: '25%',
        width: '100%',
        backgroundColor: '#25292e',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
        padding: 20,
    },
    taskHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    taskItem: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 8,
    },
    deleteBtn: {
        backgroundColor: 'red',
        borderRadius: 39,
        padding: 5,
    },
    updateBtn: {
        backgroundColor: 'green',
        borderRadius: 39,
        padding: 5,
    },
    cancelBtn: { backgroundColor: 'dodgerblue', borderRadius: 40, padding: 5 },
    deleteModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // height: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#fff',
    },
    table: {
        minWidth: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerCell: {
        width: CELL_WIDTH,
        padding: 12,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
    },
    headerDayText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3b82f6',
    },
    headerDateText: {
        fontSize: 10,
        color: '#64748b',
        marginTop: 2,
    },
    bodyRow: {
        flexDirection: 'row',
        position: 'relative',
        minHeight: 80,
    },
    cell: {
        width: CELL_WIDTH,
        height: 80,
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellEmpty: {
        backgroundColor: '#fff',
    },
    cellCompleted: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // success color with opacity
    },
    toggleButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkCircleActive: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    checkCircleInactive: {
        borderColor: '#cbd5e1',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
    },
    checkMark: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    checkMarkVisible: {
        color: '#fff',
    },
    checkMarkHidden: {
        color: 'transparent',
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
})