import { registerRootComponent } from "expo";
import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChoresScreen from "./screens/Chores";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Chores"
          component={ChoresScreen}
          options={{
            headerRight: () => (
              <Button
                onPress={() => alert("This is a button!")}
                title="Add"
                color="#000"
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
