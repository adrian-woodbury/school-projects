export interface Shoe {
  id?: number;
  name: string;
  category: string;
  brand: string;
  color: string;
  gender: string;
  price: number;
  stock: number;
  sizesAvailable: Record<string, number>;
  monthlySales: number[];
  rating: number;
  salesCount: number;
  releaseYear: number;
  tags: string[];
}