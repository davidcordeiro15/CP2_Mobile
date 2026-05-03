import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { resetUserPassword } from '../firebase/authService';

function getFirebaseAuthError(code) {
  const errors = {
    'auth/invalid-email': 'Email inválido. Verifique o formato.',
    'auth/user-not-found': 'Nenhuma conta encontrada com este email.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  };
  return errors[code] || 'Erro inesperado. Tente novamente.';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu email.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('Email inválido', 'Informe um email válido (ex: nome@email.com).');
      return;
    }

    setLoading(true);
    try {
      await resetUserPassword(email.trim());
      Alert.alert(
        'Email enviado',
        'Enviamos as instruções de recuperação de senha para seu email.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro ao enviar email', getFirebaseAuthError(error.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, marginBottom: 10 }}>Recuperar Senha</Text>
        <Text style={{ color: '#666', marginBottom: 20 }}>
          Informe o email cadastrado e enviaremos as instruções para redefinir sua senha.
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5 }}
        />

        <Button
          title={loading ? 'Enviando...' : 'Enviar instruções'}
          onPress={handleResetPassword}
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
