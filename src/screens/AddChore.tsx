import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
  Text,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import IconSearch from "./IconSearch";
import { StatusBar } from "expo-status-bar";
import ChoreCard from "../components/ChoreCard";
import { Chore } from "../types/Chores";
import { useQueryClient } from "@tanstack/react-query";

export default function AddChoreScreen({ navigation }) {
  const queryClient = useQueryClient();
  const [chore, setChore] = useState(null);
  const [isIconSearchOpen, setIconSearchOpen] = useState(false);
  const [icon, setSelectedIcon] = useState();

  function handleDone() {
    storeChore({ id: uuid.v4(), ...chore });
    queryClient.refetchQueries(["chores"]);
    navigation.navigate("Chores");
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight() {
        return <Button title="Done" color="#000" onPress={handleDone} />;
      },
    });
  }, [handleDone]);

  function handleIconSelection(icon) {
    setSelectedIcon(icon);
    setChore((chore) => ({ icon: icon.images["64"], ...chore }));
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
        onEndEditing={(e) =>
          setChore((chore) => ({ description: e.nativeEvent.text, ...chore }))
        }
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

async function getChores() {
  const chores = await AsyncStorage.getItem("@chores");

  if (chores) {
    return JSON.parse(chores);
  }

  return [];
}

async function storeChore(data) {
  try {
    const chores = await getChores();

    console.log({ store: chores });

    const updated = [...chores, data];

    console.log({ updated });

    await AsyncStorage.setItem("@chores", JSON.stringify(updated));
  } catch (err) {
    console.log(err);
  }
}
