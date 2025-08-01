
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const sessionId = (await cookies()).get('session_id')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const [sessions] = await db.query(
      'SELECT s.*, u.id as user_id, u.name, u.level FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > NOW()',
      [sessionId]
    );
    
    const session = Array.isArray(sessions) && sessions.length > 0 ? sessions[0] : null;
    
    if (!session) {
      (await cookies()).delete('session_id');
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    
    return NextResponse.json({
      user: {
        id: session.user_id,
        name: session.name,
        level: session.level
      }
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Authentication check failed' }, { status: 500 });
  }
}
