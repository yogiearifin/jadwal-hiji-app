import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.safe}>
      <View>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to The Benji&apos;s Network</Text>
          <Text style={styles.subtitle}>What do you need, Boss?</Text>
        </View>
        <View style={styles.containerItem}>
          <Link
            href={{
              pathname: "/regionList",
            }}
          >
            <View style={styles.item}>
              <Image
                source={{
                  uri: "https://static.wikia.nocookie.net/schedule-1/images/4/43/Region_Northtown.png",
                }}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text style={styles.title}>Region</Text>
            </View>
          </Link>
          <Link
            href={{
              pathname: "/customerList",
            }}
          >
            <View style={styles.item}>
              <Image
                source={{
                  uri: "https://static.wikia.nocookie.net/schedule-1/images/f/fa/Jessi_Mugshot.png",
                }}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text style={styles.title}>Customer</Text>
            </View>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    gap: 12,
    padding: 12,
  },
  item: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 15,
    padding: 12,
  },
  image: {
    width: 75,
    height: 75,
  },
  name: {
    textAlign: "center",
    fontWeight: 600,
    color: "white",
    paddingVertical: 8,
  },
  title: {
    fontWeight: "600",
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  containerItem: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    padding: 12,
  },
});
