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
      system: 'Analyze the sentiment of the provided text (which might be in English, Sinhala, or Singlish). Classify it exactly like a product review model into one of these labels: "1 star", "2 stars", "3 stars", "4 stars", or "5 stars". Where "1 star" is extremely negative/concerning, and "5 stars" is extremely positive. Respond with ONLY the label string and nothing else.',
      messages: [{ role: 'user', content: text }],
    });
    
    const label = response.content[0].type === 'text' ? response.content[0].text.trim() : '3 stars';
    
    let score = 0.5; // Neutral default
    
    // Restore exact scoring logic that was used before
    switch (label) {
      case '1 star': score = 0.75; break; // Negative sentiment -> Medium Risk
      case '2 stars': score = 0.50; break;
      case '3 stars': score = 0.35; break;
      case '4 stars': score = 0.15; break;
      case '5 stars': score = 0.05; break; // Extremely positive / low risk
      default:
        if (label.includes('1')) score = 0.75;
        else if (label.includes('2')) score = 0.50;
        else if (label.includes('4')) score = 0.15;
        else if (label.includes('5')) score = 0.05;
        break;
    }
    
    return { score, rawLabel: label };
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
