import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
//import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";

export default function EditUserModal({ visible, setVisible, user, handleUserUpdate }) {
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Charger les données du user sélectionné
  useEffect(() => {
    if (user) {
      setNewName(user.name || "");
      setNewRole(user.role || "");
      setNewPassword(user.password || "");
    }
  }, [user]);

  if (!user) return null;

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
              marginBottom: 15,
            }}
          >
            ✏️ Edit User
          </Text>

          {/* --- Name --- */}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 8,
              padding: 8,
              marginBottom: 10,
            }}
            value={newName}
            onChangeText={setNewName}
            placeholder="User Name"
          />

          {/* --- Role --- */}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 8,
              padding: 8,
              marginBottom: 10,
            }}
            value={newRole}
            onChangeText={setNewRole}
            placeholder="Role"
          />

          {/* --- Password --- */}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 8,
              padding: 8,
              marginBottom: 20,
            }}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry
          />

          {/* --- Buttons --- */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* Save */}
            <TouchableOpacity
              onPress={async () => {
                await handleUserUpdate({
                  ...user,
                  name: newName,
                  role: newRole,
                  password: newPassword,
                });
                setVisible(false);
              }}
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 10,
                paddingHorizontal: 25,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>💾 Save</Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{
                backgroundColor: "#ccc",
                paddingVertical: 10,
                paddingHorizontal: 25,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#000", fontWeight: "600" }}>✖ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
