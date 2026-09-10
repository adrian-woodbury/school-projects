import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Shoe } from "../types/Shoe";

const COLORS = ["#1a1a2e", "#3498db", "#27ae60", "#f39c12", "#e74c3c", "#9b59b6"];

export default function CategoryChart({ shoes }: { shoes: Shoe[] }) {
  const categories = [...new Set(shoes.map(s => s.category))];
  
  const data = categories.map((category, index) => {
    const sales = shoes
      .filter(s => s.category === category)
      .reduce((sum, s) => sum + s.salesCount, 0);
    return { category, sales, color: COLORS[index % COLORS.length] };
  });

  const total = data.reduce((sum, d) => sum + d.sales, 0);

  return (
    <View style={styles.container}>
      <View style={styles.donut}>
        {data.map((item, index) => {
          const percentage = (item.sales / total) * 100;
          const rotation = data.slice(0, index).reduce((sum, d) => sum + (d.sales / total) * 360, 0);
          return (
            <View
              key={item.category}
              style={[
                styles.segment,
                {
                  backgroundColor: item.color,
                  transform: [{ rotate: `${rotation}deg` }],
                  opacity: percentage / 100 + 0.3,
                },
              ]}
            />
          );
        })}
        <View style={styles.innerCircle} />
      </View>
      <View style={styles.legend}>
        {data.slice(0, 3).map(item => (
          <View key={item.category} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.category}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
  },
  donut: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f1f5",
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  segment: {
    position: "absolute",
    width: 50,
    height: 100,
    left: 50,
    transformOrigin: "left center",
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    position: "absolute",
  },
  legend: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
    marginVertical: 2,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: "#666",
  },
});
