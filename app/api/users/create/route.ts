import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, password, level } = await request.json();

    if (!name || !password || !level) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [existing] = await db.query('SELECT id FROM users WHERE name = ?', [name]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    await db.query(
      'INSERT INTO users (name, password, level) VALUES (?, ?, ?)',
      [name, hashed, level]
    );

    return NextResponse.json({ success: true, message: 'User created successfully' });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
