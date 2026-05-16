import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reports } from '@/db/schema';
import { translateToEnglish, analyzeSentiment } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { reportText, category, studentName, contactInfo } = await req.json();

    if (!reportText) {
      return NextResponse.json({ success: false, error: 'Report text is required' }, { status: 400 });
    }

    // 1. Detect if it's Sinhala and translate or use Multilingual Model
    const processedText = await translateToEnglish(reportText); 

    // 2. Get Severity Score from AI
    const analysis = await analyzeSentiment(processedText);

    // 3. Check for Local Red Flag Keywords (Safety Override)
    // Common Sinhala / Singlish red flags
    const redFlags = [
      // Violence / Harm
      "මරනවා", "ගහනවා", "toxic", "suicide", "kill", "die", "depressed", "harass",
      "gahanawa", "gahanwa", "maranawa", "kapanawa", "marila", "hitha wada", "baya", "bully",
      
      // Drugs / Substance Abuse
      "බොනවා", "bonawa", "cudu", "kudu", "guli", "arakku", "ganja", "sigurate", 
      "thuul", "kassipu", "weed", "ice", "mawa", "babul", "pamini", "kuddo", "cigaret"
    ];
    const lowerText = reportText.toLowerCase();
    
    // Fix: Only match whole words to prevent "nice" from matching "ice", or "studies" matching "die"
    const containsRedFlag = redFlags.some(word => {
      // Use explicit boundaries for spaces and common punctuation to support both English and Sinhala safely
      const regex = new RegExp(`(^|\\s|[.,!?;:'"()])(${word})($|\\s|[.,!?;:'"()])`, 'i');
      return regex.test(lowerText);
    });

    let finalSeverity = analysis.score;
    let isHighRisk = false;

    if (containsRedFlag || finalSeverity > 0.8) {
      finalSeverity = containsRedFlag ? Math.max(0.9, finalSeverity) : finalSeverity;
      isHighRisk = true;
    }

    // 4. Save to Postgres
    await db.insert(reports).values({
      text: reportText, // Store original
      category: category || 'General',
      studentName: studentName || 'Anonymous',
      contactInfo: contactInfo || 'None provided',
      severity: finalSeverity,
      isHighRisk,
      status: 'pending', // pending, reviewed, resolved
      timestamp: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      isHighRisk 
    });
  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
