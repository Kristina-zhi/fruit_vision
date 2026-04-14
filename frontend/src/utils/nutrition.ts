import { Nutrition } from '../types/fruit';

export const DAILY_VALUES = {
  calories: 2000,
  proteins: 50,
  fats: 70,
  carbohydrates: 275,
  fiber: 25,
  water: 2000,
};

export type NutritionKey = keyof typeof DAILY_VALUES;

export function dailyValuePercent(key: NutritionKey, value: number): number {
  const norm = DAILY_VALUES[key];
  if (!norm || !Number.isFinite(value)) return 0;
  return Math.round((value / norm) * 1000) / 10;
}

export function macroDistribution(nutrition?: Nutrition | null) {
  const proteins = (nutrition?.proteins ?? 0) * 4;
  const fats = (nutrition?.fats ?? 0) * 9;
  const carbohydrates = (nutrition?.carbohydrates ?? 0) * 4;
  const total = proteins + fats + carbohydrates;
  if (total <= 0) {
    return { proteins: 0, fats: 0, carbohydrates: 0 };
  }
  return {
    proteins: Math.round((proteins / total) * 100),
    fats: Math.round((fats / total) * 100),
    carbohydrates: Math.round((carbohydrates / total) * 100),
  };
}
