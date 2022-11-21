import { useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";

async function storeIconAccess(data) {
  try {
    const json = JSON.stringify(data);
    await AsyncStorage.setItem("@icon_access", json);
  } catch (err) {
    console.log(err);
  }
}

async function getIconAccessToken() {
  const response = await fetch(
    "https://api.flaticon.com/v3/app/authentication",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: "",
      }),
    }
  );

  return await response.json();
}

export default function AddChoreScreen() {
  const { mutate, data } = useMutation(getIconAccessToken, {
    async onSuccess({ data }) {
      await storeIconAccess(data);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Create Chore</Text>
    </View>
  );
}

export type Chore = {
  id: string;
  name: string;
  icon: string;
  interval: number;
  interval_unit: "days" | "weeks" | "months";
  last_completed_at?: DateTime;
};
