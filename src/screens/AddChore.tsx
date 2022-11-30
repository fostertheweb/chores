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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import IconSearch from "./IconSearch";
import ChoreCard from "../components/ChoreCard";
import { Chore } from "../types/Chores";
import { Controller, useForm } from "react-hook-form";

export default function AddChoreScreen({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      icon: "",
      description: "",
      interval: 1,
      interval_unit: "week",
    },
  });

  const queryClient = useQueryClient();
  const { mutate: addChore } = useMutation(storeChore, {
    onSuccess(chore) {
      queryClient.setQueryData(["chores"], (chores) => [...chores, chore]);
    },
  });

  const [isIconSearchOpen, setIconSearchOpen] = useState(false);
  const [icon, setSelectedIcon] = useState();

  useEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <Button title="Done" color="#000" onPress={handleSubmit(onSubmit)} />
        );
      },
    });
  }, [onSubmit]);

  function onSubmit(data) {
    console.log(data);
    // addChore({ id: uuid.v4(), ...chore });
    // navigation.navigate("Chores");
  }

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

      <View>
        <Text>What are you doing?</Text>
        <Controller
          name="description"
          control={control}
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              className="mt-4 w-full p-2 text-center text-3xl border-b-2 border-gray-200"
              placeholder="Chore Description"
              onChangeText={(text) => onChange(text)}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        <Text>How often?</Text>
        <Controller
          name="interval"
          control={control}
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              className="mt-4 w-full p-2 text-center text-3xl border-b-2 border-gray-200"
              placeholder="Number"
              onChangeText={(text) => onChange(text)}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        <Text>{JSON.stringify(errors)}</Text>
      </View>

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
  const chores = await getChores();
  const updated = [...chores, data];
  await AsyncStorage.setItem("@chores", JSON.stringify(updated));
  return data;
}
