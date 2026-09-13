# SoleMetrics - Inventory Dashboard

A React Native/Expo dashboard for shoe inventory analytics with SQLite database backend.

## Features

- **SQLite Database**: Local persistent storage using expo-sqlite
- **Interactive Charts**: Sales trends, category/brand breakdowns
- **Inventory Management**: Track stock levels with visual indicators
- **Time Range Filtering**: View stats by week, month, or year
- **Product Details**: Modal views with full product information

## Tech Stack

- React Native / Expo
- TypeScript
- SQLite (expo-sqlite)
- Feather Icons

## Database Schema

```sql
CREATE TABLE shoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  salesCount INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  imageUrl TEXT,
  sizes TEXT,          -- JSON array
  colors TEXT,         -- JSON array
  releaseDate TEXT,
  tags TEXT,           -- JSON array
  monthlySales TEXT,   -- JSON array of 12 months
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Running Locally

```bash
npm install
npx expo start
```

## Project Structure

```
├── app/
│   └── index.tsx          # Main dashboard screen
├── components/
│   ├── StatCard.tsx       # Metric display cards
│   ├── SalesChart.tsx     # Sales line chart
│   ├── CategoryChart.tsx  # Category pie chart
│   ├── BrandChart.tsx     # Brand breakdown
│   ├── TopProducts.tsx    # Top sellers list
│   ├── FilterBar.tsx      # Time range selector
│   ├── ProductModal.tsx   # Product detail view
│   └── AllProductsModal.tsx # Full product list
├── data/
│   └── database.ts        # SQLite operations
└── types/
    └── Shoe.ts            # TypeScript interfaces
```
