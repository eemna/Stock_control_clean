import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import { useLogin } from "../../hooks/useLogin";

export default function SignIn() {
  const router = useRouter();
  const { login, loading } = useLogin(); 

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!name || !password) {
      setError("Veuillez remplir tous les champs !");
      return;
    }

    const success = await login(name, password); // ✅ renvoie true/false

    if (success) {
      Alert.alert("Succès", "Connexion réussie !");
      router.replace("/(root)"); // ✅ redirection
    } else {
      setError("Nom d’utilisateur ou mot de passe incorrect !");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.illustration}
        />

        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor={COLORS.textLight}
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor={COLORS.textLight}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading} // ✅ correction ici
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : "Sign In"} {/* ✅ correction ici */}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
