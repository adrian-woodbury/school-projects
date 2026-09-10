import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Shoe } from "../types/Shoe";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface SalesChartProps {
  shoe: Shoe;
  allShoes: Shoe[];
}

export default function SalesChart({ shoe, allShoes }: SalesChartProps) {
  const totalMonthlySales = months.map((_, index) =>
    allShoes.reduce((sum, s) => sum + s.monthlySales[index], 0)
  );
  
  const maxValue = Math.max(...totalMonthlySales);
  const width = Dimensions.get("window").width - 80;
  const barWidth = (width - 48) / 12;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {totalMonthlySales.map((value, index) => {
          const height = (value / maxValue) * 140;
          const selectedHeight = (shoe.monthlySales[index] / maxValue) * 140;
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, { height, backgroundColor: "#1a1a2e" }]} />
                <View style={[styles.barOverlay, { height: selectedHeight, backgroundColor: "#3498db" }]} />
              </View>
              <Text style={styles.label}>{months[index].slice(0, 1)}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#1a1a2e" }]} />
          <Text style={styles.legendText}>Total Sales</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#3498db" }]} />
          <Text style={styles.legendText}>{shoe.name}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 160,
    paddingHorizontal: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    width: 20,
    height: 140,
    justifyContent: "flex-end",
    position: "relative",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
  },
  barOverlay: {
    width: "100%",
    borderRadius: 4,
    position: "absolute",
    bottom: 0,
    opacity: 0.8,
  },
  label: {
    fontSize: 10,
    color: "#888",
    marginTop: 6,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
});
