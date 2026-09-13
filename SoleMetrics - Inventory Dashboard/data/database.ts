/**
 * SQLite Database Layer for SoleMetrics
 * Handles all database operations for shoe inventory
 */

import * as SQLite from 'expo-sqlite';
import { Shoe } from '../types/Shoe';

const DB_NAME = 'solemetrics.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database connection and create tables
 */
export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync(DB_NAME);
  
  // Create shoes table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS shoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      salesCount INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      imageUrl TEXT,
      sizes TEXT,
      colors TEXT,
      releaseDate TEXT,
      tags TEXT,
      monthlySales TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Check if we need to seed data
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM shoes');
  if (result && result.count === 0) {
    await seedDatabase();
  }
}

/**
 * Seed the database with initial shoe data
 */
async function seedDatabase(): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  
  const seedData: Omit<Shoe, 'id'>[] = [
    {
      name: "Air Max 270",
      brand: "Nike",
      category: "Sneakers",
      price: 150,
      stock: 45,
      salesCount: 234,
      rating: 4.5,
      imageUrl: "https://example.com/airmax.jpg",
      sizes: [7, 8, 9, 10, 11, 12],
      colors: ["Black", "White", "Red"],
      releaseDate: "2024-01-15",
      tags: ["running", "casual", "popular"],
      monthlySales: [45, 52, 38, 61, 55, 48, 42, 58, 63, 51, 47, 54]
    },
    {
      name: "Ultraboost 22",
      brand: "Adidas",
      category: "Running",
      price: 180,
      stock: 32,
      salesCount: 189,
      rating: 4.7,
      imageUrl: "https://example.com/ultraboost.jpg",
      sizes: [7, 8, 9, 10, 11],
      colors: ["White", "Black", "Blue"],
      releaseDate: "2024-02-20",
      tags: ["running", "performance", "boost"],
      monthlySales: [32, 41, 35, 48, 52, 45, 38, 44, 49, 42, 36, 41]
    },
    {
      name: "Chuck Taylor Classic",
      brand: "Converse",
      category: "Sneakers",
      price: 65,
      stock: 78,
      salesCount: 312,
      rating: 4.3,
      imageUrl: "https://example.com/chuck.jpg",
      sizes: [6, 7, 8, 9, 10, 11, 12, 13],
      colors: ["Black", "White", "Red", "Navy"],
      releaseDate: "2023-06-01",
      tags: ["classic", "casual", "canvas"],
      monthlySales: [58, 62, 55, 71, 68, 59, 52, 65, 72, 61, 54, 63]
    },
    {
      name: "Gel-Kayano 29",
      brand: "ASICS",
      category: "Running",
      price: 160,
      stock: 28,
      salesCount: 145,
      rating: 4.6,
      imageUrl: "https://example.com/kayano.jpg",
      sizes: [7, 8, 9, 10, 11, 12],
      colors: ["Blue", "Black", "White"],
      releaseDate: "2024-03-10",
      tags: ["running", "stability", "marathon"],
      monthlySales: [22, 28, 31, 35, 29, 33, 27, 31, 38, 32, 25, 29]
    },
    {
      name: "Old Skool",
      brand: "Vans",
      category: "Sneakers",
      price: 70,
      stock: 65,
      salesCount: 278,
      rating: 4.4,
      imageUrl: "https://example.com/oldskool.jpg",
      sizes: [6, 7, 8, 9, 10, 11, 12],
      colors: ["Black/White", "Navy", "Red"],
      releaseDate: "2023-08-15",
      tags: ["skate", "casual", "classic"],
      monthlySales: [48, 55, 42, 61, 58, 51, 45, 52, 59, 53, 47, 56]
    },
    {
      name: "Cloudmonster",
      brand: "On",
      category: "Running",
      price: 170,
      stock: 22,
      salesCount: 98,
      rating: 4.8,
      imageUrl: "https://example.com/cloudmonster.jpg",
      sizes: [7, 8, 9, 10, 11],
      colors: ["White", "Black", "Mint"],
      releaseDate: "2024-04-01",
      tags: ["running", "cloud", "swiss"],
      monthlySales: [15, 18, 22, 28, 31, 25, 19, 24, 29, 26, 21, 27]
    },
    {
      name: "574 Core",
      brand: "New Balance",
      category: "Sneakers",
      price: 90,
      stock: 55,
      salesCount: 203,
      rating: 4.2,
      imageUrl: "https://example.com/574.jpg",
      sizes: [7, 8, 9, 10, 11, 12],
      colors: ["Grey", "Navy", "Black"],
      releaseDate: "2023-09-20",
      tags: ["lifestyle", "retro", "comfort"],
      monthlySales: [35, 42, 38, 49, 45, 41, 36, 43, 48, 44, 39, 46]
    },
    {
      name: "Birkenstock Arizona",
      brand: "Birkenstock",
      category: "Sandals",
      price: 110,
      stock: 41,
      salesCount: 167,
      rating: 4.5,
      imageUrl: "https://example.com/arizona.jpg",
      sizes: [6, 7, 8, 9, 10, 11, 12],
      colors: ["Brown", "Black", "White"],
      releaseDate: "2023-05-01",
      tags: ["sandals", "comfort", "summer"],
      monthlySales: [25, 32, 45, 58, 62, 55, 48, 42, 35, 28, 22, 26]
    },
    {
      name: "Air Jordan 1 Retro",
      brand: "Nike",
      category: "Sneakers",
      price: 180,
      stock: 18,
      salesCount: 156,
      rating: 4.9,
      imageUrl: "https://example.com/jordan1.jpg",
      sizes: [8, 9, 10, 11, 12],
      colors: ["Chicago", "Bred", "Royal"],
      releaseDate: "2024-02-01",
      tags: ["basketball", "retro", "hype"],
      monthlySales: [28, 35, 32, 41, 38, 33, 29, 36, 42, 37, 31, 34]
    },
    {
      name: "Suede Classic",
      brand: "Puma",
      category: "Sneakers",
      price: 75,
      stock: 52,
      salesCount: 187,
      rating: 4.1,
      imageUrl: "https://example.com/suede.jpg",
      sizes: [7, 8, 9, 10, 11, 12],
      colors: ["Black", "Blue", "Red", "Green"],
      releaseDate: "2023-07-10",
      tags: ["classic", "suede", "lifestyle"],
      monthlySales: [32, 38, 35, 44, 41, 37, 33, 39, 45, 40, 34, 42]
    }
  ];
  
  for (const shoe of seedData) {
    await db.runAsync(
      `INSERT INTO shoes (name, brand, category, price, stock, salesCount, rating, imageUrl, sizes, colors, releaseDate, tags, monthlySales)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shoe.name,
        shoe.brand,
        shoe.category,
        shoe.price,
        shoe.stock,
        shoe.salesCount,
        shoe.rating,
        shoe.imageUrl || '',
        JSON.stringify(shoe.sizes),
        JSON.stringify(shoe.colors),
        shoe.releaseDate,
        JSON.stringify(shoe.tags),
        JSON.stringify(shoe.monthlySales)
      ]
    );
  }
  
  console.log('Database seeded with initial shoe data');
}

/**
 * Get all shoes from the database
 */
export async function getAllShoes(): Promise<Shoe[]> {
  if (!db) throw new Error('Database not initialized');
  
  const rows = await db.getAllAsync<any>('SELECT * FROM shoes ORDER BY salesCount DESC');
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    stock: row.stock,
    salesCount: row.salesCount,
    rating: row.rating,
    imageUrl: row.imageUrl,
    sizes: JSON.parse(row.sizes || '[]'),
    colors: JSON.parse(row.colors || '[]'),
    releaseDate: row.releaseDate,
    tags: JSON.parse(row.tags || '[]'),
    monthlySales: JSON.parse(row.monthlySales || '[]')
  }));
}

/**
 * Get a single shoe by ID
 */
export async function getShoeById(id: number): Promise<Shoe | null> {
  if (!db) throw new Error('Database not initialized');
  
  const row = await db.getFirstAsync<any>('SELECT * FROM shoes WHERE id = ?', [id]);
  
  if (!row) return null;
  
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    stock: row.stock,
    salesCount: row.salesCount,
    rating: row.rating,
    imageUrl: row.imageUrl,
    sizes: JSON.parse(row.sizes || '[]'),
    colors: JSON.parse(row.colors || '[]'),
    releaseDate: row.releaseDate,
    tags: JSON.parse(row.tags || '[]'),
    monthlySales: JSON.parse(row.monthlySales || '[]')
  };
}

/**
 * Get shoes by category
 */
export async function getShoesByCategory(category: string): Promise<Shoe[]> {
  if (!db) throw new Error('Database not initialized');
  
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM shoes WHERE category = ? ORDER BY salesCount DESC',
    [category]
  );
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    stock: row.stock,
    salesCount: row.salesCount,
    rating: row.rating,
    imageUrl: row.imageUrl,
    sizes: JSON.parse(row.sizes || '[]'),
    colors: JSON.parse(row.colors || '[]'),
    releaseDate: row.releaseDate,
    tags: JSON.parse(row.tags || '[]'),
    monthlySales: JSON.parse(row.monthlySales || '[]')
  }));
}

/**
 * Get shoes by brand
 */
export async function getShoesByBrand(brand: string): Promise<Shoe[]> {
  if (!db) throw new Error('Database not initialized');
  
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM shoes WHERE brand = ? ORDER BY salesCount DESC',
    [brand]
  );
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    stock: row.stock,
    salesCount: row.salesCount,
    rating: row.rating,
    imageUrl: row.imageUrl,
    sizes: JSON.parse(row.sizes || '[]'),
    colors: JSON.parse(row.colors || '[]'),
    releaseDate: row.releaseDate,
    tags: JSON.parse(row.tags || '[]'),
    monthlySales: JSON.parse(row.monthlySales || '[]')
  }));
}

/**
 * Update shoe stock
 */
export async function updateStock(id: number, newStock: number): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  
  await db.runAsync(
    'UPDATE shoes SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [newStock, id]
  );
}

/**
 * Record a sale (decrement stock, increment salesCount)
 */
export async function recordSale(id: number, quantity: number = 1): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  
  await db.runAsync(
    `UPDATE shoes 
     SET stock = stock - ?, salesCount = salesCount + ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ? AND stock >= ?`,
    [quantity, quantity, id, quantity]
  );
}

/**
 * Add a new shoe to inventory
 */
export async function addShoe(shoe: Omit<Shoe, 'id'>): Promise<number> {
  if (!db) throw new Error('Database not initialized');
  
  const result = await db.runAsync(
    `INSERT INTO shoes (name, brand, category, price, stock, salesCount, rating, imageUrl, sizes, colors, releaseDate, tags, monthlySales)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      shoe.name,
      shoe.brand,
      shoe.category,
      shoe.price,
      shoe.stock,
      shoe.salesCount || 0,
      shoe.rating || 0,
      shoe.imageUrl || '',
      JSON.stringify(shoe.sizes || []),
      JSON.stringify(shoe.colors || []),
      shoe.releaseDate || '',
      JSON.stringify(shoe.tags || []),
      JSON.stringify(shoe.monthlySales || [])
    ]
  );
  
  return result.lastInsertRowId;
}

/**
 * Delete a shoe from inventory
 */
export async function deleteShoe(id: number): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  
  await db.runAsync('DELETE FROM shoes WHERE id = ?', [id]);
}

/**
 * Get aggregate statistics
 */
export async function getStats(): Promise<{
  totalRevenue: number;
  totalUnitsSold: number;
  totalStock: number;
  avgRating: number;
  categoryBreakdown: { category: string; count: number; sales: number }[];
  brandBreakdown: { brand: string; count: number; sales: number }[];
}> {
  if (!db) throw new Error('Database not initialized');
  
  const totals = await db.getFirstAsync<any>(`
    SELECT 
      SUM(price * salesCount) as totalRevenue,
      SUM(salesCount) as totalUnitsSold,
      SUM(stock) as totalStock,
      AVG(rating) as avgRating
    FROM shoes
  `);
  
  const categoryBreakdown = await db.getAllAsync<any>(`
    SELECT category, COUNT(*) as count, SUM(salesCount) as sales
    FROM shoes GROUP BY category ORDER BY sales DESC
  `);
  
  const brandBreakdown = await db.getAllAsync<any>(`
    SELECT brand, COUNT(*) as count, SUM(salesCount) as sales
    FROM shoes GROUP BY brand ORDER BY sales DESC
  `);
  
  return {
    totalRevenue: totals?.totalRevenue || 0,
    totalUnitsSold: totals?.totalUnitsSold || 0,
    totalStock: totals?.totalStock || 0,
    avgRating: totals?.avgRating || 0,
    categoryBreakdown,
    brandBreakdown
  };
}

/**
 * Search shoes by name or brand
 */
export async function searchShoes(query: string): Promise<Shoe[]> {
  if (!db) throw new Error('Database not initialized');
  
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM shoes 
     WHERE name LIKE ? OR brand LIKE ? OR category LIKE ?
     ORDER BY salesCount DESC`,
    [`%${query}%`, `%${query}%`, `%${query}%`]
  );
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    stock: row.stock,
    salesCount: row.salesCount,
    rating: row.rating,
    imageUrl: row.imageUrl,
    sizes: JSON.parse(row.sizes || '[]'),
    colors: JSON.parse(row.colors || '[]'),
    releaseDate: row.releaseDate,
    tags: JSON.parse(row.tags || '[]'),
    monthlySales: JSON.parse(row.monthlySales || '[]')
  }));
}
