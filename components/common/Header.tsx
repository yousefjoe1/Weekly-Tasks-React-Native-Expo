import { useAuth } from '@/contexts/Auth';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from './LoginForm';

const Header = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const { user, signOut, loading } = useAuth()

    return (
        <SafeAreaView style={styles.header}>
            <Text style={styles.title}>My Tasks</Text>
            {
                user == null ?
                    <TouchableOpacity
                        onPress={() => setIsLoginVisible(true)}
                        style={styles.loginButton}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => signOut()}
                        style={styles.loginButton}
                        disabled={loading}
                    >
                        <Text style={styles.loginButtonText}>Logout</Text>
                    </TouchableOpacity>

            }
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
    )
}

export default Header

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