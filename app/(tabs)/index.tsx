import LoginForm from '@/components/common/LoginForm';
import { supabase } from '@/db/supabase';
import useTasksStore from '@/store/tasksStore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {

  const tasks = useTasksStore((state) => state.tasks)
  const setTasks = useTasksStore((state) => state.setTasks)
  const [isLoginVisible, setIsLoginVisible] = useState(false);

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
    <SafeAreaView style={styles.container}>
      {/* Header with Login Button */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <TouchableOpacity
          onPress={() => setIsLoginVisible(true)}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Task List Logic */}
      <View style={styles.content}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks found</Text>
        ) : (
          tasks.map((task: any) => (
            <Text key={task.id} style={styles.taskItem}>{task.content}</Text>
          ))
        )}
      </View>

      {/* Login Form Overlay */}
      {isLoginVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setIsLoginVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ borderRadius: 24, backgroundColor: '#fff' }}
            >
              <LoginForm />
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  taskItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 8,
  },
  /* Modal Styling */
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    fontWeight: 'bold',
    color: '#333',
  }
});
