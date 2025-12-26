import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { encryptMessage, decryptMessage } from '../services/api';
import * as Haptics from 'expo-haptics';

interface TransformationProps {
  n: number | null;
  e: number | null;
  d: number | null;
}

const Transformation: React.FC<TransformationProps> = ({ n, e, d }) => {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('decrypt');

  // Encrypt
  const [plaintext, setPlaintext] = useState('');
  const [cipherResult, setCipherResult] = useState('');

  // Decrypt
  const [dInput, setDInput] = useState('');
  const [nInput, setNInput] = useState('');
  const [ciphertextInput, setCiphertextInput] = useState('');
  const [plainResult, setPlainResult] = useState('');

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (d) setDInput(d.toString());
    if (n) setNInput(n.toString());
  }, [d, n]);

  const switchTab = (tab: 'encrypt' | 'decrypt') => {
    setActiveTab(tab);
    setLogs([]);
    setIsExpanded(false);
    Haptics.selectionAsync().catch(() => {});
  };

  const handleEncrypt = async () => {
    if (!e || !n) {
      alert('Please generate keys first!');
      return;
    }

    setLoading(true);
    setLogs([]);

    try {
      const data = await encryptMessage(plaintext, e, n);
      const cipher = data.ciphertext.join(' ');

      setCipherResult(cipher);
      setCiphertextInput(cipher);
      setLogs(data.steps);
      setIsExpanded(true);

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    } catch (err: any) {
      alert('Encryption failed: ' + err.message);
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      ).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    setLoading(true);
    setLogs([]);

    try {
      const dVal = parseInt(dInput);
      const nVal = parseInt(nInput);
      const cipherArr = ciphertextInput
        .trim()
        .split(/\s+/)
        .map(Number);

      const data = await decryptMessage(cipherArr, dVal, nVal);

      setPlainResult(data.plaintext);
      setLogs(data.steps);
      setIsExpanded(true);

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    } catch (err: any) {
      alert('Decryption failed: ' + err.message);
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      ).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text className="text-sm font-bold text-ios-gray uppercase tracking-widest mb-2 ml-4">
        Transformation
      </Text>

      <View className="bg-white rounded-xl overflow-hidden shadow-ios border border-gray-100">
        {/* Segmented Control */}
        <View className="p-1 bg-ios-gray6 m-2 rounded-lg flex-row h-10 border border-black/5">
          <Pressable
            onPress={() => switchTab('encrypt')}
            className={`flex-1 items-center justify-center rounded-[7px] ${
              activeTab === 'encrypt' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'encrypt'
                  ? 'text-black'
                  : 'text-gray-500'
              }`}
            >
              Encrypt
            </Text>
          </Pressable>

          <Pressable
            onPress={() => switchTab('decrypt')}
            className={`flex-1 items-center justify-center rounded-[7px] ${
              activeTab === 'decrypt' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'decrypt'
                  ? 'text-black'
                  : 'text-gray-500'
              }`}
            >
              Decrypt
            </Text>
          </Pressable>
        </View>

        <View className="p-4">
          {activeTab === 'encrypt' ? (
            <>
              <Text className="text-xs font-medium text-ios-gray mb-1 ml-1 uppercase">
                Message
              </Text>

              <TextInput
                value={plaintext}
                onChangeText={setPlaintext}
                multiline
                placeholder="Type secret message..."
                className="w-full px-4 py-3 rounded-xl bg-ios-gray6 text-black font-medium text-base mb-4"
                style={{ minHeight: 80, textAlignVertical: 'top' }}
                placeholderTextColor="#C7C7CC"
              />

              <Pressable
                onPress={handleEncrypt}
                disabled={loading}
                className="w-full py-3 bg-ios-indigo rounded-xl items-center justify-center mb-6"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Lock Message
                  </Text>
                )}
              </Pressable>

              {!!cipherResult && (
                <View className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <Text className="text-xs text-green-600 font-bold uppercase mb-1">
                    Ciphertext Output
                  </Text>
                  <Text className="font-mono text-base text-black selectable">
                    {cipherResult}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              <View className="flex-row gap-3 mb-4">
                <TextInput
                  value={dInput}
                  onChangeText={setDInput}
                  keyboardType="numeric"
                  placeholder="D"
                  className="flex-1 px-4 py-3 rounded-xl bg-ios-gray6 text-black"
                />
                <TextInput
                  value={nInput}
                  onChangeText={setNInput}
                  keyboardType="numeric"
                  placeholder="N"
                  className="flex-1 px-4 py-3 rounded-xl bg-ios-gray6 text-black"
                />
              </View>

              <TextInput
                value={ciphertextInput}
                onChangeText={setCiphertextInput}
                multiline
                placeholder="123 456 ..."
                className="w-full px-4 py-3 rounded-xl bg-ios-gray6 text-black font-mono mb-4"
                style={{ minHeight: 80, textAlignVertical: 'top' }}
              />

              <Pressable
                onPress={handleDecrypt}
                disabled={loading}
                className="w-full py-3 bg-ios-blue rounded-xl items-center justify-center mb-6"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Unlock Message
                  </Text>
                )}
              </Pressable>

              {!!plainResult && (
                <View className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <Text className="text-xs text-blue-600 font-bold uppercase mb-1">
                    Plaintext Output
                  </Text>
                  <Text className="font-mono text-base text-black">
                    {plainResult}
                  </Text>
                </View>
              )}
            </>
          )}

          {logs.length > 0 && isExpanded && (
            <View className="mt-4 pt-4 border-t border-gray-100">
              <Text className="text-xs font-bold text-ios-gray uppercase mb-2">
                Process Details
              </Text>
              {logs.map((log, i) => (
                <Text key={i} className="text-xs font-mono text-gray-500 mb-1">
                  {log}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Transformation;
