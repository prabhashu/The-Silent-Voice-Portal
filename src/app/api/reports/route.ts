import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reports } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await db.select()
      .from(reports)
      .orderBy(desc(reports.timestamp))
      .limit(100);

    return NextResponse.json({ success: true, reports: data });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
