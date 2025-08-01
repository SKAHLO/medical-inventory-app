
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM items ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { 
      name, 
      description, 
      category, 
      quantity, 
      min_stock, 
      price, 
      unit, 
      supplier, 
      location, 
      batch_number, 
      expiry_date 
    } = await request.json();
    
    await db.query(
      'INSERT INTO items (name, description, category, quantity, min_stock, price, unit, supplier, location, batch_number, expiry_date, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [name, description, category, quantity, min_stock, price, unit, supplier, location, batch_number, expiry_date]
    );
    return NextResponse.json({ message: 'Item created' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
