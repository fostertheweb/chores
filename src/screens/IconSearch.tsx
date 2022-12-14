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
import Constants from "expo-constants";
import { useMutation } from "@tanstack/react-query";

const apikey = Constants.expoConfig.extra.flaticonApiKey;

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
      body: JSON.stringify({ apikey }),
    }
  );

  return await response.json();
}

export default function IconSearch({ onSubmit }) {
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

  function handleSubmit(e) {
    search(e.nativeEvent.text);
  }

  useEffect(() => {
    getToken();
  }, []);

  const keyExtractor = (item) => item.id;
  const renderItem = ({ item }) => {
    // TODO: responsize gaps
    return (
      <Pressable
        onPress={() => onSubmit(item)}
        className="p-4"
        style={{
          flex: 1,
          maxWidth: "25%",
          alignItems: "center",
        }}
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
    <View className="flex-1 items-center">
      <View className="p-4 w-screen">
        <TextInput
          className="bg-gray-100 rounded w-full p-4 border-b border-gray-400"
          onSubmitEditing={handleSubmit}
          placeholder="Search for Icon"
          value={query}
        />
      </View>
      <View className="w-screen flex-row flex-wrap flex-1 items-start mx-auto">
        {isLoading && <SkeletonIconList />}
        {results && (
          <FlatList
            data={results.data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={4}
          />
        )}
        {!results && !isLoading && (
          <View className="flex-1 items-center justify-center h-full">
            <Text>No Results</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function SkeletonIconList() {
  const data = new Array(30).fill(0);
  const keyExtractor = (_, index) => index;
  const renderItem = () => (
    <View
      className="p-4"
      style={{
        flex: 1,
        maxWidth: "25%",
        alignItems: "center",
      }}
    >
      <View
        style={{ height: 64, width: 64 }}
        className="bg-gray-100 rounded-full"
      ></View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={4}
    />
  );
}
