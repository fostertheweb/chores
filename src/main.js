import { registerRootComponent } from "expo";
import { Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ChoresScreen from "./screens/Chores";
import AddChoreScreen from "./screens/AddChore";
import ViewChoreScreen from "./screens/ViewChore";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Chores"
            component={ChoresScreen}
            options={({ navigation }) => ({
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate("Add Chore")}
                  title="Add"
                  color="#000"
                />
              ),
            })}
          />
          <Stack.Screen name="Add Chore" component={AddChoreScreen} />
          <Stack.Screen name="View Chore" component={ViewChoreScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

registerRootComponent(App);
