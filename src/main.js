import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

function App() {
  return (
    <View className="flex-1 items-center justify-center bg-green-300">
      <Text className="text-xl text-green-900 font-bold">
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

registerRootComponent(App);
