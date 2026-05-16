import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.NETLIFY_BLOBS_CONTEXT || "dummy-key",
});

export async function analyzeSentiment(text: string) {
  try {
    // If we don't have a real API key configured, return fallback
    if (process.env.ANTHROPIC_API_KEY === undefined) {
      console.warn("ANTHROPIC_API_KEY is missing. Returning neutral score.");
      return { score: 0.5, rawLabel: 'no-api-key' };
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 100,
      system: 'Analyze the sentiment and risk severity of the provided text (which might be in English, Sinhala, or Singlish). Respond with a JSON object with a single "score" property from 0.0 to 1.0, where 1.0 is extremely urgent/high risk (e.g. self-harm, violence) and 0.0 is low risk. Output ONLY valid JSON.',
      messages: [{ role: 'user', content: text }],
    });
    
    const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
    let score = 0.5;
    try {
      const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed.score === 'number') {
        score = parsed.score;
      }
    } catch(e) {
       console.error("Failed to parse Claude score", e);
    }
    
    return { score, rawLabel: 'claude-analysis' };
  } catch (error) {
    console.error('Error analyzing sentiment with Anthropic:', error);
    return { score: 0.5 }; // Fallback
  }
}

export async function translateToEnglish(text: string) {
  try {
    if (process.env.ANTHROPIC_API_KEY === undefined) {
      return text;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      system: 'You are a translator. Translate the given text from Sinhala or Singlish to English. If the text is already in English, just return the exact original text. Only output the final translated text and absolutely nothing else.',
      messages: [{ role: 'user', content: text }],
    });
    return response.content[0].type === 'text' ? response.content[0].text.trim() : text;
  } catch(e) {
    console.error('Error translating text:', e);
    return text;
  }
}
