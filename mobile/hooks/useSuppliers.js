
import { useState, useEffect } from "react";
import { Alert } from "react-native";

const API_URL = process.env.API_URL || "https://stock-control-dike.onrender.com/api"; // ⚠️ ton IP locale ici

export default function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 Récupération des suppliers
  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const res = await fetch(`${API_URL}/suppliers`);
      const data = await res.json();
      console.log("✅ Suppliers fetched:", data);
      setSuppliers(data);
    } catch (error) {
      console.error("❌ Erreur fetch suppliers:", error);
      Alert.alert("Erreur", "Impossible de charger les suppliers");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // ➕ Création d’un supplier
  const handleCreateSupplier = async (supplierId, supplierName, supplierContact, supplierLink) => {
    if (!supplierId || !supplierName || !supplierContact || !supplierLink) {
      return Alert.alert("Erreur", "Tous les champs sont obligatoires");
    }

    const newSupplier = {
      supplier_id: supplierId,
      name: supplierName,
      contact: supplierContact,
      website_link: supplierLink,
    };

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      Alert.alert("✅ Succès", "Supplier ajouté !");
      fetchSuppliers(); // rafraîchir la liste
    } catch (error) {
      console.error("❌ Erreur ajout supplier:", error);
      Alert.alert("Erreur", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🗑️ Suppression d’un supplier
  const handleDeleteSupplier = async (supplierId) => {
    try {
      const res = await fetch(`${API_URL}/suppliers/${supplierId}`, { method: "DELETE" });
      const data = await res.json();
      console.log("🗑️ Supplier supprimé:", data);
      fetchSuppliers();
    } catch (error) {
      console.error("❌ Erreur suppression supplier:", error);
    }
  };

  // ✏️ Mise à jour d’un supplier
  const handleSupplierUpdate = async (supplier) => {
    try {
      const res = await fetch(`${API_URL}/suppliers/${supplier.supplier_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplier),
      });
      const data = await res.json();
      console.log("✅ Supplier updated:", data);
      fetchSuppliers();
    } catch (error) {
      console.error("❌ Erreur update supplier:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    fetchSuppliers,
    handleCreateSupplier,
    handleDeleteSupplier,
    handleSupplierUpdate,
    loadingSuppliers,
    searchSupplier,
    setSearchSupplier,
    isLoading,
  };
}
