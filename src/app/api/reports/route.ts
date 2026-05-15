import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('silent-voice');
    
    const reports = await db
      .collection('reports')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
