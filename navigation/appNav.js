import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Text, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}