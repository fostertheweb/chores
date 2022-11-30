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
import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";

import IconSearch from "./IconSearch";
import ChoreCard from "../components/ChoreCard";
import { Chore } from "../types/Chores";
import IconsIcon from "../components/IconsIcon";

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
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <View className="p-8 flex items-center">
      <Pressable onPress={() => setIconSearchOpen(true)}>
        <View className="flex items-center justify-center w-28 h-28 bg-white border-2 border-gray-200 rounded-full">
          {icon ? (
            <Image
              style={{ height: 64, width: 64 }}
              source={{ uri: icon.images["64"] }}
            />
          ) : (
            <View className="h-28 w-28 flex items-center justify-center">
              <IconsIcon />
              <Text className="mt-2 font-semibold text-gray-400 text-xs">
                Choose Icon
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      <View className="w-full">
        <Text className="text-xl mt-6">What are you doing?</Text>
        <Controller
          name="description"
          control={control}
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              className="w-full py-2 text-xl border-b-2 border-gray-200"
              placeholder="Chore Description"
              onChangeText={(text) => onChange(text)}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        <Text className="text-xl mt-6">How often?</Text>
        <View className="flex flex-row items-center">
          <Text className="mr-2 text-xl">Every</Text>
          <Controller
            name="interval"
            control={control}
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                className="py-2 text-xl mr-2 border-b-2 border-gray-200"
                placeholder="Number"
                onChangeText={(text) => onChange(text)}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            name="interval_unit"
            control={control}
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                onBlur={onBlur}
                style={{ height: 48, width: 150 }}
                itemStyle={{ height: 48, fontSize: 18 }}
              >
                <Picker.Item label="days" value="day" />
                <Picker.Item label="weeks" value="week" />
                <Picker.Item label="months" value="month" />
              </Picker>
            )}
          />
        </View>
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
