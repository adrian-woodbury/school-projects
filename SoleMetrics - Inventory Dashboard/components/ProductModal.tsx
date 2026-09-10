import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { Shoe } from "../types/Shoe";

interface ProductModalProps {
  visible: boolean;
  shoe: Shoe;
  onClose: () => void;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ProductModal({ visible, shoe, onClose }: ProductModalProps) {
  const totalSales = shoe.monthlySales.reduce((a, b) => a + b, 0);
  const avgMonthlySales = Math.round(totalSales / 12);
  const revenue = shoe.price * shoe.salesCount;
  const maxMonthSales = Math.max(...shoe.monthlySales);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{shoe.name}</Text>
              <Text style={styles.subtitle}>{shoe.brand} · {shoe.category}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>${shoe.price}</Text>
                <Text style={styles.statLabel}>Price</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{shoe.stock}</Text>
                <Text style={styles.statLabel}>In Stock</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{shoe.rating}⭐</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{shoe.salesCount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Sold</Text>
              </View>
            </View>

            {/* Revenue */}
            <View style={styles.revenueCard}>
              <Text style={styles.revenueLabel}>Total Revenue</Text>
              <Text style={styles.revenueValue}>${(revenue / 1000).toFixed(1)}K</Text>
            </View>

            {/* Monthly Sales Chart */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Monthly Sales</Text>
              <View style={styles.chartContainer}>
                {shoe.monthlySales.map((sales, index) => {
                  const height = (sales / maxMonthSales) * 100;
                  return (
                    <View key={index} style={styles.barCol}>
                      <View style={styles.barWrapper}>
                        <View style={[styles.bar, { height: `${height}%` }]} />
                      </View>
                      <Text style={styles.barLabel}>{months[index].slice(0, 1)}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.chartStats}>
                <Text style={styles.chartStatText}>Avg: {avgMonthlySales}/mo</Text>
                <Text style={styles.chartStatText}>Peak: {maxMonthSales} ({months[shoe.monthlySales.indexOf(maxMonthSales)]})</Text>
              </View>
            </View>

            {/* Size Availability */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size Availability</Text>
              <View style={styles.sizesGrid}>
                {Object.entries(shoe.sizesAvailable).map(([size, qty]) => (
                  <View key={size} style={[styles.sizeBox, qty < 5 && styles.sizeBoxLow]}>
                    <Text style={styles.sizeNum}>{size}</Text>
                    <Text style={[styles.sizeQty, qty < 5 && styles.sizeQtyLow]}>{qty} left</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsRow}>
                {shoe.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Info */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Color</Text>
              <Text style={styles.infoValue}>{shoe.color}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{shoe.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Release Year</Text>
              <Text style={styles.infoValue}>{shoe.releaseYear}</Text>
            </View>

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
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f1f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
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
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f8f9fc",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },
  revenueCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  revenueLabel: {
    color: "#888",
    fontSize: 13,
    marginBottom: 4,
  },
  revenueValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: "row",
    height: 100,
    alignItems: "flex-end",
  },
  barCol: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    width: 16,
    height: 80,
    backgroundColor: "#f0f1f5",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    backgroundColor: "#3498db",
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: "#888",
    marginTop: 6,
  },
  chartStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  chartStatText: {
    fontSize: 12,
    color: "#666",
  },
  sizesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeBox: {
    backgroundColor: "#f8f9fc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  sizeBoxLow: {
    backgroundColor: "#fef2f2",
  },
  sizeNum: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  sizeQty: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  sizeQtyLow: {
    color: "#e74c3c",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#e8f4fc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3498db",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f1f5",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a2e",
  },
});
