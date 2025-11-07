import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { styles } from "../../../assets/styles/user.styles";
import useUsers from "../../../hooks/useUsers";
import EditUserModal from "./modals/EditUserModal";

export default function UserForm() {
  const {
    users,
    fetchUsers,
    handleCreateUser,
    handleDeleteUser,
    handleUserUpdate,
    searchUser,
    setSearchUser,
    loadingUsers,
  } = useUsers();

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  return (
   <ScrollView style={{ flex: 1, backgroundColor: "#FFF8F3" }}
  contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
  showsVerticalScrollIndicator={false}
 >      
 <View style={styles.card}>
        {/* --- Inputs --- */}
        <TextInput
          style={styles.input}
          placeholder="User ID"
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          style={styles.input}
          placeholder="Role"
          value={userRole}
          onChangeText={setUserRole}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={userPassword}
          onChangeText={setUserPassword}
        />

        {/* --- Save Button --- */}
        <TouchableOpacity
  style={styles.saveButtonContainer}
  onPress={async () => {
    await handleCreateUser(userId, userName, userRole, userPassword);
    setUserId("");
    setUserName("");
    setUserRole("");
    setUserPassword("");
  }}
>
  <Text style={styles.saveButtonText}>💾 Save</Text>
</TouchableOpacity>


        {/* --- Refresh --- */}
        <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>

        {/* --- Search Bar --- */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={22} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search user..."
            value={searchUser}
            onChangeText={setSearchUser}
          />
        </View>

        {/* --- Table Header --- */}
        <Text style={styles.tableTitle}>👥 User List</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            paddingBottom: 5,
            marginBottom: 5,
          }}
        >
          <Text style={{ width: "25%", fontWeight: "600" }}>User ID</Text>
          <Text style={{ width: "35%", fontWeight: "600" }}>Name</Text>
          <Text style={{ width: "25%", fontWeight: "600", textAlign: "center" }}>
            Role
          </Text>
          <Text
            style={{
              width: "7.5%",
              textAlign: "center",
              fontWeight: "600",
              color: "#444",
            }}
          >
            ✏️
          </Text>
          <Text
            style={{
              width: "7.5%",
              textAlign: "center",
              fontWeight: "600",
              color: "#444",
            }}
          >
            🗑️
          </Text>
        </View>

        {/* --- User List --- */}
        {loadingUsers ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : users.length > 0 ? (
          users
            .filter((u) =>
              u.name?.toLowerCase().includes(searchUser.toLowerCase())
            )
            .map((u) => (
              <View
                key={u.user_id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ width: "25%", color: "#333" }}>{u.user_id}</Text>
                <Text style={{ width: "35%", color: "#333" }}>{u.name}</Text>
                <Text
                  style={{ width: "25%", color: "#333", textAlign: "center" }}
                >
                  {u.role}
                </Text>

                {/* --- Edit --- */}
                <TouchableOpacity
                  style={{ width: "7.5%", alignItems: "center" }}
                  onPress={() => {
                    setUserToEdit(u);
                    setEditUserModalVisible(true);
                  }}
                >
                  <Ionicons name="create-outline" size={22} color="#007AFF" />
                </TouchableOpacity>

                {/* --- Delete --- */}
                <TouchableOpacity
                  style={{ width: "7.5%", alignItems: "center" }}
                  onPress={() => handleDeleteUser(u.user_id)}
                >
                  <Ionicons name="trash-outline" size={22} color="#e63946" />
                </TouchableOpacity>
              </View>
            ))
        ) : (
          <Text style={{ textAlign: "center", color: "#888" }}>
            No users found
          </Text>
        )}
      </View>

      {/* --- Modal Update --- */}
      {userToEdit && (
        <EditUserModal
          visible={editUserModalVisible}
          setVisible={setEditUserModalVisible}
          user={userToEdit}
          handleUserUpdate={handleUserUpdate}
        />
      )}
    </ScrollView>
  );
}
