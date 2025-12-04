import { BASE_URL } from "@/constant";
import { calculateBudgetByRank, determineProductQuality } from "@/helper";
import { ICustomer, IRanks } from "@/interface/customer";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-select-bottom-list";

const CustomerDetail = () => {
  const [detail, setDetail] = useState<ICustomer>();
  const navigation = useNavigation<any>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ranks, setRanks] = useState<IRanks[]>([]);
  const [selectedRank, setSelectedRank] =
    useState<Omit<IRanks, "id" | "created_at">>();
  console.log("select", selectedRank);
  const getUserDetail = useCallback(async () => {
    navigation.setOptions({
      title: "Loading...",
    });
    try {
      const response = await fetch(`${BASE_URL}/customers/${id}`);
      if (!response.ok) {
        throw new Error(`error: ${response.status}`);
      }
      const data = await response.json();
      setDetail(data);
      navigation.setOptions({
        title: data.name,
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.navigate("index")}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="arrow-back" size={24} />
          </Pressable>
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }, [id, navigation]);
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
    if (!id) return;
    getUserDetail();
  }, [getUserDetail, id]);

  useEffect(() => {
    getPlayerRank();
  }, [getPlayerRank]);
  return (
    <View>
      {detail && (
        <View style={styles.container}>
          {detail.is_top_spender && (
            <Text style={styles.topSpender}>
              $ This customer is one of the top spender in their region
            </Text>
          )}
          {detail.has_low_product_affinity && (
            <Text style={styles.hateProduct}>
              👎 This customer has low product affinity. {"\n"} They have a
              lower chance to accept your free sample.
            </Text>
          )}
          <Image
            source={{ uri: detail.img_url }}
            style={{
              width: 200,
              height: 200,
            }}
          />
          <View>
            <Text>Name: {detail.name}</Text>
            <Text>Region: {detail.region}</Text>
            <Text>Base Budget: {detail.base_budget}</Text>
            <Text>
              Favorite Product:{" "}
              <Text style={styles.product}>{detail.preferred_products}</Text>
            </Text>
            <Text>
              Hated Product:{" "}
              <Text style={[styles.product, { color: "red" }]}>
                {detail.hated_products}
              </Text>
            </Text>
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
            {detail.trivia.length ? (
              <View style={{ paddingVertical: 4 }}>
                <Text>Trivia</Text>
                <View>
                  {detail.trivia.map((item) => (
                    <Text key={item}>-{item}</Text>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
          <View style={styles.calculateBudgetContainer}>
            <Text>
              Calculate this customer&#39;s budget per deal by player ranks.
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
              {selectedRank?.rank && (
                <Text style={{ marginTop: 12 }}>
                  Budget per deal:{" "}
                  <Text style={{ fontWeight: 600 }}>
                    {calculateBudgetByRank(
                      detail.base_budget,
                      selectedRank?.rank,
                      detail.max_budget
                    )}
                  </Text>
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
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
    fontSize: 12,
    textAlign: "center",
  },
  hateProduct: {
    fontWeight: 600,
    color: "red",
    fontSize: 12,
    textAlign: "center",
  },
  calculateBudgetContainer: {
    marginTop: 12,
    gap: 12,
  },
});

export default CustomerDetail;
