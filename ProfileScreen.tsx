import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { storage, User } from '../utils/storage';

type ProfileScreenProps = {
  navigation: any;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const currentUser = await storage.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUser();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await storage.logoutUser();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1" style={{ backgroundColor: '#04668D' }}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </SafeAreaView>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1" style={{ backgroundColor: '#04668D' }}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-center mb-4">No user data found</Text>
          <TouchableOpacity
            onPress={() => navigation.replace('Login')}
            className="bg-white rounded-2xl px-8 py-4"
          >
            <Text className="text-primary font-semibold">Go to Login</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#04668D' }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-xl font-bold">AllergyGenie</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Text className="text-white text-sm font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* White Card */}
          <View
            className="bg-white"
            style={{
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingTop: 40,
              paddingHorizontal: 24,
              paddingBottom: 40,
            }}
          >
            {/* Profile Header */}
            <View className="items-center mb-8">
              <View className="w-28 h-28 rounded-full bg-primary items-center justify-center mb-4">
                <Text className="text-white text-5xl font-bold">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-1">{user.name}</Text>
              <Text className="text-gray-500 text-base">{user.email}</Text>
            </View>

            {/* Profile Info Card */}
            <View
              className="bg-gray-50 rounded-3xl p-6 mb-6"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-gray-900 text-lg font-bold mb-6">Profile Information</Text>

              <View className="mb-5 pb-5 border-b border-gray-200">
                <Text className="text-gray-500 text-sm mb-1">Full Name</Text>
                <Text className="text-gray-900 text-base font-semibold">{user.name}</Text>
              </View>

              <View className="mb-5 pb-5 border-b border-gray-200">
                <Text className="text-gray-500 text-sm mb-1">Email</Text>
                <Text className="text-gray-900 text-base font-semibold">{user.email}</Text>
              </View>

              {user.phone && (
                <View className="mb-5 pb-5 border-b border-gray-200">
                  <Text className="text-gray-500 text-sm mb-1">Phone</Text>
                  <Text className="text-gray-900 text-base font-semibold">{user.phone}</Text>
                </View>
              )}

              {user.bio && (
                <View className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">Bio</Text>
                  <Text className="text-gray-900 text-base font-semibold">{user.bio}</Text>
                </View>
              )}
            </View>

            {/* Edit Profile Button with Gradient */}
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              className="rounded-2xl py-5 items-center justify-center mb-4"
              style={{
                shadowColor: '#04668D',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={['#04668D', '#01C49A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="absolute inset-0 rounded-2xl"
              />
              <Text className="text-white text-base font-bold">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
