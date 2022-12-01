import { useEffect } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import { Chore } from "./AddChore";

// TODO: Today Tab - summary of immediate needs
// TODO: Chores List Tab - all chores, add, edit, sort by time

export default function ChoresScreen() {
  // useEffect(async () => await AsyncStorage.clear(), []);
  const { data } = useQuery(["chores"], getChores);

  // TODO: update countdowns on refocus

  const renderItem = ({ item }) => (
    <View
      style={{ flex: 3, maxWidth: "33.3%", alignItems: "stretch" }}
      className="p-2"
    >
      <Pressable
        onPress={() => alert("Edit " + item.description)}
        onLongPress={() => alert("Complete " + item.description)}
        className="flex-1 border border-gray-300 rounded shadow bg-white px-2 py-3 flex items-center shrink-0 justify-center"
      >
        <View className="w-16 h-16 flex items-center justify-center rounded-full bg-transparent">
          <Image
            style={{ height: 48, width: 48 }}
            source={{ uri: item.icon }}
          />
        </View>
        <Text className="text-black mt-2">{item.description}</Text>
      </Pressable>
    </View>
  );
  const keyExtractor = (item: Chore, index) => item.id;

  return (
    <View className="flex-row flex-wrap flex-3 mx-auto items-center p-2">
      {data && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          className="h-screen w-screen"
          numColumns={3}
        />
      )}
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
