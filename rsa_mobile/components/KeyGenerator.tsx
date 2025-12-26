import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { generateKeys, KeyGenerationResponse } from '../services/api';
import * as Haptics from 'expo-haptics';

interface KeyGeneratorProps {
  onKeysGenerated: (data: KeyGenerationResponse) => void;
}

const KeyGenerator: React.FC<KeyGeneratorProps> = ({ onKeysGenerated }) => {
  const [p, setP] = useState('61');
  const [q, setQ] = useState('53');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerate = async () => {
    Haptics.selectionAsync();
    setLoading(true);
    setLogs([]);
    try {
      const pVal = parseInt(p);
      const qVal = parseInt(q);
      
      if (isNaN(pVal) || isNaN(qVal)) {
        alert('Please enter valid prime numbers');
        return;
      }

      const data = await generateKeys(pVal, qVal);
      onKeysGenerated(data);
      setLogs(data.steps);
      setIsExpanded(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
        alert('Error generating keys: ' + (error.response?.data?.error || error.message));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mb-2">
      <Text className="text-sm font-bold text-ios-gray uppercase tracking-widest mb-2 ml-4">Key Generation</Text>
      
      <View className="bg-white rounded-xl overflow-hidden shadow-ios border border-gray-100 mb-4">
          {/* Row P */}
          <View className="flex-row items-center border-b border-gray-100 p-4">
              <Text className="text-base text-black font-medium flex-1">Prime (P)</Text>
              <TextInput
                value={p}
                onChangeText={setP}
                keyboardType="numeric"
                className="text-right text-base text-ios-blue font-medium min-w-[50]"
                placeholder="61"
                placeholderTextColor="#C7C7CC"
              />
          </View>

          {/* Row Q */}
          <View className="flex-row items-center p-4">
              <Text className="text-base text-black font-medium flex-1">Prime (Q)</Text>
              <TextInput
                value={q}
                onChangeText={setQ}
                keyboardType="numeric"
                className="text-right text-base text-ios-blue font-medium min-w-[50]"
                placeholder="53"
                placeholderTextColor="#C7C7CC"
              />
          </View>
      </View>

      <TouchableOpacity
        onPress={handleGenerate}
        disabled={loading}
        className="w-full py-3 bg-ios-blue rounded-xl items-center justify-center shadow-sm mb-4 active:opacity-80"
      >
        {loading ? (
             <ActivityIndicator color="white" />
        ) : (
             <Text className="text-white font-bold text-base">Generate Keys</Text>
        )}
      </TouchableOpacity>
      
      {logs.length > 0 && isExpanded && (
        <View className="bg-white rounded-xl p-4 shadow-ios border border-gray-100">
             <View className="flex-row justify-between items-center mb-3">
                 <Text className="text-xs font-bold text-ios-gray uppercase tracking-widest">Calculation Logs</Text>
                 <TouchableOpacity onPress={() => setIsExpanded(false)}>
                     <Text className="text-xs font-bold text-ios-blue">Hide</Text>
                 </TouchableOpacity>
             </View>
             {logs.map((log, index) => (
                 <View key={index} className="flex-row gap-3 mb-2">
                    <Text className="text-xs font-bold text-ios-gray4 w-4">{index+1}</Text>
                    <Text className="text-xs text-black font-mono flex-1">{log}</Text>
                 </View>
             ))}
        </View>
      )}
    </View>
  );
};

export default KeyGenerator;
