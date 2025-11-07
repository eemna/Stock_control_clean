import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const API_URL =  "https://stock-control-dike.onrender.com/api"; 

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (name, password) => {
    if (!name || !password) {
      alert("Veuillez remplir tous les champs");
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Nom ou mot de passe incorrect");
        return false;
      }

      //  Enregistrer l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      console.log("✅ Connexion réussie :", data.user);
      router.push("/"); // Redirige vers la page principale
      return true;
    } catch (error) {
      console.error("❌ Erreur de connexion :", error);
      alert("Erreur de connexion au serveur");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fonction de déconnexion
  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.push("/(auth)/sign-in");
  };

  return { login, logout, loading };
}
