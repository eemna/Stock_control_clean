import React, { useState } from "react";
import { View, TouchableOpacity, Modal, TextInput, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "https://stock-control-dike.onrender.com/api"; // ton backend

export default function ChatbotButton() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply || "..." };
      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Erreur chatbot:", err);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Erreur de connexion au chatbot." },
      ]);
    }
  };

  return (
    <>
      {/* 🔘 Bouton flottant */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          position: "absolute",
          bottom: 25,
          right: 25,
          backgroundColor: "#007bff",
          borderRadius: 50,
          width: 60,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 6,
        }}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* 💬 Fenêtre de chat */}
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "70%",
              padding: 15,
            }}
          >
            <FlatList
              data={chat}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    alignSelf:
                      item.sender === "user" ? "flex-end" : "flex-start",
                    backgroundColor:
                      item.sender === "user" ? "#007bff" : "#e5e5ea",
                    borderRadius: 12,
                    marginVertical: 4,
                    padding: 8,
                    maxWidth: "80%",
                  }}
                >
                  <Text
                    style={{
                      color: item.sender === "user" ? "white" : "black",
                      fontSize: 15,
                    }}
                  >
                    {item.text}
                  </Text>
                </View>
              )}
            />

            {/* Champ texte + bouton envoyer */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Tape ton message..."
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                }}
              />
              <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 8 }}>
                <Ionicons name="send" size={24} color="#007bff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible(false)} style={{ marginLeft: 10 }}>
                <Ionicons name="close-circle" size={26} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
