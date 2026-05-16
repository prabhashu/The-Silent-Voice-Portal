// We use native fetch to the Gemini REST API instead of the SDK to avoid Serverless "Error fetching" bugs

export async function analyzeSentiment(text: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return { score: 0.5, rawLabel: 'no-api-key' };
    }

    const prompt = `You are an expert school counselor AI with native fluency in English, Sinhala, and Singlish (Sinhala written with English letters).
    Analyze the risk/severity level of the provided student report. 
    
    Singlish & Sinhala Dictionary (Context for understanding):
    - gahanawa, gahanwa, gahanna = hitting / to hit (Violence)
    - maranawa, marenna, marila = kill / to die / dead (Severe Harm)
    - baya, bayai = scared / fear (Anxiety)
    - wada denawa, wadadenawa = harassing / torturing (Bullying)
    - inna denne naha, karadara karanawa = won't let me stay / bothering me (Bullying / Harassment)
    - kapanawa = cutting (Self-harm / Violence)
    - kudu, ice, guli, arakku = drugs / alcohol (Substance abuse)
    - athawara = abuse (Severe)
    - stress eka wadi, oluwa ridenawa = high stress / headache (Mental Health Concern)
    - randu wenawa = fighting (Conflict)
    
    Score the severity/risk of this report on a precise scale of 0 to 100.
    - 90 to 100: Extreme emergencies (Physical violence, hitting, weapons, severe bullying, suicide, drugs).
    - 80 to 89: High risk / Urgent Mental Health (Severe emotional distress, cries for help like "stress eka wadi pls help").
    - 60 to 79: Medium-High risk (Continuous bullying like "inna denne naha", harassment).
    - 40 to 59: Medium risk (Arguments with friends, mild anxiety).
    - 10 to 39: Low risk (General questions, minor issues, "sir mata udaw karanna").
    - 0 to 9: Harmless/Neutral (e.g., "hi", "hello", "test", "good morning").

    Respond with ONLY the exact number from 0 to 100 and absolutely nothing else. Do not include a percent sign or any other text.
    
    Text: ${text}`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 404) {
        throw new Error(`API Key error: Please get your key from aistudio.google.com. Your current key doesn't have Gemini enabled.`);
      }
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 40)}`);
    }

    const data = await response.json();
    const label = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '50';
    
    // Parse the number from Gemini's response
    const parsedNum = parseInt(label, 10);
    let score = 0.5; // Neutral fallback
    
    if (!isNaN(parsedNum)) {
      score = Math.max(0, Math.min(100, parsedNum)) / 100; // Convert 85 to 0.85
    } else {
      console.warn("AI returned non-number:", label);
    }
    
    return { score, rawLabel: label };
  } catch (error: any) {
    console.error('Error analyzing sentiment with Gemini:', error);
    return { score: 0.5, rawLabel: `Error: ${error?.message || 'Unknown'}` }; // Fallback with error
  }
}

export async function translateToEnglish(text: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return text;
    }

    const prompt = `You are a translator. Translate the given text from Sinhala or Singlish (Sinhala written with English letters) to English. 
    
    Singlish Dictionary for context:
    - gahanawa / gahanwa / gahanna = hitting / to hit
    - maranawa / marenna = kill / to die
    - baya / bayai = scared / fear
    - wada denawa = harassing
    - kapanawa = cutting
    - kudu = drugs
    
    If the text is already in English (like "hi" or "hello"), just return the exact original text. Only output the final translated text and absolutely nothing else.
    
    Text: ${text}`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    if (!response.ok) {
      return text; // Fallback to original text on translation error
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;
  } catch(e) {
    console.error('Error translating text:', e);
    return text;
  }
}
