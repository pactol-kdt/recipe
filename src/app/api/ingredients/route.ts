import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

const dataPath = path.join(process.cwd(), 'data', 'ingredients.json');

async function readData(): Promise<Ingredient[]> {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data || '[]') as Ingredient[];
  } catch {
    return [];
  }
}

async function writeData(data: Ingredient[]): Promise<void> {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// GET all ingredients
export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

// POST new ingredient
export async function POST(req: Request) {
  const newItem = (await req.json()) as Omit<Ingredient, 'id'>;
  const data = await readData();

  const newIngredient: Ingredient = {
    id: Date.now(),
    ...newItem,
  };

  data.push(newIngredient);
  await writeData(data);

  return NextResponse.json(newIngredient);
}

// DELETE ingredient by id
export async function DELETE(req: Request) {
  const { id } = (await req.json()) as { id: number };
  const data = await readData();

  const updated = data.filter((item) => item.id !== id);
  await writeData(updated);

  return NextResponse.json({ success: true });
}
