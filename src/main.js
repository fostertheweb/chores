import { registerRootComponent } from "expo";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const ChoresScreen = () => (
  <View className="flex-1 items-center justify-center">
    <Text>Chores</Text>
  </View>
);

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Chores" component={ChoresScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
