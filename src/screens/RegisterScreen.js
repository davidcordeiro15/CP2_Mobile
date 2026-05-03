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
import { registerUser } from '../firebase/authService';

function getFirebaseAuthError(code) {
  const errors = {
    'auth/invalid-email': 'Email inválido. Verifique o formato.',
    'auth/email-already-in-use': 'Este email já está cadastrado. Faça login ou recupere sua senha.',
    'auth/weak-password': 'Senha fraca. Use no mínimo 6 caracteres.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  };
  return errors[code] || 'Erro inesperado. Tente novamente.';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu nome.');
      return;
    }
    if (name.trim().length < 2) {
      Alert.alert('Nome inválido', 'O nome deve ter no mínimo 2 caracteres.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu email.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('Email inválido', 'Informe um email válido (ex: nome@email.com).');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Campo obrigatório', 'Informe uma senha.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha inválida', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!confirmPassword.trim()) {
      Alert.alert('Campo obrigatório', 'Confirme sua senha.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas não conferem', 'A senha e a confirmação devem ser iguais.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email.trim(), password);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro ao cadastrar', getFirebaseAuthError(error.code));
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
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Cadastro</Text>

        <TextInput
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        />

        <TextInput
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        />

        <TextInput
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5 }}
        />

        <Button
          title={loading ? 'Cadastrando...' : 'Cadastrar'}
          onPress={handleRegister}
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
