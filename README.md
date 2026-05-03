# CP2 Mobile — Gerenciador de Produtos

Aplicativo mobile desenvolvido com Expo e React Native para cadastro, edição, exclusão e listagem de produtos, com autenticação via Firebase e leitura de código de barras.

---

## Tecnologias utilizadas

- **React Native** — framework para desenvolvimento mobile
- **Expo** (~54) — plataforma de build e execução
- **Firebase** — autenticação (Auth) e banco de dados (Firestore)
- **expo-camera** — leitura de código de barras
- **React Navigation** — navegação entre telas

---

## Funcionalidades principais

- Login, cadastro e recuperação de senha via Firebase Auth
- Cadastro, edição e exclusão de produtos no Firestore
- Leitura de código de barras pela câmera do dispositivo
- Exibição de preços no padrão brasileiro (R$ 1.000,00)
- Interface responsiva para telas pequenas

---

## Melhorias implementadas

1. **Formatação de preço no padrão brasileiro**
   - Input aceita apenas dígitos; máscara aplicada automaticamente na exibição
   - Preço armazenado como número no Firebase (`1050` centavos → `10.50`)
   - Exibição formatada em toda a interface: `R$ 10,50`

2. **Correção do teclado em telas pequenas**
   - `KeyboardAvoidingView` com `behavior` correto para iOS (`padding`) e Android (`height`)
   - `ScrollView` com `keyboardShouldPersistTaps="handled"` em todas as telas de formulário

3. **Preservação de dados ao voltar do scanner**
   - Nome e preço são passados como parâmetros ao navegar para o scanner
   - Ao retornar, apenas o campo de código de barras é atualizado; os demais campos são restaurados

4. **Melhoria de rolagem em telas pequenas**
   - `FlatList` substituída por `ScrollView` com `contentContainerStyle={{ flexGrow: 1 }}` na HomeScreen
   - Evita conflitos de scroll aninhado e garante acesso a todo o conteúdo

5. **Correção do bug `window.confirm`**
   - Substituído por `Alert.alert` com botões "Cancelar" e "Excluir" para confirmação de exclusão de produtos

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Aplicativo **Expo Go** no celular (ou emulador Android/iOS)

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o projeto
npx expo start
```

Escaneie o QR code com o aplicativo Expo Go (Android) ou com a câmera (iOS).

### Configuração do Firebase

Edite o arquivo `src/firebase/config.js` com as credenciais do seu projeto Firebase:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};
```
