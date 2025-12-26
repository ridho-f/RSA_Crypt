import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';

interface StatsGraphProps {
  n: number | null;
  e: number | null;
  d: number | null;
}

const StatsGraph: React.FC<StatsGraphProps> = ({ n, e, d }) => {
  return (
    <View className="flex-row gap-3 mb-6">
      {/* Modulus Widget */}
      <View className="flex-1 bg-white rounded-2xl p-3 shadow-ios border border-gray-100">
         <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mb-2">
             <Text className="font-bold text-indigo-500 text-xs">N</Text>
         </View>
         <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Modulus</Text>
         <Text className="text-lg font-bold text-gray-800 leading-5 mt-1" numberOfLines={1}>
             {n ? n : '-'}
         </Text>
      </View>

      {/* Public Key Widget */}
      <View className="flex-1 bg-white rounded-2xl p-3 shadow-ios border border-gray-100">
         <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mb-2">
             <Text className="font-bold text-blue-500 text-xs">E</Text>
         </View>
         <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Public</Text>
         <Text className="text-lg font-bold text-blue-600 leading-5 mt-1" numberOfLines={1}>
             {e ? e : '-'}
         </Text>
      </View>

      {/* Private Key Widget */}
      <View className="flex-1 bg-white rounded-2xl p-3 shadow-ios border border-gray-100">
         <View className="w-8 h-8 rounded-full bg-pink-100 items-center justify-center mb-2">
             <Text className="font-bold text-pink-500 text-xs">D</Text>
         </View>
         <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Private</Text>
         <Text className="text-lg font-bold text-fem-primary leading-5 mt-1" numberOfLines={1}>
             {d ? d : '-'}
         </Text>
      </View>
    </View>
  );
};

export default StatsGraph;
