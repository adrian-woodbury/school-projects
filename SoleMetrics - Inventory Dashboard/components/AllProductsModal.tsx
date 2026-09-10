import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Shoe } from "../types/Shoe";

interface AllProductsModalProps {
  visible: boolean;
  shoes: Shoe[];
  onClose: () => void;
  onSelect: (shoe: Shoe) => void;
}

export default function AllProductsModal({ visible, shoes, onClose, onSelect }: AllProductsModalProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"sales" | "price" | "stock" | "rating">("sales");

  const filteredShoes = shoes
    .filter(shoe => 
      shoe.name.toLowerCase().includes(search.toLowerCase()) ||
      shoe.brand.toLowerCase().includes(search.toLowerCase()) ||
      shoe.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "sales": return b.salesCount - a.salesCount;
        case "price": return b.price - a.price;
        case "stock": return b.stock - a.stock;
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });

  const SortButton = ({ value, label }: { value: typeof sortBy; label: string }) => (
    <TouchableOpacity
      style={[styles.sortBtn, sortBy === value && styles.sortBtnActive]}
      onPress={() => setSortBy(value)}
    >
      <Text style={[styles.sortBtnText, sortBy === value && styles.sortBtnTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>All Products</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Sort */}
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <SortButton value="sales" label="Sales" />
            <SortButton value="price" label="Price" />
            <SortButton value="stock" label="Stock" />
            <SortButton value="rating" label="Rating" />
          </View>

          {/* List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {filteredShoes.map((shoe, index) => (
              <TouchableOpacity
                key={shoe.id}
                style={styles.productRow}
                onPress={() => onSelect(shoe)}
                activeOpacity={0.6}
              >
                <View style={styles.rank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{shoe.name}</Text>
                  <Text style={styles.productMeta}>
                    {shoe.brand} · {shoe.category} · {shoe.color}
                  </Text>
                </View>
                <View style={styles.productStats}>
                  <Text style={styles.productPrice}>${shoe.price}</Text>
                  <Text style={styles.productSales}>{shoe.salesCount.toLocaleString()} sold</Text>
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f1f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f1f5",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 18,
    color: "#666",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: "#f8f9fc",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1a1a2e",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sortLabel: {
    fontSize: 13,
    color: "#888",
    marginRight: 10,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: "#f0f1f5",
  },
  sortBtnActive: {
    backgroundColor: "#1a1a2e",
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  sortBtnTextActive: {
    color: "#fff",
  },
  list: {
    paddingHorizontal: 20,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f1f5",
  },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f0f1f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  productMeta: {
    fontSize: 12,
    color: "#888",
  },
  productStats: {
    alignItems: "flex-end",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  productSales: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
});
