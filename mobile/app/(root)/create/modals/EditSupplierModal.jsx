// app/(root)/create/modals/EditSupplierModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";

export default function EditSupplierModal({ visible, setVisible, supplier, handleSupplierUpdate }) {
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(() => {
    if (supplier) {
      setNewName(supplier.name);
      setNewContact(supplier.contact);
      setNewWebsite(supplier.website_link);
    }
  }, [supplier]);

  if (!supplier) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
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
            backgroundColor: COLORS.white,
            padding: 20,
            borderRadius: 16,
            width: "85%",
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              color: COLORS.primary,
              marginBottom: 10,
            }}
          >
            ✏️ Edit Supplier
          </Text>

          <TextInput
            style={{
              borderBottomWidth: 1,
              marginBottom: 10,
              paddingVertical: 6,
              fontSize: 16,
            }}
            value={newName}
            onChangeText={setNewName}
            placeholder="Supplier Name"
          />

          <TextInput
            style={{
              borderBottomWidth: 1,
              marginBottom: 10,
              paddingVertical: 6,
              fontSize: 16,
            }}
            value={newContact}
            onChangeText={setNewContact}
            placeholder="Contact"
          />

          <TextInput
            style={{
              borderBottomWidth: 1,
              marginBottom: 15,
              paddingVertical: 6,
              fontSize: 16,
            }}
            value={newWebsite}
            onChangeText={setNewWebsite}
            placeholder="Website Link"
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleSupplierUpdate({
                  ...supplier,
                  name: newName,
                  contact: newContact,
                  website_link: newWebsite,
                });
                setVisible(false);
              }}
            >
              <Ionicons name="checkmark-circle" size={30} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close-circle" size={30} color={COLORS.expense} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
