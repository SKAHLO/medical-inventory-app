
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM transactions ORDER BY date DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { item_id, item_name, quantity, type, notes, user } = await request.json();
    await db.query(
      'INSERT INTO transactions (item_id, item_name, quantity, type, notes, date, user) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
      [item_id, item_name, quantity, type, notes, user]
    );
    return NextResponse.json({ message: 'Transaction created' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
