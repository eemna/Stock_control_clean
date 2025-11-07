import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import ProductForm from "./ProductForm";
import UserForm from "./UserForm";
import SupplierForm from "./SupplierForm";

export default function CreateScreen() {
  const [activeForm, setActiveForm] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔹 Charger l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          Alert.alert("Utilisateur non connecté", "Veuillez vous reconnecter.");
          router.push("/signin");
        }
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger l'utilisateur");
      }
    };
    fetchUser();
  }, []);

  // 🔹 Options disponibles
  const allOptions = [
    { label: "Product Management", icon: "cube-outline", form: "product" },
    { label: "User Management", icon: "people-outline", form: "user" },
    { label: "Supplier Management", icon: "business-outline", form: "supplier" },
  ];

  // 🔹 Si employé → ne montrer que Product
  const availableOptions =
    user?.role === "employe"
      ? allOptions.filter((item) => item.form === "product")
      : allOptions;

  // 🔹 Gestion animation
  const toggleForm = (form) => {
    if (activeForm === form) {
      setActiveForm(null);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setActiveForm(form);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
<ScrollView
  style={{ flex: 1, backgroundColor: COLORS.background }}
  contentContainerStyle={{
    flexGrow: 0, 
    paddingBottom: 0,
  }}
  showsVerticalScrollIndicator={false}
>

      <View style={{ marginTop: 20 }}>
        {availableOptions.map((item) => (
          <TouchableOpacity
            key={item.form}
            onPress={() => toggleForm(item.form)}
            style={{
              backgroundColor: COLORS.white,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              marginHorizontal: 16,
              marginVertical: 6,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name={item.icon} size={22} color={COLORS.primary} />
              <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "600" }}>
                {item.label}
              </Text>
            </View>
            <Ionicons
              name={
                activeForm === item.form
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        ))}
      </View>

  <Animated.View
  style={{
    overflow: "hidden",
    transform: [
      {
        scaleY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  }}
>

        {activeForm === "product" && <ProductForm />}
        {user?.role !== "employe" && activeForm === "user" && <UserForm />}
        {user?.role !== "employe" && activeForm === "supplier" && <SupplierForm />}
      </Animated.View>
    </ScrollView>
  );
}
