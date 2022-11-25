import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  View,
  Text,
  TextInput,
} from "react-native";
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

// TODO: smaller page size
async function getIconSearchResults(q: string) {
  const storedData = await AsyncStorage.getItem("@icon_access");
  const { token } = JSON.parse(storedData);
  const url = `https://api.flaticon.com/v3/search/icons/priority?q=${q}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return await response.json();
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
  const [query, setQuery] = useState();
  const { mutate: getToken } = useMutation(getIconAccessToken, {
    async onSuccess({ data }) {
      await storeIconAccess(data);
    },
  });
  const {
    mutate: search,
    data: results,
    isLoading,
  } = useMutation(getIconSearchResults);

  function handleTextChange(q: string) {
    search(q);
  }

  useEffect(() => {
    getToken();
  }, []);

  const keyExtractor = (item) => item.id;
  const renderItem = ({ item }) => {
    // TODO: responsize gaps
    return (
      <Pressable
        onPress={() => alert("Select " + item.description)}
        className="p-3"
      >
        <Image
          style={{ height: 64, width: 64 }}
          source={{ uri: item.images["64"] }}
        />
      </Pressable>
    );
  };

  // TODO: Search button on keyboard, dismisses on submit
  return (
    <View className="p-4 flex-1 items-center">
      <TextInput
        className="bg-white rounded w-full p-4 border-b border-gray-400"
        onChangeText={handleTextChange}
        placeholder="Search for Icon"
        value={query}
      />
      <View>
        {isLoading && <Text>Loading...</Text>}
        {results && (
          <FlatList
            data={results.data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={4}
            contentContainerStyle={{
              display: "flex",
              alignItems: "center",
            }}
            className="mt-4 h-screen w-screen"
          />
        )}
      </View>
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
