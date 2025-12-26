import "./global.css";
import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useFonts, Quicksand_400Regular, Quicksand_500Medium, Quicksand_700Bold } from '@expo-google-fonts/quicksand'; // Keep existing fonts for now, but use system font style
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatsGraph from './components/StatsGraph';
import KeyGenerator from './components/KeyGenerator';
import Transformation from './components/Transformation';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_700Bold,
    DancingScript_700Bold,
    JetBrainsMono_400Regular,
  });

  const [n, setN] = useState<number | null>(null);
  const [e, setE] = useState<number | null>(null);
  const [d, setD] = useState<number | null>(null);

  if (!fontsLoaded) {
    return null;
  }

  const handleKeysGenerated = (data: any) => {
    setN(data.n);
    setE(data.e);
    setD(data.d);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View className="flex-1 bg-ios-gray6">
      <StatusBar barStyle="dark-content" />
      
      {/* Subtle Gradient Background - Apple Style */}
      <LinearGradient
        colors={['#F2F2F7', '#E5E5EA', '#E5E5EA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute w-full h-full"
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <ScrollView 
                className="flex-1 px-5" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Large Title Header */}
                <View className="mt-6 mb-8">
                    <Text className="text-sm font-bold text-ios-gray uppercase tracking-widest mb-1">Encryption App</Text>
                    <Text className="text-4xl font-bold text-black tracking-tight">RSA Crypt</Text>
                </View>

                {/* Dashboard / Stats */}
                <StatsGraph n={n} e={e} d={d} />
                
                {/* Main Actions */}
                <View className="gap-6">
                    <KeyGenerator onKeysGenerated={handleKeysGenerated} />
                    <Transformation n={n} e={e} d={d} />
                </View>

                {/* Info Card */}
                <View className="mt-8 mb-4 bg-white/70 rounded-2xl p-4 border border-white/50 shadow-sm">
                     <Text className="text-xs font-bold text-ios-gray uppercase tracking-widest mb-3">Formula Reference</Text>
                     <View className="space-y-3">
                         <View className="flex-row justify-between items-center pb-2 border-b border-gray-200/50">
                             <Text className="font-medium text-gray-800">Encryption</Text>
                             <Text className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded overflow-hidden">C = M^e mod n</Text>
                         </View>
                         <View className="flex-row justify-between items-center">
                             <Text className="font-medium text-gray-800">Decryption</Text>
                             <Text className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded overflow-hidden">M = C^d mod n</Text>
                         </View>
                     </View>
                </View>

                <Text className="text-center text-xs text-ios-gray4 font-bold mt-4 uppercase tracking-widest">
                    v1.0.0 • Bloom Edition
                </Text>

            </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
         
      {/* Tab Bar Blur Effect (Visual only for now) */}
      <BlurView intensity={80} tint="light" className="absolute bottom-0 w-full border-t border-gray-200/50 pb-8 pt-4">
        <View className="flex-row justify-center items-center">
            <Text className="text-[10px] font-bold text-ios-gray uppercase tracking-widest">
                 Designed by Azzahra
            </Text>
        </View>
      </BlurView>
    </View>
  );
}
