// We use native fetch to the Gemini REST API instead of the SDK to avoid Serverless "Error fetching" bugs

export async function analyzeSentiment(text: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return { score: 0.5, rawLabel: 'no-api-key' };
    }

    const prompt = `You are an expert school counselor AI with native fluency in English, Sinhala, and Singlish (Sinhala written with English letters).
    Analyze the risk level of the provided student report. 
    
    Singlish Reference Dictionary (Urgent/High Risk words):
    - gahanawa, gahanwa, gahanna = hitting / to hit (Violence)
    - maranawa, marenna, marila = kill / to die / dead (Severe Harm)
    - baya, bayai = scared / fear (Concern)
    - wada denawa, wadadenawa = harassing / torturing (Bullying)
    - kapanawa = cutting (Self-harm / Violence)
    - kudu, ice, guli, arakku = drugs / alcohol (Substance abuse)
    - athawara = abuse (Severe)
    
    Classify the text exactly like a product review model into one of these labels: "1 star", "2 stars", "3 stars", "4 stars", or "5 stars".
    - "1 star": Extremely negative, severe concerning behavior (violence, hitting, bullying, self-harm, extreme sadness, drugs).
    - "2 stars": Negative, minor concerns or stress.
    - "3 stars": Neutral statements.
    - "4 stars": Positive.
    - "5 stars": Extremely positive, OR harmless casual greetings like "hi", "hello", "test", "testing".
    
    Respond with ONLY the exact label string (e.g. "1 star") and absolutely nothing else.
    
    Text: ${text}`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
    const label = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '3 stars';
    
    let score = 0.5; // Neutral default
    
    // Exact scoring logic
    switch (label) {
      case '1 star': score = 0.75; break; // Negative sentiment -> Medium Risk
      case '2 stars': score = 0.50; break;
      case '3 stars': score = 0.35; break;
      case '4 stars': score = 0.15; break;
      case '5 stars': score = 0.05; break; // Extremely positive / low risk
      default:
        if (label.includes('1')) score = 0.75;
        else if (label.includes('2')) score = 0.50;
        else if (label.includes('3')) score = 0.35;
        else if (label.includes('4')) score = 0.15;
        else if (label.includes('5')) score = 0.05;
        break;
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
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
