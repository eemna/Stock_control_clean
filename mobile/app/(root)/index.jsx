import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import useTransaction from "../../hooks/useTransaction";
import { styles } from "../../assets/styles/home.styles";
import { COLORS } from "../../constants/colors";
import { SignOutButton } from "@/components/SignOutButton";
import { TransactionItem } from "../../components/TransactionItems";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import PageLoader from "../../components/PageLoader";
import ChatbotButton from "../../components/ChatbotButton";


export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  // Load user from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const {
    summary,
    products,
    loading,
    error,
    deleteTransaction,
    loadData,
  } = useTransaction(user?.user_id, user?.role);

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
      ]
    );
  };

  if (loading && !refreshing) return <PageLoader />;

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );

  return (
    <View style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* === HEADER === */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.usernameText}>{user?.name}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/create")}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <SignOutButton />
        </View>
      </View>

      {/* === SUMMARY CARD (Admin only) === */}
      {user?.role === "admin" && (
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {parseFloat(summary?.balance || 0).toFixed(2)} DT
          </Text>

          <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Income</Text>
              <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
                + {parseFloat(summary?.income || 0).toFixed(2)} DT
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Expenses</Text>
              <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
                - {Math.abs(parseFloat(summary?.expenses || 0)).toFixed(2)} DT
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* === TRANSACTIONS LIST === */}
      <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={products}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
       <View style={styles.container}>
    {/* ...tout ton contenu existant... */}
    <ChatbotButton />  {/* 👈 bouton flottant ajouté ici */}
  </View>
    </View>
  );
}
