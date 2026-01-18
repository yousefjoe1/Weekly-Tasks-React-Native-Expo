import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { iconFocused, iconNotActive } from '@/styles/tasks';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        },
        tabBarStyle: {
          backgroundColor: Colors['dark'].background,
          height: 50,
          marginHorizontal: 10,
          borderRadius: 50,
          marginBottom: 5
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) =>
            <View style={focused ? styles.iconFocused : styles.iconNotActive}>
              <FontAwesome5 name="tasks" size={24} color={color} />
              <Text>Home</Text>
            </View>
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) =>
            <View style={focused ? styles.iconFocused : styles.iconNotActive}>
              <MaterialCommunityIcons name="monitor-dashboard" size={24} color={color} />
              <Text>Dashboard</Text>
            </View>
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconFocused: iconFocused as ViewStyle,
  iconNotActive: iconNotActive as ViewStyle
})
