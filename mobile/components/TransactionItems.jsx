import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import { formatDate } from "../lib/utils";

export const TransactionItem = ({ item, onDelete }) => {
  const isIncome = parseFloat(item.amount) > 0;

  return (
    <View style={styles.transactionCard} key={item.id}>
      <TouchableOpacity style={styles.transactionContent} activeOpacity={0.8}>
        {/* Partie gauche */}
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>Qty: {item.quantity}</Text>
        </View>

        {/* Partie droite */}
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIncome ? COLORS.income : COLORS.expense },
            ]}
          >
           {isIncome ? "+" : "-"}
{(Math.abs(parseFloat(item.amount)) * parseInt(item.quantity)).toFixed(2)} DT 

          </Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Bouton supprimer */}
      <TouchableOpacity
        style={styles.deleteButton} 
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};
