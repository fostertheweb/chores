import { FlatList, Pressable, Text, View } from "react-native";
import { Chore } from "./AddChore";

export default function ChoresScreen() {
  const data: Chore[] = [
    {
      id: 0,
      name: "Mop Floors",
      icon: "mop",
      interval: 1,
      interval_unit: "months",
    },
    {
      id: 1,
      name: "Dust",
      icon: "duster",
      interval: 2,
      interval_unit: "weeks",
    },
    {
      id: 2,
      name: "Riley Pills",
      icon: "pill-rx",
      interval: 1,
      interval_unit: "months",
    },
    {
      id: 3,
      name: "Water Plants",
      icon: "watering-can",
      interval: 1,
      interval_unit: "months",
    },
  ];
  const renderItem = ({ item }) => (
    <View
      style={{ flex: 1, maxWidth: "33.3%", alignItems: "stretch" }}
      className="p-2"
    >
      <Pressable
        onPress={() => alert("Edit " + item.name)}
        onLongPress={() => alert("Complete " + item.name)}
        className="flex-1 border border-gray-300 rounded shadow bg-white p-4 flex items-center justify-center"
      >
        <View className="w-16 h-16 rounded-full bg-gray-200"></View>
        <Text className="text-black mt-2">{item.name}</Text>
      </Pressable>
    </View>
  );
  const keyExtractor = (item: Chore) => item.id;

  return (
    <View className="flex-row flex-wrap flex-3 mx-auto items-center p-2">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        className="h-screen w-screen"
        numColumns={3}
      />
    </View>
  );
}
