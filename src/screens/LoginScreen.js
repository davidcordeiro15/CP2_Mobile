import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { loginUser } from '../firebase/authService';

function getFirebaseAuthError(code) {
  const errors = {
    'auth/invalid-email': 'Email inválido. Verifique o formato.',
    'auth/user-not-found': 'Nenhuma conta encontrada com este email.',
    'auth/wrong-password': 'Senha incorreta. Tente novamente.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  };
  return errors[code] || 'Erro inesperado. Tente novamente.';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu email.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('Email inválido', 'Informe um email válido (ex: nome@email.com).');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Campo obrigatório', 'Informe sua senha.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha inválida', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro ao entrar', getFirebaseAuthError(error.code));
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
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

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
          style={{ borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5 }}
        />

        <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={{ marginTop: 15, color: '#007AFF' }}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
          <Text style={{ marginTop: 10, color: '#007AFF' }}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
