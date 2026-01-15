import { supabase } from '@/db/supabase';
import useTasksStore from '@/store/tasksStore';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {

  const tasks = useTasksStore((state) => state.tasks)
  const setTasks = useTasksStore((state) => state.setTasks)

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('weekly_tasks').select('*')
      console.log("🚀 ~ fetchTasks ~ data:", data)
      if (error) {
        console.error('Error fetching tasks:', error)
      } else {
        setTasks(data)
      }
    }
    fetchTasks()
  }, [setTasks])



  return (
    <SafeAreaView>
      {/* <AddTaskForm /> */}
      {tasks.length == 0 ? <Text>No tasks found</Text> : tasks?.map((task) => (
        <Text key={task.id}>{task.content}</Text>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
