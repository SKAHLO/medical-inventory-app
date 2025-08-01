
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, category, phone, email, address, rating, products_count } = await request.json();
    await db.query(
      'INSERT INTO suppliers (name, category, phone, email, address, rating, products_count, last_order) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [name, category, phone, email, address, rating, products_count]
    );
    return NextResponse.json({ message: 'Supplier created' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
