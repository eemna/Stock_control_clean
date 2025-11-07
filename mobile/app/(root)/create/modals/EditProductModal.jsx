import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";

export default function EditProductModal({ visible, setVisible, product, handleUpdate }) {
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newQty, setNewQty] = useState("");

  useEffect(() => {
    if (product) {
      setNewTitle(product.title || "");
      setNewAmount(product.amount?.toString() || "");
      setNewQty(product.quantity?.toString() || "");
    }
  }, [product]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 16,
            width: "85%",
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.primary }}>
            ✏️ Update Product
          </Text>

          <TextInput
            placeholder="Product name"
            value={newTitle}
            onChangeText={setNewTitle}
            style={{
              borderBottomWidth: 1,
              borderColor: COLORS.primary,
              padding: 8,
              marginTop: 10,
            }}
          />

          <TextInput
            placeholder="Price"
            keyboardType="numeric"
            value={newAmount}
            onChangeText={setNewAmount}
            style={{
              borderBottomWidth: 1,
              borderColor: COLORS.primary,
              padding: 8,
              marginTop: 10,
            }}
          />

          <TextInput
            placeholder="Quantity"
            keyboardType="numeric"
            value={newQty}
            onChangeText={setNewQty}
            style={{
              borderBottomWidth: 1,
              borderColor: COLORS.primary,
              padding: 8,
              marginTop: 10,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{
                backgroundColor: "#ccc",
                padding: 10,
                borderRadius: 8,
                flex: 1,
                marginRight: 8,
                alignItems: "center",
              }}
            >
              <Ionicons name="close-circle" size={24} color="#555" />
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await handleUpdate({
                  ...product,
                  title: newTitle,
                  amount: parseFloat(newAmount),
                  quantity: parseInt(newQty),
                });
                setVisible(false);
              }}
              style={{
                backgroundColor: COLORS.primary,
                padding: 10,
                borderRadius: 8,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
