import { Shoe } from "../types/Shoe";

export const mockShoes: Shoe[] = [
  {
    id: 1, name: "Air Max 90", category: "Sneakers", brand: "Nike",
    color: "White", gender: "Men", price: 130, stock: 42,
    sizesAvailable: {"7":5,"8":10,"9":7,"10":4,"11":3},
    monthlySales: [12,30,19,44,50,61,42,55,37,29,22,18],
    rating: 4.5, salesCount: 1820, releaseYear: 2024,
    tags: ["running","lifestyle","retro"]
  },
  {
    id: 2, name: "UltraBoost 22", category: "Running", brand: "Adidas",
    color: "Black", gender: "Women", price: 180, stock: 30,
    sizesAvailable: {"6":6,"7":8,"8":9,"9":5},
    monthlySales: [22,40,31,28,33,42,51,49,36,30,24,20],
    rating: 4.7, salesCount: 2400, releaseYear: 2023,
    tags: ["running","performance"]
  },
  {
    id: 3, name: "Yeezy Slide", category: "Sandals", brand: "Adidas",
    color: "Bone", gender: "Unisex", price: 70, stock: 80,
    sizesAvailable: {"7":12,"8":18,"9":15,"10":20,"11":15},
    monthlySales: [15,18,22,35,44,50,65,70,55,32,28,19],
    rating: 4.2, salesCount: 3500, releaseYear: 2022,
    tags: ["slides","casual","streetwear"]
  },
  {
    id: 4, name: "Chuck Taylor High", category: "Sneakers", brand: "Converse",
    color: "Red", gender: "Unisex", price: 65, stock: 120,
    sizesAvailable: {"6":20,"7":25,"8":30,"9":25,"10":20},
    monthlySales: [8,10,15,22,28,30,32,40,33,25,18,12],
    rating: 4.3, salesCount: 6800, releaseYear: 2020,
    tags: ["classic","canvas","lifestyle"]
  },
  {
    id: 5, name: "Jordan 1 Retro High OG", category: "Sneakers", brand: "Jordan",
    color: "Blue", gender: "Men", price: 180, stock: 20,
    sizesAvailable: {"8":3,"9":5,"10":6,"11":4,"12":2},
    monthlySales: [40,55,62,70,90,110,130,140,120,95,60,50],
    rating: 4.8, salesCount: 5000, releaseYear: 2024,
    tags: ["retro","basketball","premium"]
  }
];