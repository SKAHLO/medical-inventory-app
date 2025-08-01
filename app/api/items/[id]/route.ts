import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { quantity } = await request.json();
    const itemId = params.id;
    
    await db.query(
      'UPDATE items SET quantity = ?, last_updated = NOW() WHERE id = ?',
      [quantity, itemId]
    );
    
    return NextResponse.json({ message: 'Item updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
