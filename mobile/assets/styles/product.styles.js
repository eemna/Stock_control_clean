import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: COLORS.text,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    marginRight: 6,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    marginLeft: 6,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  buttonText: { color: COLORS.white, fontWeight: "bold" },
  cartContainer: {
    marginTop: 20,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 10,
  },
  cartTitle: { fontWeight: "bold", marginBottom: 8 },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartTotal: { borderTopWidth: 1, borderColor: "#ccc", marginTop: 8, paddingTop: 6 },
  cartTotalText: { color: COLORS.primary, fontWeight: "bold" },
});
