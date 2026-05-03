import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../firebase/productService";

function formatPrice(centsStr) {
  const cents = parseInt(centsStr || "0", 10);
  const reais = Math.floor(cents / 100);
  const centavos = cents % 100;
  const reaisFormatted = reais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${reaisFormatted},${String(centavos).padStart(2, "0")}`;
}

function priceToRawCents(priceValue) {
  if (typeof priceValue === "number") {
    return String(Math.round(priceValue * 100));
  }
  const str = String(priceValue).trim();
  if (str.includes(".")) {
    const num = parseFloat(str);
    if (!isNaN(num)) return String(Math.round(num * 100));
  }
  if (str.includes(",")) {
    const num = parseFloat(str.replace(",", "."));
    if (!isNaN(num)) return String(Math.round(num * 100));
  }
  const digits = str.replace(/\D/g, "");
  if (digits) return String(parseInt(digits, 10) * 100);
  return "0";
}

function getFirebaseDbError(error) {
  if (error?.message?.includes("permission_denied") || error?.code === "PERMISSION_DENIED") {
    return "Permissão negada. Verifique as regras do banco de dados no Firebase Console.";
  }
  if (error?.message?.includes("network") || error?.code === "auth/network-request-failed") {
    return "Erro de conexão. Verifique sua internet.";
  }
  if (error?.message?.includes("databaseURL") || error?.message?.includes("firebaseio")) {
    return "Banco de dados não configurado. Verifique o campo databaseURL no config.js.";
  }
  return error?.message || "Erro inesperado. Tente novamente.";
}

export default function HomeScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch (error) {
      Alert.alert("Erro ao carregar", getFirebaseDbError(error));
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (route.params?.scannedBarcode) {
      if (route.params.restoredName !== undefined) {
        setName(route.params.restoredName);
      }
      if (route.params.restoredPrice !== undefined) {
        setPrice(route.params.restoredPrice);
      }
      setBarcode(String(route.params.scannedBarcode));
    }
  }, [route.params?.scannedBarcode]);

  function clearForm() {
    setName("");
    setPrice("");
    setBarcode("");
    setEditingProductId(null);
  }

  async function handleSaveProduct() {
    if (!name.trim()) {
      Alert.alert("Campo obrigatório", "Informe o nome do produto.");
      return;
    }
    if (name.trim().length < 2) {
      Alert.alert("Nome inválido", "O nome do produto deve ter no mínimo 2 caracteres.");
      return;
    }
    if (!price || price === "0") {
      Alert.alert("Campo obrigatório", "Informe o preço do produto.");
      return;
    }
    if (parseInt(price, 10) <= 0) {
      Alert.alert("Preço inválido", "O preço deve ser maior que zero.");
      return;
    }

    const numericPrice = parseInt(price, 10) / 100;

    const productData = {
      name: name.trim(),
      price: numericPrice,
      barcode: barcode ? String(barcode).trim() : "",
    };

    setLoading(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        await createProduct(productData);
        Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      }
      clearForm();
      await loadProducts();
    } catch (error) {
      Alert.alert("Erro ao salvar", getFirebaseDbError(error));
    } finally {
      setLoading(false);
    }
  }

  function handleEditProduct(product) {
    setName(product.name || "");
    setPrice(priceToRawCents(product.price));
    setBarcode(product.barcode || "");
    setEditingProductId(product.id);
  }

  function handleCancelEdit() {
    clearForm();
  }

  function handleDeleteProduct(productId) {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              if (editingProductId === productId) clearForm();
              Alert.alert("Sucesso", "Produto excluído com sucesso!");
              await loadProducts();
            } catch (error) {
              Alert.alert("Erro ao excluir", getFirebaseDbError(error));
            }
          },
        },
      ]
    );
  }

  function handleOpenScanner() {
    navigation.navigate("BarcodeScanner", {
      currentName: name,
      currentPrice: price,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, marginTop: 20, marginBottom: 20 }}>
          Bem-vindo!
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Button title="Ler código de barras" onPress={handleOpenScanner} />
        </View>

        <TextInput
          placeholder="Nome do produto *"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        />

        <TextInput
          placeholder="Preço *"
          value={price ? formatPrice(price) : ""}
          onChangeText={(text) => {
            const digits = text.replace(/\D/g, "");
            setPrice(digits);
          }}
          keyboardType="numeric"
          style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
        />

        <TextInput
          placeholder="Código de barras (opcional)"
          value={barcode}
          onChangeText={setBarcode}
          style={{ borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5 }}
        />

        <Button
          title={loading ? "Salvando..." : editingProductId ? "Atualizar produto" : "Cadastrar produto"}
          onPress={handleSaveProduct}
          disabled={loading}
        />

        {editingProductId && (
          <View style={{ marginTop: 10 }}>
            <Button title="Cancelar edição" onPress={handleCancelEdit} />
          </View>
        )}

        <Text style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}>
          Produtos cadastrados
        </Text>

        {products.length === 0 ? (
          <Text style={{ color: "#666" }}>Nenhum produto cadastrado.</Text>
        ) : (
          products.map((item) => (
            <View
              key={item.id}
              style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 }}
            >
              <Text>Nome: {item.name}</Text>
              <Text>Preço: {formatPrice(priceToRawCents(item.price))}</Text>
              <Text>Código de barras: {item.barcode || "Não informado"}</Text>

              <View style={{ marginTop: 10 }}>
                <Button title="Editar" onPress={() => handleEditProduct(item)} />
              </View>
              <View style={{ marginTop: 10 }}>
                <Button title="Excluir" onPress={() => handleDeleteProduct(item.id)} />
              </View>
            </View>
          ))
        )}

        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Button title="Sair" onPress={() => navigation.navigate("Login")} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
