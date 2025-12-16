import { BASE_URL } from "@/constant";
import {
  calculateBudgetByRank,
  capitalize,
  determineProductQuality,
} from "@/helper";
import { ICustomer, IRanks } from "@/interface/customer";
import { IRegion } from "@/interface/region";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SelectList } from "react-native-select-bottom-list";

const RegionDetail = () => {
  const [detail, setDetail] = useState<IRegion>();
  const [loading, setLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedRank, setSelectedRank] =
    useState<Omit<IRanks, "id" | "created_at">>();
  const [ranks, setRanks] = useState<IRanks[]>([]);
  const navigation = useNavigation<any>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getUserDetail = useCallback(async () => {
    navigation.setOptions({
      title: "Loading...",
    });
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/regions/${id}`);
      if (!response.ok) {
        throw new Error(`error: ${response.status}`);
      }
      const data = await response.json();
      setDetail(data);
      setLoading(false);
      navigation.setOptions({
        title: capitalize(data.region_name),
        headerLeft: () => (
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : navigation.navigate("index")
            }
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="arrow-back" size={24} />
          </Pressable>
        ),
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [id, navigation]);
  useEffect(() => {
    if (!id) return;
    getUserDetail();
  }, [getUserDetail, id]);

  const getListCustomers = useCallback(async (region: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/customers?region=${region}`);
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

  useEffect(() => {
    if (detail) {
      getListCustomers(detail.region_name);
    }
  }, [detail, getListCustomers]);

  const getPlayerRank = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/ranks`);
      if (!response.ok) {
        throw new Error(`error: ${response.status}`);
      }
      const data = await response.json();
      setRanks(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getPlayerRank();
  }, [getPlayerRank]);
  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ flex: 1, marginVertical: 20 }}
        />
      ) : (
        detail && (
          <View style={styles.container}>
            <Image
              source={{ uri: detail.image_url }}
              style={{
                width: 300,
                height: 200,
              }}
              contentFit="contain"
            />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                gap: 4,
                paddingVertical: 8,
              }}
            >
              <Text style={{ textTransform: "capitalize" }}>
                Name: {detail.region_name}
              </Text>
              <Text>Dealer: {detail.region_dealer}</Text>
              <Text>Supplier: {detail.region_supplier ?? "-"}</Text>
              <Text
                style={{
                  textTransform: "capitalize",
                }}
              >
                Standard:{" "}
                <Text
                  style={{
                    color: determineProductQuality(detail.product_standard)
                      ?.color,
                  }}
                >
                  ★ {determineProductQuality(detail.product_standard)?.name}
                </Text>
              </Text>
            </View>
            <Text style={{ marginVertical: 8, fontWeight: 600 }}>
              Player Rank
            </Text>
            <View>
              <SelectList
                onSelect={(item, index) => {
                  setSelectedRank({
                    rank_name: item,
                    rank: typeof index === "number" ? index + 1 : 0,
                  });
                }}
                value={selectedRank?.rank_name ?? ""}
                data={ranks?.map((item) => item.rank_name)}
                headerTitle="Select Your Rank"
                placeHolder="Select your rank"
              />
            </View>
            <View style={styles.calculateBudgetContainer}>
              <Text
                style={{
                  marginBottom: 8,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                Customer List
              </Text>
              <View style={{ gap: 12 }}>
                {customers &&
                  customers.map((item) => (
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
                          style={{
                            width: 100,
                            height: 100,
                          }}
                        />
                        <Text>Name: {item.name}</Text>
                        <Text>Base Budget: {item.base_budget}</Text>
                        {selectedRank?.rank && (
                          <Text style={{ fontWeight: 600 }}>
                            Budget per deal:{" "}
                            {calculateBudgetByRank(
                              item.base_budget,
                              selectedRank?.rank,
                              item.max_budget
                            )}
                          </Text>
                        )}
                      </View>
                    </Link>
                  ))}
              </View>
            </View>
          </View>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  product: {
    textTransform: "capitalize",
    fontWeight: 600,
  },
  topSpender: {
    fontWeight: 600,
    color: "green",
    textAlign: "center",
  },
  hateProduct: {
    fontWeight: 600,
    color: "red",
    fontSize: 12,
    textAlign: "center",
  },
  calculateBudgetContainer: {
    marginVertical: 8,
  },
  item: {
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 15,
    padding: 12,
    color: "white",
    gap: 12,
  },
});

export default RegionDetail;
