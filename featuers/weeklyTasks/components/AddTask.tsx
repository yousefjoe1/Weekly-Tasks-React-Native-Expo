import { useAuth } from "@/contexts/Auth";
import useTasksStore from "@/store/tasksStore";
import { WeeklyTask } from "@/types";
import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { WeeklyTasksService } from '../services/weeklyTasksService';


export function AddBlock() {
    const { user } = useAuth();
    const [taskName, setTaskName] = useState('');
    const [loading, setLoading] = useState(false);

    const addTask = useTasksStore((state) => state.addTask)


    const addNewTask = async () => {
        if (taskName.length < 3) {
            // Use your toast here
            alert('Task name must be at least 3 characters long');
            return;
        }

        setLoading(true);

        try {
            // 1. Prepare data
            const newTaskObj: WeeklyTask = {
                id: Date.now().toString(),
                content: taskName,
                days: {},
            };

            // 2. Call Service (Direct Supabase call)
            const savedTask = await WeeklyTasksService.addTask(newTaskObj, user?.id);

            // 3. Update Parent UI state
            addTask(savedTask);

            // 4. Reset local input
            // setTaskName('');
        } catch (err) {
            console.error(err);
            alert('Failed to add task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Task Name</Text>
                <TextInput
                    editable={!loading}
                    value={taskName}
                    onChangeText={setTaskName}
                    placeholder="e.g. Morning Workout"
                    placeholderTextColor="#94a3b8"
                    style={styles.input}
                />
            </View>

            <TouchableOpacity
                disabled={loading}
                onPress={addNewTask}
                style={[styles.button, loading && styles.buttonDisabled]}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                    <>
                        {/* <Calendar size={18} color="#3b82f6" style={{ marginRight: 8 }} /> */}
                        <Text style={styles.buttonText}>Add Task</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
        marginHorizontal: 16,
        marginVertical: 10,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#f8fafc',
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        color: '#0f172a',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#eff6ff', // Light blue background
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#3b82f6',
        fontWeight: '700',
        fontSize: 16,
    },
});