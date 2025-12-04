import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        title: "The Benji's Network",
      }}
    >
      <Stack.Screen name="customerdetail" />
    </Stack>
  );
}
