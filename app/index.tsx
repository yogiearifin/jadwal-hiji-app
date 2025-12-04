import { BASE_URL } from "@/constant";
import { determineProductQuality } from "@/helper";
import { ICustomer } from "@/interface/customer";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const getListCustomers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/customers`);
      if (!response.ok) {
        throw new Error(`error: ${response.status}`);
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  useEffect(() => {
    getListCustomers();
  }, []);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <View style={styles.container}>
          {customers &&
            customers?.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      determineProductQuality(item.product_standard)?.color ??
                      "gray",
                  },
                ]}
              >
                <Link
                  href={{
                    pathname: "/customerdetail/[id]",
                    params: { id: item.id },
                  }}
                >
                  <Image source={{ uri: item.img_url }} style={styles.image} />
                </Link>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    padding: 12,
  },
  item: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 15,
    padding: 8,
  },
  image: {
    width: 75,
    height: 75,
  },
  name: { textAlign: "center", fontWeight: 600, color: "white" },
});
