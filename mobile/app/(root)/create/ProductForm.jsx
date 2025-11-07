import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { COLORS } from "../../../constants/colors";
import useProducts from "../../../hooks/useProducts";
import EditProductModal from "./modals/EditProductModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ProductForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // --- Load user from AsyncStorage ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("👤 User loaded:", parsedUser);
          setUser(parsedUser);
        } else {
          Alert.alert("Not logged in", "Please sign in again.", [
            { text: "OK", onPress: () => router.push("/signin") },
          ]);
        }
      } catch (err) {
        console.error("❌ Error loading user:", err);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const {
    products,
    filteredProducts,
    loadingProducts,
    searchQuery,
    setSearchQuery,
    fetchProducts,
    handleUpdate,
    handleDelete,
    handleAddToCart,
    handleSaveTransaction,
    isVente,
    setIsVente,
    cartProducts,
    totalAmount,
    productId,
    setProductId,
    title,
    setTitle,
    amount,
    setAmount,
    quantity,
    setQuantity,
    supplierId,
    setSupplierId,
  } = useProducts(user);

  const [showCamera, setShowCamera] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFF8F3", padding: 16 }}
      contentContainerStyle={{ paddingBottom: 30 }} 
    >
      {/* --- MAIN CARD --- */}
      <View
        style={{
          backgroundColor: COLORS.card,
          borderRadius: 16,
          padding: 16,
          shadowColor: COLORS.shadow,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* 🔄 Purchase / Sale Switch */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => setIsVente(false)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: !isVente ? COLORS.primary : "#eee",
              borderRadius: 8,
              padding: 10,
              marginRight: 10,
            }}
          >
            <Ionicons
              name="arrow-down-circle"
              size={22}
              color={!isVente ? "#fff" : COLORS.expense}
            />
            <Text
              style={{
                marginLeft: 6,
                fontWeight: "bold",
                color: !isVente ? "#fff" : COLORS.expense,
              }}
            >
              Purchase
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsVente(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isVente ? COLORS.primary : "#eee",
              borderRadius: 8,
              padding: 10,
            }}
          >
            <Ionicons
              name="arrow-up-circle"
              size={22}
              color={isVente ? "#fff" : COLORS.income}
            />
            <Text
              style={{
                marginLeft: 6,
                fontWeight: "bold",
                color: isVente ? "#fff" : COLORS.income,
              }}
            >
              Sale
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🆔 Product ID + Camera */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
            }}
            placeholder="Product ID (scan or manual)"
            value={productId}
            onChangeText={setProductId}
          />
          <TouchableOpacity
            onPress={() => setShowCamera(true)}
            style={{
              marginLeft: 10,
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Ionicons name="camera-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 🧾 Form fields */}
        {!isVente ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Unit Price (DT)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
            <TextInput
              style={styles.input}
              placeholder="Supplier ID"
              value={supplierId}
              onChangeText={setSupplierId}
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Supplier ID"
              value={supplierId}
              onChangeText={setSupplierId}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </>
        )}

        {/* 🔘 Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={handleAddToCart}
            style={{
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 8,
              flex: 1,
              marginRight: 6,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>➕ Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveTransaction}
            style={{
              backgroundColor: "#8B593E",
              padding: 10,
              borderRadius: 8,
              flex: 1,
              marginLeft: 6,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>💾 Save</Text>
          </TouchableOpacity>
        </View>

        {/* 🛒 Added products */}
        {cartProducts.length > 0 && (
          <View
            style={{
              backgroundColor: "#f2f2f2",
              marginTop: 20,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Added Products:
            </Text>
            {cartProducts.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text>{item.title || item.product_id}</Text>
                <Text>
                  {item.quantity} x {item.amount} = {item.total.toFixed(2)} DT
                </Text>
              </View>
            ))}

            <View
              style={{
                borderTopWidth: 1,
                borderColor: "#ccc",
                marginTop: 10,
                paddingTop: 8,
              }}
            >
              <Text style={{ fontWeight: "bold", color: COLORS.primary }}>
                Total: {totalAmount.toFixed(2)} DT
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 🔍 Search + Product List */}
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={fetchProducts}
          style={{
            alignSelf: "flex-end",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#8B593E", fontWeight: "bold" }}>🔄 Refresh</Text>
        </TouchableOpacity>

        {/* Search bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 10,
            elevation: 2,
          }}
        >
          <Ionicons name="search-outline" size={22} color="#8B593E" />
          <TextInput
            placeholder="Search product"
            style={{ flex: 1, marginLeft: 8 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            onPress={() => setShowCamera(true)}
            style={{
              marginLeft: 10,
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Ionicons name="camera-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#8B593E",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          📦 Product List
        </Text>

        {/* Table header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            paddingBottom: 6,
            marginBottom: 6,
          }}
        >
          <Text style={{ width: "28%", fontWeight: "600" }}>Product</Text>
          <Text style={{ width: "18%", textAlign: "center", fontWeight: "600" }}>
            Price
          </Text>
          <Text style={{ width: "18%", textAlign: "center", fontWeight: "600" }}>
            Qty
          </Text>
          <Text style={{ width: "23%", textAlign: "right", fontWeight: "600" }}>
            Supplier
          </Text>
          <Text style={{ width: "10%", textAlign: "center", fontWeight: "600" }}>
            ✏️
          </Text>
          <Text style={{ width: "10%", textAlign: "center", fontWeight: "600" }}>
            🗑️
          </Text>
        </View>

        {loadingProducts ? (
          <Text style={{ textAlign: "center", marginTop: 10 }}>Loading...</Text>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <View
              key={`${p.product_id}-${p.supplier_id}`}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
                paddingVertical: 6,
              }}
            >
              <Text style={{ width: "28%", color: "#333" }}>{p.title}</Text>
              <Text style={{ width: "18%", textAlign: "center" }}>
                {p.amount} DT
              </Text>
              <Text style={{ width: "18%", textAlign: "center" }}>
                {p.quantity}
              </Text>
              <Text style={{ width: "23%", textAlign: "right" }}>
                {p.supplier_id}
              </Text>

              {/* ✏️ Edit */}
              <TouchableOpacity
                onPress={() => {
                  setProductToEdit(p);
                  setEditModalVisible(true);
                }}
              >
                <Ionicons name="create-outline" size={22} color="#007AFF" />
              </TouchableOpacity>

              {/* 🗑️ Delete */}
              <TouchableOpacity
                style={{ width: "10%", alignItems: "center" }}
                onPress={() => handleDelete(p.product_id, p.supplier_id)}
              >
                <Ionicons name="trash-outline" size={22} color="#e63946" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "#888" }}>
            No products found
          </Text>
        )}
      </View>

      {/* 📸 Camera Modal */}
      {showCamera && (
        <Modal visible={showCamera} animationType="slide">
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39"],
            }}
            onBarcodeScanned={({ data }) => {
              setProductId(data);
              setSearchQuery(data);
              setShowCamera(false);
              Alert.alert("✅ Code detected", `ID: ${data}`);
            }}
          />
          <TouchableOpacity
            onPress={() => setShowCamera(false)}
            style={{
              position: "absolute",
              bottom: 40,
              alignSelf: "center",
              backgroundColor: "#000000aa",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
        </Modal>
      )}

      {/* 🛠️ Edit Modal */}
      {productToEdit && (
        <EditProductModal
          visible={editModalVisible}
          setVisible={setEditModalVisible}
          product={productToEdit}
          handleUpdate={handleUpdate}
        />
      )}
    </ScrollView>
  );
}

const styles = {
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
};
