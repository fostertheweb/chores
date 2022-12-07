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
import Checkbox from "expo-checkbox";
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
import { DateTime } from "luxon";

export default function AddChoreScreen({ navigation }) {
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      icon: "",
      description: "",
      interval: "1",
      interval_unit: "day",
      last_completed_at: null,
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
  const [completed, setCompleted] = useState(false);

  function onSubmit(chore) {
    addChore({ id: uuid.v4(), ...chore });
    navigation.navigate("Chores");
  }

  function handleIconSelection(icon) {
    setValue("icon", icon.images["64"]);
    setSelectedIcon(icon);
    setIconSearchOpen(false);
  }

  function handleMarkAsComplete(checked: boolean) {
    setCompleted(checked);

    if (checked) {
      setValue("last_completed_at", Date.now());
    }

    setValue("last_completed_at", null);
  }

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
        <Text className="text-2xl mt-6 font-medium">What</Text>
        <Controller
          name="description"
          control={control}
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <View className="mt-2">
              <TextInput
                className="p-2 w-full text-xl border-b-2 bg-white rounded border-gray-300"
                placeholder="Description"
                onChangeText={(text) => onChange(text)}
                onBlur={onBlur}
                value={value}
              />
            </View>
          )}
        />

        <Text className="text-2xl mt-6 font-medium">Schedule</Text>
        <View className="mt-2 flex flex-row items-center">
          <Text className="mr-3 text-xl text-gray-700">every</Text>
          <Controller
            name="interval"
            control={control}
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <View className="mr-2 w-14">
                <TextInput
                  className="p-2 text-center text-xl border-b-2 bg-white rounded border-gray-300"
                  placeholder="1"
                  keyboardType="numeric"
                  clearTextOnFocus={true}
                  onChangeText={(text) => onChange(text)}
                  onBlur={onBlur}
                  value={value}
                />
              </View>
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

      <View className="px-8 py-6 flex flex-row justify-start w-screen items-center">
        <Checkbox
          value={completed}
          onValueChange={handleMarkAsComplete}
          className="mr-3"
        />
        <Pressable onPress={() => handleMarkAsComplete(!completed)}>
          <Text className="text-xl text-gray-600 ">Mark as completed now</Text>
        </Pressable>
      </View>

      <View className="w-screen px-6">
        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="bg-black flex items-center justify-center text-white rounded w-full p-4"
        >
          <Text className="text-white text-xl tracking-wide font-medium">
            Add Chore
          </Text>
        </Pressable>
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
