import { supabase } from '@/db/supabase';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// import { Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react-native';

type MessageType = 'success' | 'error';

interface Message {
    type: MessageType;
    text: string;
}

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    const handleSubmit = async () => {
        if (!email || !password) return;

        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Registration successful! Check your email.' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Welcome back!' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    {/* Icon Header */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            {/* <Mail size={24} color="#FFFFFF" /> */}
                        </View>
                        <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
                        <Text style={styles.subtitle}>
                            {isSignUp ? 'Create an account' : 'Enter your email and password'}
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                placeholderTextColor="#94a3b8"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>Submit</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Toggle Auth Mode */}
                    <TouchableOpacity
                        onPress={() => setIsSignUp(!isSignUp)}
                        style={styles.toggleButton}
                    >
                        <Text style={styles.toggleText}>
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </Text>
                    </TouchableOpacity>

                    {/* Feedback Message */}
                    {message && (
                        <View style={[
                            styles.messageBox,
                            message.type === 'success' ? styles.successBox : styles.errorBox
                        ]}>
                            {/* {message.type === 'success' ? 
                                <CheckCircle2 size={18} color="#10b981" /> : 
                                <AlertCircle size={18} color="#ef4444" />
                            } */}
                            <Text style={[
                                styles.messageText,
                                message.type === 'success' ? styles.successText : styles.errorText
                            ]}>
                                {message.text}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 32,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#3b82f6', // Brand Primary
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 8,
        textAlign: 'center',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1e293b',
    },
    submitButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    toggleButton: {
        marginTop: 24,
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 14,
        color: '#64748b',
    },
    messageBox: {
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
    },
    successBox: {
        backgroundColor: '#ecfdf5',
        borderColor: '#10b98133',
    },
    errorBox: {
        backgroundColor: '#fef2f2',
        borderColor: '#ef444433',
    },
    messageText: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    successText: { color: '#059669' },
    errorText: { color: '#dc2626' },
});