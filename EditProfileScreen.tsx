import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { storage, User } from '../utils/storage';

type EditProfileScreenProps = {
  navigation: any;
};

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await storage.getCurrentUser();
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || '');
        setBio(user.bio || '');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setSaving(true);
    try {
      const currentUser = await storage.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Error', 'User not found');
        navigation.replace('Login');
        return;
      }

      // Check if email is being changed and if it already exists
      if (email.trim() !== currentUser.email) {
        const exists = await storage.userExists(email.trim());
        if (exists) {
          Alert.alert('Error', 'An account with this email already exists');
          setSaving(false);
          return;
        }
      }

      const updatedUser: User = {
        ...currentUser,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
      };

      await storage.saveUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
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

  return (
    <View className="flex-1" style={{ backgroundColor: '#04668D' }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-8">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-white text-base font-medium">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Edit Profile</Text>
            <View className="w-16" />
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
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
              <Text className="text-2xl font-bold text-gray-900 mb-2">Update Your Profile</Text>
              <Text className="text-gray-500 text-base mb-8">Edit your information below</Text>

              {/* Form */}
              <View className="mb-6">
                <View className="mb-5">
                  <Text className="text-gray-700 text-sm font-medium mb-2">Full Name</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base"
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  />
                </View>

                <View className="mb-5">
                  <Text className="text-gray-700 text-sm font-medium mb-2">Email address</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  />
                </View>

                <View className="mb-5">
                  <Text className="text-gray-700 text-sm font-medium mb-2">Phone (Optional)</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base"
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-gray-700 text-sm font-medium mb-2">Bio (Optional)</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base"
                    placeholder="Tell us about yourself"
                    placeholderTextColor="#9CA3AF"
                    value={bio}
                    onChangeText={setBio}
                    multiline={true}
                    numberOfLines={4}
                    style={{
                      minHeight: 100,
                      textAlignVertical: 'top',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  />
                </View>

                {/* Save Button with Gradient */}
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={saving}
                  className="rounded-2xl py-5 items-center justify-center"
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
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-base font-bold">Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
