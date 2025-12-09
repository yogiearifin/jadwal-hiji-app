import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        title: "The Benji's Network",
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="customerdetail" />
    </Stack>
  );
}
