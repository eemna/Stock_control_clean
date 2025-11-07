// app/(root)/create/SupplierForm.jsx
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
import useSuppliers from "../../../hooks/useSuppliers";
import EditSupplierModal from "./modals/EditSupplierModal";

export default function SupplierForm() {
  const {
    suppliers,
    fetchSuppliers,
    handleCreateSupplier,
    handleDeleteSupplier,
    handleSupplierUpdate,
    searchSupplier,
    setSearchSupplier,
    loadingSuppliers,
    isLoading,
  } = useSuppliers();

  const [supplierId, setSupplierId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [supplierLink, setSupplierLink] = useState("");

  const [editSupplierModalVisible, setEditSupplierModalVisible] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF8F3" }}
  contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
  showsVerticalScrollIndicator={false}
 >
      <View style={styles.card}>
        {/* --- Inputs --- */}
        <TextInput
          style={styles.input}
          placeholder="Supplier ID"
          value={supplierId}
          onChangeText={setSupplierId}
        />
        <TextInput
          style={styles.input}
          placeholder="Supplier Name"
          value={supplierName}
          onChangeText={setSupplierName}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Info"
          value={supplierContact}
          onChangeText={setSupplierContact}
        />
        <TextInput
          style={styles.input}
          placeholder="Website Link"
          value={supplierLink}
          onChangeText={setSupplierLink}
        />

        {/* --- Save Button --- */}
        <TouchableOpacity
          style={styles.saveButtonContainer}
          onPress={() =>
            handleCreateSupplier(supplierId, supplierName, supplierContact, supplierLink)
          }
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Loading..." : "💾 Save"}
          </Text>
        </TouchableOpacity>

        {/* --- Refresh --- */}
        <TouchableOpacity onPress={fetchSuppliers} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>

        {/* --- Search Bar --- */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={22} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search supplier..."
            value={searchSupplier}
            onChangeText={setSearchSupplier}
          />
        </View>

        {/* --- Table Header --- */}
        <Text style={styles.tableTitle}>🏢 Supplier List</Text>
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
          <Text style={{ width: "15%", fontWeight: "600" }}>ID</Text>
          <Text style={{ width: "25%", fontWeight: "600" }}>Name</Text>
          <Text style={{ width: "25%", fontWeight: "600" }}>Website</Text>
          <Text style={{ width: "20%", fontWeight: "600", textAlign: "center" }}>Contact</Text>
          <Text style={{ width: "7.5%", textAlign: "center", fontWeight: "600" }}>✏️</Text>
          <Text style={{ width: "7.5%", textAlign: "center", fontWeight: "600" }}>🗑️</Text>
        </View>

        {/* --- Supplier List --- */}
        {loadingSuppliers ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : suppliers.length > 0 ? (
          suppliers
            .filter((s) =>
              s.name?.toLowerCase().includes(searchSupplier.toLowerCase())
            )
            .map((s) => (
              <View
                key={s.supplier_id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ width: "15%", color: "#333" }}>{s.supplier_id}</Text>
                <Text style={{ width: "25%", color: "#333" }}>{s.name}</Text>
                <Text style={{ width: "25%", color: "#333" }}>{s.website_link}</Text>
                <Text style={{ width: "20%", color: "#333", textAlign: "center" }}>
                  {s.contact}
                </Text>

                {/* --- Edit --- */}
                <TouchableOpacity
                  style={{ width: "7.5%", alignItems: "center" }}
                  onPress={() => {
                    setSupplierToEdit(s);
                    setEditSupplierModalVisible(true);
                  }}
                >
                  <Ionicons name="create-outline" size={22} color="#007AFF" />
                </TouchableOpacity>

                {/* --- Delete --- */}
                <TouchableOpacity
                  style={{ width: "7.5%", alignItems: "center" }}
                  onPress={() => handleDeleteSupplier(s.supplier_id)}
                >
                  <Ionicons name="trash-outline" size={22} color="#e63946" />
                </TouchableOpacity>
              </View>
            ))
        ) : (
          <Text style={{ textAlign: "center", color: "#888" }}>No suppliers found</Text>
        )}
      </View>

      {/* --- Edit Modal --- */}
      {supplierToEdit && (
        <EditSupplierModal
          visible={editSupplierModalVisible}
          setVisible={setEditSupplierModalVisible}
          supplier={supplierToEdit}
          handleSupplierUpdate={handleSupplierUpdate}
        />
      )}
    </ScrollView>
  );
}
