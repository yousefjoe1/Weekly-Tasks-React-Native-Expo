import { AddBlock } from '@/featuers/weeklyTasks/components/AddTask';
import TaskItem from '@/featuers/weeklyTasks/components/TaskItem';
import { useWeeklyTasks } from '@/featuers/weeklyTasks/hooks/useWeeklyTasks';
import useTasksStore from '@/store/tasksStore';
import { WeeklyTask } from '@/types';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const { updateBlock, deleteBlock } = useWeeklyTasks();
  const { loading } = useTasksStore();

  const tasks = useTasksStore((state) => state.tasks)



  return (
    <SafeAreaView style={styles.container}>
      <AddBlock />
      {/* Task List Logic */}
      <View style={styles.content}>
        {loading && <ActivityIndicator size="small" color="#3b82f6" />}
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks found</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item: WeeklyTask) => item.id.toString()}
            renderItem={({ item }) => (
              <TaskItem onDelete={deleteBlock} onUpdate={updateBlock} item={item} />
            )}
          />
        )}
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    height: '70%'
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
