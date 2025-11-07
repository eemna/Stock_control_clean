import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  card: {
    flex: 1, // prend tout l’espace disponible
    backgroundColor: COLORS.card,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  saveButtonContainer: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  refreshButton: {
    alignSelf: "flex-end",
    marginVertical: 10,
    padding: 8,
    borderRadius: 8,
  },

  refreshButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 8,
    fontSize: 16,
  },

  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
    marginBottom: 6,
  },

  tableHeaderText: {
    fontWeight: "600",
    color: COLORS.text,
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  tableText: {
    color: COLORS.text,
    fontSize: 15,
  },

  loadingText: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
});
