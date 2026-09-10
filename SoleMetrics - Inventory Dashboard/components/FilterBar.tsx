import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface FilterBarProps {
  selected: "week" | "month" | "year";
  onSelect: (range: "week" | "month" | "year") => void;
}

export default function FilterBar({ selected, onSelect }: FilterBarProps) {
  const options: Array<"week" | "month" | "year"> = ["week", "month", "year"];
  
  return (
    <View style={styles.container}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[styles.button, selected === option && styles.buttonActive]}
          onPress={() => onSelect(option)}
        >
          <Text style={[styles.text, selected === option && styles.textActive]}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f0f1f5",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },
  textActive: {
    color: "#1a1a2e",
  },
});
