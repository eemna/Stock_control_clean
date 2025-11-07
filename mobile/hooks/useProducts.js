import { useState, useEffect } from "react";
import { Alert } from "react-native";

const API_URL = process.env.API_URL || "https://stock-control-dike.onrender.com/api"; // 🟢 adapte ton IP locale

export default function useProducts(user) {
  // --- États principaux ---
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- États pour transactions ---
  const [isVente, setIsVente] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // --- États pour le produit en cours ---
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplierId, setSupplierId] = useState("");

  // --- 🔄 Charger tous les produits ---
const fetchProducts = async () => {
  try {
    setLoadingProducts(true);
    const response = await fetch(`${API_URL}/products/`);
    const text = await response.text(); // 👈 pour voir la vraie réponse
    console.log("🧩 Réponse brute :", text);

    const data = JSON.parse(text); // 👈 parse ensuite
   setProducts(data.reverse());
   setFilteredProducts(data.reverse());

  } catch (error) {
    console.error("❌ Erreur lors du chargement des produits :", error);
    Alert.alert("Erreur", "Impossible de charger les produits.");
  } finally {
    setLoadingProducts(false);
  }
};


  // --- 🔍 Recherche ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            p.title?.toLowerCase().includes(query) ||
            p.product_id?.toLowerCase().includes(query) ||
            p.supplier_id?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, products]);

  // --- 🗑️ Supprimer un produit ---
  const handleDelete = async (productId, supplierId) => {
    try {
      const res = await fetch(
        `${API_URL}/products/${productId}?supplier_id=${supplierId}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      console.log("✅ Produit supprimé :", result);
      fetchProducts();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      Alert.alert("Erreur", "Impossible de supprimer le produit.");
    }
  };

  // --- ✏️ Mettre à jour un produit ---
  const handleUpdate = async (product) => {
    try {
      const res = await fetch(
        `${API_URL}/products/${product.product_id}/${product.supplier_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: product.title,
            amount: product.amount,
            quantity: product.quantity,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de mise à jour");

      Alert.alert("✅ Succès", "Produit mis à jour !");
      fetchProducts();
    } catch (error) {
      Alert.alert("❌ Erreur", error.message);
    }
  };

  // --- 🆕 Créer un produit (achat/vente) ---
  const handleCreateProduct = async (productData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Échec de création");

      Alert.alert("✅ Produit ajouté !");
      fetchProducts();
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de créer le produit");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 🛒 Ajouter au panier ---
  const handleAddToCart = async () => {
    if (!productId.trim())
      return Alert.alert("Erreur", "Veuillez saisir l’ID produit");
    if (!quantity || isNaN(quantity) || quantity <= 0)
      return Alert.alert("Erreur", "Quantité invalide");
    if (!supplierId.trim())
      return Alert.alert("Erreur", "Veuillez saisir l’ID fournisseur");

    try {
      let itemAmount = parseFloat(amount);
      let itemTitle = title.trim();

      if (isVente) {
        const res = await fetch(`${API_URL}/products/${productId}/${supplierId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Produit introuvable");
        itemAmount = parseFloat(data.amount);
        itemTitle = data.title;
      } else {
        if (!itemAmount || itemAmount <= 0)
          return Alert.alert("Erreur", "Montant invalide pour l'achat");
      }

      const newItem = {
        product_id: productId.trim(),
        title: itemTitle || "Produit inconnu",
        amount: itemAmount,
        quantity: parseInt(quantity),
        supplier_id: supplierId.trim(),
        total: itemAmount * parseInt(quantity),
      };

      setCartProducts((prev) => [...prev, newItem]);
      setTotalAmount((prev) => prev + newItem.total);

      // Réinitialise les champs
      setProductId("");
      setTitle("");
      setAmount("");
      setQuantity("");
    } catch (err) {
      Alert.alert("Erreur", err.message);
    }
  };

  // --- 💾 Sauvegarder la transaction ---
  const handleSaveTransaction = async () => {
    if (cartProducts.length === 0)
      return Alert.alert("Erreur", "Aucun produit ajouté !");
    const userId = user?.user_id;
    if (!userId) return Alert.alert("Erreur", "Utilisateur introuvable");

    setIsLoading(true);
    try {
      for (const p of cartProducts) {
        const payload = {
          ...p,
          user_id: userId,
          amount: isVente ? -Math.abs(p.amount) : Math.abs(p.amount),
        };

        await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      Alert.alert("✅ Succès", isVente ? "Vente enregistrée !" : "Achat enregistré !");
      setCartProducts([]);
      setTotalAmount(0);
    } catch (error) {
      Alert.alert("Erreur", "Impossible d’enregistrer la transaction");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Produits
    products,
    filteredProducts,
    loadingProducts,
    searchQuery,
    setSearchQuery,
    fetchProducts,

    // Actions CRUD
    handleCreateProduct,
    handleUpdate,
    handleDelete,

    // Transactions
    handleAddToCart,
    handleSaveTransaction,

    // États internes
    isVente,
    setIsVente,
    isLoading,
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
  };
}
