import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataPath = path.join(process.cwd(), 'data', 'ingredients.json');

async function readData() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

async function writeData(data: any) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// GET all ingredients
export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

// POST new ingredient
export async function POST(req: Request) {
  const newItem = await req.json();
  const data = await readData();

  const newIngredient = {
    id: Date.now(),
    ...newItem,
  };

  data.push(newIngredient);
  await writeData(data);

  return NextResponse.json(newIngredient);
}

// DELETE ingredient by id
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = await readData();

  const updated = data.filter((item: any) => item.id !== id);
  await writeData(updated);

  return NextResponse.json({ success: true });
}
