import { Ingredient } from './ingredients';
import { Instruction } from './instruction';

export type Recipe = {
  id: number;
  name: string;
  description: string;
  cook_time: string;
  yield: string;
  ingredients: Ingredient[];
  instruction: Instruction[];
  is_favorite: boolean;

  created_at: string;
  updated_at: string;

  error?: string;
};
