
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let query = 'SELECT * FROM categories';
    let params: any[] = [];
    
    if (type && (type === 'item' || type === 'supplier')) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY value ASC';
    
    const [rows] = await db.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { type, value } = await request.json();
    
    if (!type || !value || !['item', 'supplier'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type or value' }, { status: 400 });
    }
    
    await db.query(
      'INSERT INTO categories (type, value) VALUES (?, ?)',
      [type, value]
    );
    
    return NextResponse.json({ message: 'Category created' }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
