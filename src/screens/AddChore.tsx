import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
  Text,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import IconSearch from "./IconSearch";
import { StatusBar } from "expo-status-bar";
import ChoreCard from "../components/ChoreCard";

export default function AddChoreScreen() {
  const [chore, setChore] = useState({});
  const [isIconSearchOpen, setIconSearchOpen] = useState(false);
  const [icon, setSelectedIcon] = useState();

  function handleIconSelection(icon) {
    setSelectedIcon(icon);
    setChore((chore) => ({ icon, ...chore }));
    setIconSearchOpen(false);
  }

  return (
    <View className="p-8 flex items-center">
      <Pressable onPress={() => setIconSearchOpen(true)}>
        <View className="flex items-center justify-center w-28 h-28 bg-blue-100 border border-blue-400 rounded-full">
          {icon ? (
            <Image
              style={{ height: 64, width: 64 }}
              source={{ uri: icon.images["64"] }}
            />
          ) : (
            <Text>+</Text>
          )}
        </View>
      </Pressable>

      <TextInput
        className="mt-4 w-full p-2 text-center text-3xl border-b-2 border-gray-200"
        placeholder="Chore Description"
        value={chore.description}
      />

      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={isIconSearchOpen}
      >
        <IconSearch onSubmit={handleIconSelection} />
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}
