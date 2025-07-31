import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, quantity, price, expiry_date } = await request.json();
    await db.query(
      'UPDATE items SET name=?, quantity=?, price=?, expiry_date=? WHERE id=?',
      [name, quantity, price, expiry_date, params.id]
    );
    return NextResponse.json({ message: 'Item updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM items WHERE id=?', [params.id]);
    return NextResponse.json({ message: 'Item deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
