export interface Nutrient {
  name: string;
  amount: string;
}

export interface Nutrition {
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  fiber: number;
  water: number;
}

export interface FruitInfo {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  calories: number;
  season?: string;
  location?: string;
  image_url?: string;
  vitamins: Nutrient[];
  minerals: Nutrient[];
  nutrition: Nutrition;
}

export interface FruitSummary {
  id: number;
  name: string;
  display_name: string;
  calories: number;
  image_url?: string;
}

export interface Detection {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: { x_min: number; y_min: number; x_max: number; y_max: number };
  fruit?: FruitSummary | null;
}

export interface AnalyzeResponse {
  id: number;
  file_name: string;
  file_path: string;
  analyzed_at: string;
  detections: Detection[];
}

export interface HistoryResponse {
  items: AnalyzeResponse[];
  total: number;
  page: number;
  size: number;
}
