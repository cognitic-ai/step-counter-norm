import { ThemeProvider } from "@/components/theme-provider";
import Stack from "expo-router/stack";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Step Counter",
            headerLargeTitle: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
