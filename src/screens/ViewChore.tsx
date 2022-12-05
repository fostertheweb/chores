import { useEffect } from "react";
import { Image, Pressable, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

import type { Chore } from "../types/Chores";
import { DateTime } from "luxon";
import { useFocusEffect } from "@react-navigation/native";

export default function ViewChoreScreen({ route, navigation }) {
  const chore = JSON.parse(route.params.chore);

  useEffect(() => {
    navigation.setOptions({
      title: chore.description,
    });
  }, [chore]);

  return (
    <View className="p-8 flex items-center">
      <View className="flex items-center justify-center w-28 h-28 bg-white border-2 border-gray-200 rounded-full">
        <Image style={{ height: 64, width: 64 }} source={{ uri: chore.icon }} />
      </View>

      <View className="w-full">
        <Text className="text-2xl mt-6 font-medium">Schedule</Text>

        <View className="mt-2 flex flex-row items-center">
          <Text className="mr-2 text-xl text-gray-700">every</Text>
          <Text className="mr-2 text-xl text-black font-medium">
            {chore.interval}
          </Text>
          <Text className="mr-2 text-xl text-gray-700">
            {chore.interval_unit}s
          </Text>
        </View>
      </View>

      {chore.last_completed_at ? (
        <View className="px-8 mt-6 flex flex-row justify-start w-screen items-center">
          <Text>
            Last completed{" "}
            {DateTime.fromMillis(chore.last_completed_at).toRelative()}
          </Text>
        </View>
      ) : null}

      <View className="w-screen px-6 mt-6">
        <Pressable
          onPress={() => console.log("Completed")}
          className="bg-black flex items-center justify-center text-white rounded w-full p-4"
        >
          <Text className="text-white text-xl tracking-wide font-medium">
            Complete Chore
          </Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
