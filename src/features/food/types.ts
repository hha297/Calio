export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type FoodEntry = {
  id: string;
  logged_on: string;
  meal_type: MealType;
  quantity: number;
  food_name: string;
  brand: string | null;
  serving_label: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type Food = {
  id: string;
  name: string;
  brand: string | null;
  barcode: string | null;
  serving_label: string;
  serving_grams: number | null;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  source: string;
};
