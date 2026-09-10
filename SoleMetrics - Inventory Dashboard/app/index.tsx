import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Modal, Pressable } from "react-native";
import { mockShoes } from "../data/mockShoes";
import StatCard from "../components/StatCard";
import CategoryChart from "../components/CategoryChart";
import SalesChart from "../components/SalesChart";
import BrandChart from "../components/BrandChart";
import TopProducts from "../components/TopProducts";
import FilterBar from "../components/FilterBar";
import ProductModal from "../components/ProductModal";
import AllProductsModal from "../components/AllProductsModal";

export default function HomeScreen() {
  const [selectedShoe, setSelectedShoe] = useState(mockShoes[0]);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const totalStock = mockShoes.reduce((sum, shoe) => sum + shoe.stock, 0);
  const avgRating = (mockShoes.reduce((sum, shoe) => sum + shoe.rating, 0) / mockShoes.length).toFixed(1);

  // Calculate stats based on time range
  const getTimeRangeData = () => {
    switch (timeRange) {
      case "week":
        // Last week = ~25% of last month
        const weekSales = mockShoes.reduce((sum, s) => sum + Math.round(s.monthlySales[11] * 0.25), 0);
        const prevWeekSales = mockShoes.reduce((sum, s) => sum + Math.round(s.monthlySales[11] * 0.22), 0);
        const weekRevenue = mockShoes.reduce((sum, s) => sum + s.price * Math.round(s.monthlySales[11] * 0.25), 0);
        return {
          sales: weekSales,
          revenue: weekRevenue,
          trend: ((weekSales - prevWeekSales) / prevWeekSales * 100).toFixed(1),
          unitsTrend: "+8.2%",
          stockTrend: "-1.2%",
        };
      case "month":
        const monthSales = mockShoes.reduce((sum, s) => sum + s.monthlySales[11], 0);
        const prevMonthSales = mockShoes.reduce((sum, s) => sum + s.monthlySales[10], 0);
        const monthRevenue = mockShoes.reduce((sum, s) => sum + s.price * s.monthlySales[11], 0);
        return {
          sales: monthSales,
          revenue: monthRevenue,
          trend: ((monthSales - prevMonthSales) / prevMonthSales * 100).toFixed(1),
          unitsTrend: "+12.3%",
          stockTrend: "-5.2%",
        };
      case "year":
        const yearSales = mockShoes.reduce((sum, s) => sum + s.salesCount, 0);
        const yearRevenue = mockShoes.reduce((sum, s) => sum + s.price * s.salesCount, 0);
        return {
          sales: yearSales,
          revenue: yearRevenue,
          trend: "+24.8",
          unitsTrend: "+34.1%",
          stockTrend: "-12.4%",
        };
      default:
        return { sales: 0, revenue: 0, trend: "0", unitsTrend: "0%", stockTrend: "0%" };
    }
  };

  const rangeData = getTimeRangeData();

  const handleProductSelect = (shoe: typeof mockShoes[0]) => {
    setSelectedShoe(shoe);
    setShowProductModal(true);
  };

  const handleStatPress = (statName: string) => {
    setActiveCard(activeCard === statName ? null : statName);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>InfoDash</Text>
          </View>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.7}>
            <Text style={styles.avatarText}>AW</Text>
          </TouchableOpacity>
        </View>

        {/* Time Range Filter */}
        <FilterBar selected={timeRange} onSelect={setTimeRange} />

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard 
            label="Total Revenue" 
            value={rangeData.revenue >= 1000 ? `$${(rangeData.revenue / 1000).toFixed(1)}K` : `$${rangeData.revenue}`}
            trend={+rangeData.trend > 0 ? `+${rangeData.trend}%` : `${rangeData.trend}%`}
            trendUp={+rangeData.trend > 0}
            icon="dollar-sign"
            onPress={() => handleStatPress('revenue')}
            active={activeCard === 'revenue'}
          />
          <StatCard 
            label="Units Sold" 
            value={rangeData.sales.toLocaleString()} 
            trend={rangeData.unitsTrend}
            trendUp={rangeData.unitsTrend.startsWith('+')}
            icon="shopping-bag"
            onPress={() => handleStatPress('units')}
            active={activeCard === 'units'}
          />
          <StatCard 
            label="Inventory" 
            value={String(totalStock)} 
            trend={rangeData.stockTrend}
            trendUp={false}
            icon="package"
            onPress={() => handleStatPress('inventory')}
            active={activeCard === 'inventory'}
          />
          <StatCard 
            label="Avg Rating" 
            value={avgRating} 
            trend="+0.2"
            trendUp={true}
            icon="star"
            onPress={() => handleStatPress('rating')}
            active={activeCard === 'rating'}
          />
        </View>

        {/* Sales Chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sales Overview</Text>
            <TouchableOpacity 
              style={styles.seeAll}
              activeOpacity={0.6}
              onPress={() => setShowAllProducts(true)}
            >
              <Text style={styles.seeAllText}>See Details →</Text>
            </TouchableOpacity>
          </View>
          <SalesChart shoe={selectedShoe} allShoes={mockShoes} />
        </View>

        {/* Charts Row */}
        <View style={styles.chartsRow}>
          <TouchableOpacity style={[styles.card, styles.halfCard]} activeOpacity={0.8}>
            <Text style={styles.cardTitle}>By Category</Text>
            <CategoryChart shoes={mockShoes} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.card, styles.halfCard]} activeOpacity={0.8}>
            <Text style={styles.cardTitle}>By Brand</Text>
            <BrandChart shoes={mockShoes} />
          </TouchableOpacity>
        </View>

        {/* Top Products */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Top Products</Text>
            <TouchableOpacity 
              style={styles.seeAll}
              activeOpacity={0.6}
              onPress={() => setShowAllProducts(true)}
            >
              <Text style={styles.seeAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          <TopProducts 
            shoes={mockShoes} 
            onSelect={handleProductSelect} 
            selected={selectedShoe} 
          />
        </View>

        {/* Inventory List */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Inventory Status</Text>
            <TouchableOpacity 
              style={styles.seeAll}
              activeOpacity={0.6}
              onPress={() => setShowAllProducts(true)}
            >
              <Text style={styles.seeAllText}>Manage →</Text>
            </TouchableOpacity>
          </View>
          {mockShoes.map(shoe => {
            const stockLevel = shoe.stock < 30 ? "low" : shoe.stock < 60 ? "medium" : "high";
            return (
              <TouchableOpacity 
                style={styles.inventoryRow} 
                key={shoe.id}
                onPress={() => handleProductSelect(shoe)}
                activeOpacity={0.6}
              >
                <View style={[styles.colorDot, { backgroundColor: getColorHex(shoe.color) }]} />
                <View style={styles.inventoryInfo}>
                  <Text style={styles.inventoryName}>{shoe.name}</Text>
                  <Text style={styles.inventoryMeta}>{shoe.brand} · ${shoe.price}</Text>
                </View>
                <View style={styles.stockBadge}>
                  <View style={[styles.stockIndicator, styles[`stock_${stockLevel}`]]} />
                  <Text style={styles.stockText}>{shoe.stock}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Product Detail Modal */}
      <ProductModal 
        visible={showProductModal}
        shoe={selectedShoe}
        onClose={() => setShowProductModal(false)}
      />

      {/* All Products Modal */}
      <AllProductsModal
        visible={showAllProducts}
        shoes={mockShoes}
        onClose={() => setShowAllProducts(false)}
        onSelect={(shoe) => {
          setSelectedShoe(shoe);
          setShowAllProducts(false);
          setShowProductModal(true);
        }}
      />
    </View>
  );
}

function getColorHex(color: string): string {
  const colors: Record<string, string> = {
    White: "#f0f0f0",
    Black: "#333",
    Bone: "#e8dcc8",
    Red: "#e74c3c",
    Blue: "#3498db",
  };
  return colors[color] || "#999";
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fc" },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },
  
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: { fontSize: 14, color: "#666", marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "800", color: "#1a1a2e" },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  statsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginHorizontal: -6,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a2e" },
  seeAll: { 
    backgroundColor: "#f0f1f5", 
    paddingHorizontal: 12, 
    paddingVertical: 6,
    borderRadius: 8,
  },
  seeAllText: { fontSize: 12, fontWeight: "600", color: "#1a1a2e" },

  chartsRow: {
    flexDirection: "row",
    marginHorizontal: -6,
  },
  halfCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
  },

  inventoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f1f5",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  inventoryInfo: { flex: 1 },
  inventoryName: { fontSize: 15, fontWeight: "600", color: "#1a1a2e" },
  inventoryMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  stockBadge: { 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#f8f9fc",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stock_low: { backgroundColor: "#e74c3c" },
  stock_medium: { backgroundColor: "#f39c12" },
  stock_high: { backgroundColor: "#27ae60" },
  stockText: { fontSize: 13, fontWeight: "600", color: "#1a1a2e" },
});
