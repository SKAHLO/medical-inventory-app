
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

async function checkAdminAuth() {
  const sessionId = cookies().get('session_id')?.value;
  
  if (!sessionId) {
    return null;
  }
  
  const [sessions] = await db.query(
    'SELECT s.*, u.level FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > NOW()',
    [sessionId]
  );
  
  const session = Array.isArray(sessions) && sessions.length > 0 ? sessions[0] : null;
  
  return session && session.level === 'admin' ? session : null;
}

export async function GET() {
  try {
    const adminSession = await checkAdminAuth();
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const [users] = await db.query('SELECT id, name, level, created_at, last_login FROM users ORDER BY created_at DESC');
    return NextResponse.json(users);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminSession = await checkAdminAuth();
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const { name, password, level } = await request.json();
    
    if (!name || !password || !level) {
      return NextResponse.json({ error: 'Name, password, and level required' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'INSERT INTO users (name, password, level) VALUES (?, ?, ?)',
      [name, hashedPassword, level]
    );
    
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    
  } catch (error: any) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
