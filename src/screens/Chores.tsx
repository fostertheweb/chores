import { FlatList, Text, View } from "react-native";
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
  ];
  const renderItem = ({ item }) => (
    <View className="w-1/3 border-2 border-green-300">
      <Text className="text-black">{item.name}</Text>
    </View>
  );
  const keyExtractor = (item: Chore) => item.id;

  return (
    <View className="p-4">
      <FlatList
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={3}
      />
    </View>
  );
}
