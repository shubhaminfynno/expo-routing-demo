import { useColorScheme } from "@/hooks/use-color-scheme";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       // minimizeBehavior="onScrollDown"
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//       }}
//     >

//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="house.fill" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="game"
//         options={{
//           title: "Games",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="gamecontroller.fill" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="anime"
//         options={{
//           title: "Anime",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="film.fill" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="stats"
//         options={{
//           title: "Stats",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="chart.bar.fill" color={color} />
//           ),
//         }}
//       />
//       {/* <Tabs.Screen
//         name="graphqlZero"
//         options={{
//           title: "GraphQL",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="square.and.pencil" color={color} />
//           ),
//         }}
//       /> */}
//       {/* <Tabs.Screen
//         name="account"
//         options={{
//           title: "Account",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="person.fill" color={color} />
//           ),
//         }}
//       /> */}
//     </Tabs>
//   );
// }

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      // screenOptions={{
      //   tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      //   headerShown: false,
      //   tabBarButton: HapticTab,
      // }}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: "house", selected: "house.fill" }} />{" "}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="game">
        <Label>Games</Label>
        <Icon sf="gamecontroller.fill" drawable="ic_menu_compass" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="anime">
        <Label>Anime</Label>
        <Icon sf="film.fill" drawable="ic_menu_slideshow" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stats">
        <Label>Stats</Label>
        <Icon sf="chart.bar.fill" drawable="ic_menu_sort_by_size" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="account">
        <Label>Account</Label>
        <Icon sf="person.fill" drawable="ic_menu_myplaces" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
