import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

const ai = new GoogleGenAI({});

export async function analyzeSentiment(text: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      },
    });

    const label = response.text?.trim() || '50';
    const parsedNum = parseInt(label, 10);
    let score = 0.5;

    if (!isNaN(parsedNum)) {
      score = Math.max(0, Math.min(100, parsedNum)) / 100;
    } else {
      console.warn('AI returned non-number:', label);
    }

    return { score, rawLabel: label };
  } catch (error) {
    console.error('Error analyzing sentiment with Gemini:', error);
    const message = error instanceof Error ? error.message : 'Unknown';
    return { score: 0.5, rawLabel: `Error: ${message}` };
  }
}

export async function translateToEnglish(text: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (e) {
    console.error('Error translating text:', e);
    return text;
  }
}
