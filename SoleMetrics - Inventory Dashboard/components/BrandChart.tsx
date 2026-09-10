import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Shoe } from "../types/Shoe";

const COLORS = ["#3498db", "#1a1a2e", "#27ae60", "#f39c12", "#e74c3c"];

export default function BrandChart({ shoes }: { shoes: Shoe[] }) {
  const brands = [...new Set(shoes.map(s => s.brand))];
  
  const data = brands.map((brand, index) => {
    const sales = shoes
      .filter(s => s.brand === brand)
      .reduce((sum, s) => sum + s.salesCount, 0);
    return { brand, sales, color: COLORS[index % COLORS.length] };
  });

  const maxSales = Math.max(...data.map(d => d.sales));

  return (
    <View style={styles.container}>
      {data.map(item => (
        <View key={item.brand} style={styles.row}>
          <Text style={styles.label}>{item.brand}</Text>
          <View style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { 
                  width: `${(item.sales / maxSales) * 100}%`,
                  backgroundColor: item.color 
                }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    color: "#666",
    width: 55,
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: "#f0f1f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 8,
  },
});
