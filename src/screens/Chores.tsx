import { FlatList, Pressable, Text, View } from "react-native";
import { Chore } from "./CreateChore";

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
    <Pressable
      onPress={() => alert("Edit " + item.name)}
      onLongPress={() => alert("Complete " + item.name)}
      style={{ margin: 8 }}
      className="flex-1 border border-gray-300 rounded shadow bg-white p-4 flex items-center justify-center"
    >
      <View className="w-16 h-16 rounded-full bg-gray-200"></View>
      <Text className="text-black mt-2">{item.name}</Text>
    </Pressable>
  );
  const keyExtractor = (item: Chore) => item.id;

  return (
    <View className="">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={3}
        className="p-2 h-screen w-screen"
      />
    </View>
  );
}
