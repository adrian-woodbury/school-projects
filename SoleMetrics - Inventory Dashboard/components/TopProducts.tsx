import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Shoe } from "../types/Shoe";

interface TopProductsProps {
  shoes: Shoe[];
  onSelect: (shoe: Shoe) => void;
  selected: Shoe;
}

export default function TopProducts({ shoes, onSelect, selected }: TopProductsProps) {
  const sorted = [...shoes].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

  return (
    <View>
      {sorted.map((shoe, index) => {
        const isSelected = selected.id === shoe.id;
        return (
          <TouchableOpacity
            key={shoe.id}
            style={[styles.row, isSelected && styles.selectedRow]}
            onPress={() => onSelect(shoe)}
            activeOpacity={0.7}
          >
            <View style={styles.rank}>
              <Text style={[styles.rankText, index < 3 && styles.topRank]}>
                {index + 1}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{shoe.name}</Text>
              <View style={styles.tags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{shoe.brand}</Text>
                </View>
                <View style={[styles.tag, styles.tagCategory]}>
                  <Text style={styles.tagText}>{shoe.category}</Text>
                </View>
              </View>
            </View>
            <View style={styles.stats}>
              <Text style={styles.sales}>{shoe.salesCount.toLocaleString()}</Text>
              <Text style={styles.salesLabel}>sold</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  selectedRow: {
    backgroundColor: "#f0f4ff",
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#f0f1f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  rankText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
  },
  topRank: {
    color: "#1a1a2e",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 6,
  },
  tags: {
    flexDirection: "row",
  },
  tag: {
    backgroundColor: "#f0f1f5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
  },
  tagCategory: {
    backgroundColor: "#e8f4fc",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  stats: {
    alignItems: "flex-end",
  },
  sales: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  salesLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
});
