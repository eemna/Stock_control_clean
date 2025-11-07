import {  TouchableOpacity , Alert} from 'react-native'
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../assets/styles/home.styles";
import {Ionicons} from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
export const SignOutButton = () => {

  const router=useRouter();
  
  const handleSignOut = async () => {
     Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          router.replace("/(auth)/sign-in");
        },
      },
    ]
  );
  }
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}