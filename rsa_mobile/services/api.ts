import axios from "axios";
import { Platform } from "react-native";

// Use 10.0.2.2 for Android Emulator, localhost for iOS/Web
const BASE_URL =
  Platform.OS === "android"
    ? "http://172.16.8.227:5001"
    : "http://localhost:5001";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface KeyGenerationResponse {
  n: number;
  e: number;
  d: number;
  steps: string[];
}

export interface EncryptionResponse {
  ciphertext: number[];
  steps: string[];
}

export interface DecryptionResponse {
  plaintext: string;
  steps: string[];
}

export const generateKeys = async (
  p: number,
  q: number
) => {
  const response =
    await api.post<KeyGenerationResponse>(
      "/generate_keys",
      { p, q }
    );
  return response.data;
};

export const encryptMessage = async (
  plaintext: string,
  e: number,
  n: number
) => {
  const response =
    await api.post<EncryptionResponse>(
      "/encrypt",
      { plaintext, e, n }
    );
  return response.data;
};

export const decryptMessage = async (
  ciphertext: number[],
  d: number,
  n: number
) => {
  const response =
    await api.post<DecryptionResponse>(
      "/decrypt",
      { ciphertext, d, n }
    );
  return response.data;
};
