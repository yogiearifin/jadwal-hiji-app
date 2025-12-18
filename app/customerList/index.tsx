import { BASE_URL } from "@/constant";
import { determineProductQuality } from "@/helper";
import { ICustomer } from "@/interface/customer";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEvent,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const navigation = useNavigation<any>();

  const getListCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/customers`);
      if (!response.ok) {
        throw new Error(`error: ${response.status}`);
      }
      const data = await response.json();
      navigation.setOptions({
        title: "Customer List",
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.navigate("index")}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="arrow-back" size={24} />
          </Pressable>
        ),
      });
      setCustomers(data);
      setLoading(false);
    } catch (error: any) {
      console.error(error?.message);
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    getListCustomers();
  }, [getListCustomers]);

  const searchCustomers = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/customers${name ? `?name=${name}` : ""}`
      );
      if (!response.ok) {
        throw new Error(`error: ${response.status}`);
      }
      const data = await response.json();
      setCustomers(data);
      setLoading(false);
    } catch (error: any) {
      console.error(error?.message);
      setLoading(false);
    }
  }, []);

  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const onChangeSearch = async (e: TextInputChangeEvent) => {
    const value = e.nativeEvent.text;
    setSearch(value);
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(() => {
      searchCustomers(value);
    }, 700) as unknown as NodeJS.Timeout;
  };
  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ flex: 1, marginVertical: 20 }}
        />
      ) : (
        <ScrollView>
          <View style={styles.containerSearch}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search customers by name"
              onChange={(e) => onChangeSearch(e)}
              value={search}
            />
          </View>
          <View style={styles.container}>
            {customers &&
              customers?.map((item) => (
                <Link
                  key={item.id}
                  href={{
                    pathname: "/customerdetail/[id]",
                    params: { id: item.id },
                  }}
                >
                  <View
                    style={[
                      styles.item,
                      {
                        backgroundColor:
                          determineProductQuality(item.product_standard)
                            ?.color ?? "gray",
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: item.img_url }}
                      style={styles.image}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                </Link>
              ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  containerSearch: {
    padding: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
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
});
