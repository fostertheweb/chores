import { useCallback, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";

import { Chore } from "./AddChore";

export default function ChoresScreen() {
  // useEffect(async () => await AsyncStorage.clear(), []);

  const { data, refetch } = useQuery(["chores"], getChores);
  const enabledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (enabledRef.current) {
        console.log("Refetching");
        refetch();
      } else {
        enabledRef.current = true;
      }
    }, [refetch])
  );

  const renderItem = ({ item }) => (
    <View
      style={{ flex: 3, maxWidth: "33.3%", alignItems: "stretch" }}
      className="p-2"
    >
      <Pressable
        onPress={() => alert("Edit " + item.description)}
        onLongPress={() => alert("Complete " + item.description)}
        className="flex-1 border border-gray-300 rounded shadow bg-white p-4 flex items-center justify-center"
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
