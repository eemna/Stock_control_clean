import { useCallback, useEffect, useState } from "react";
import { InteractionManager, Alert } from "react-native";

const API_BASE = process.env.API_URL || "https://stock-control-dike.onrender.com/api/transactions"; 

export default function useTransaction(user_id, role) {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  // 🔹 Charger tous les produits (admin + employé)
  const getProducts = useCallback(async () => {
    if (role !== "admin" && role !== "employe") {
      setError("Accès refusé : vous n'avez pas la permission.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/`);
      const data = await res.json();

      if (res.ok) {
        setProducts(Array.isArray(data) ? data.reverse() : []);
        setError(null);
      } else {
        setError(data.message || "Erreur lors du chargement des produits");
      }
    } catch (err) {
      setError("Erreur réseau lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  }, [role]);

  // 🔹 Charger le résumé global (admin uniquement)
  const getSummary = useCallback(async () => {
    if (role !== "admin") return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/summary/${user_id}`);
      const data = await res.json();

      if (res.ok) {
        setSummary(data);
      } else {
        setError(data.message || "Erreur lors du chargement du résumé");
      }
    } catch (err) {
      setError("Erreur réseau lors du chargement du résumé");
    } finally {
      setLoading(false);
    }
  }, [user_id, role]); // 🟢 ajouté useCallback pour stabilité

  // 🟢 Nouvelle fonction : charger produits + résumé ensemble
  const loadData = useCallback(async () => {
    if (!user_id) return;

    setLoading(true);
    try {
      // 🟢 Parallélisation : charge en même temps produits + résumé
      await Promise.all([
        getProducts(),
        role === "admin" ? getSummary() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [getProducts, getSummary, user_id, role]);
// 🔹 Charger le résumé pour l'employé
/* const getUserSummary = useCallback(async () => {
  if (!user_id || role !== "employe") return;

  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/summary/${user_id}`);
    const data = await res.json();

    if (res.ok) {
      setSummary(data);
      setError(null);
    } else {
      setError(data.message || "Erreur lors du chargement du résumé employé");
    }
  } catch (err) {
    setError("Erreur réseau lors du chargement du résumé employé");
  } finally {
    setLoading(false);
  }
}, [user_id, role]); */

  // 🔹 Supprimer une transaction (admin ou employé)
  const deleteTransaction = useCallback(async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setProducts((prev) => prev.filter((t) => t.id !== id));
        Alert.alert("✅ Succès", "Transaction supprimée avec succès !");
      } else {
        Alert.alert("Erreur", data.message || "Suppression échouée");
      }
    } catch (err) {
      Alert.alert("Erreur réseau", "Impossible de supprimer la transaction");
    }
  }, []);
/* const loadData = useCallback(async () => {
  if (!user_id) return;

  setLoading(true);
  try {
    await Promise.all([
      getProducts(),
      role === "admin" ? getSummary() : null,
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement :", error);
  } finally {
    setLoading(false);
  }
}, [getProducts, getSummary, user_id, role]); */



  // 🔹 useEffect pour chargement initial
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    summary,
    products,
    loading,
    error,
    getProducts,
    deleteTransaction,
    loadData,
    getSummary,
  };
}
