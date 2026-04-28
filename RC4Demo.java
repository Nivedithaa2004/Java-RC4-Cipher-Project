package com.example.rc4.service;

import org.springframework.stereotype.Service;

@Service
public class RC4Service {

    public String process(String input, String key) {
        byte[] S = new byte[256];
        byte[] K = new byte[256];

        // Initialize arrays
        for (int i = 0; i < 256; i++) {
            S[i] = (byte) i;
            K[i] = (byte) key.charAt(i % key.length());
        }

        // KSA (Key Scheduling Algorithm)
        int j = 0;
        for (int i = 0; i < 256; i++) {
            j = (j + S[i] + K[i]) & 0xFF;
            byte temp = S[i];
            S[i] = S[j];
            S[j] = temp;
        }

        // PRGA (Pseudo-Random Generation Algorithm)
        int i = 0;
        j = 0;
        char[] result = new char[input.length()];

        for (int n = 0; n < input.length(); n++) {
            i = (i + 1) & 0xFF;
            j = (j + S[i]) & 0xFF;

            byte temp = S[i];
            S[i] = S[j];
            S[j] = temp;

            int t = (S[i] + S[j]) & 0xFF;
            int k = S[t];

            result[n] = (char) (input.charAt(n) ^ k);
        }

        return new String(result);
    }
}