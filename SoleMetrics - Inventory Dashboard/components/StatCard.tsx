import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: "dollar-sign" | "package" | "archive" | "star" | "trending-up" | "shopping-bag" | "box" | "activity";
  onPress?: () => void;
  active?: boolean;
}

export default function StatCard({ label, value, trend, trendUp, icon, onPress, active }: StatCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.card, active && styles.cardActive]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
            <Feather name={icon} size={18} color={active ? "#fff" : "#1a1a2e"} />
          </View>
        )}
        {trend && (
          <View style={[styles.trendBadge, trendUp ? styles.trendUp : styles.trendDown]}>
            <Feather 
              name={trendUp ? "trending-up" : "trending-down"} 
              size={10} 
              color={trendUp ? "#27ae60" : "#e74c3c"} 
              style={{ marginRight: 3 }}
            />
            <Text style={[styles.trendText, trendUp ? styles.trendTextUp : styles.trendTextDown]}>
              {trend}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.value, active && styles.valueActive]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "47%",
    margin: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardActive: {
    borderColor: "#1a1a2e",
    backgroundColor: "#f8f9fc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f0f1f5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerActive: {
    backgroundColor: "#1a1a2e",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendUp: {
    backgroundColor: "#e8f8ef",
  },
  trendDown: {
    backgroundColor: "#fef2f2",
  },
  trendText: {
    fontSize: 11,
    fontWeight: "700",
  },
  trendTextUp: {
    color: "#27ae60",
  },
  trendTextDown: {
    color: "#e74c3c",
  },
  value: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  valueActive: {
    color: "#3498db",
  },
  label: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
});
