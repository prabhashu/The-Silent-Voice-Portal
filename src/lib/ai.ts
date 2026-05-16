import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || "dummy-key";
const genAI = new GoogleGenerativeAI(apiKey);

// Disable safety blocks so the AI can actually analyze reports about bullying/violence
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export async function analyzeSentiment(text: string) {
  try {
    // If we don't have a real API key configured, return fallback
    if (process.env.GEMINI_API_KEY === undefined) {
      console.warn("GEMINI_API_KEY is missing. Returning neutral score.");
      return { score: 0.5, rawLabel: 'no-api-key' };
    }

    // Use Gemini 1.5 Flash for ultra-fast, cheap text analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    
    const prompt = `Analyze the sentiment of the provided text (which might be in English, Sinhala, or Singlish). Classify it exactly like a product review model into one of these labels: "1 star", "2 stars", "3 stars", "4 stars", or "5 stars". Where "1 star" is extremely negative/concerning, and "5 stars" is extremely positive. Respond with ONLY the label string and nothing else.\n\nText: ${text}`;
    
    const result = await model.generateContent(prompt);
    const label = result.response.text().trim();
    
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
  } catch (error) {
    console.error('Error analyzing sentiment with Gemini:', error);
    return { score: 0.5 }; // Fallback
  }
}

export async function translateToEnglish(text: string) {
  try {
    if (process.env.GEMINI_API_KEY === undefined) {
      return text;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    const prompt = `You are a translator. Translate the given text from Sinhala or Singlish to English. If the text is already in English, just return the exact original text. Only output the final translated text and absolutely nothing else.\n\nText: ${text}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch(e) {
    console.error('Error translating text:', e);
    return text;
  }
}
