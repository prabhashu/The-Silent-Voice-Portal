import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

function getGenAIModel(modelName: string = 'gemini-2.5-flash') {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });
}

export async function analyzeSentiment(text: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { score: 0.5, rawLabel: 'no-api-key' };
    }

    const model = getGenAIModel('gemini-2.5-flash');
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

    const response = await model.generateContent(prompt);
    const label = response.response.text()?.trim() || '50';
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

    const model = getGenAIModel('gemini-2.5-flash');
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

    const response = await model.generateContent(prompt);
    return response.response.text()?.trim() || text;
  } catch (e) {
    console.error('Error translating text:', e);
    return text;
  }
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export async function generateCounselorChatResponse(
  message: string,
  history: ChatMessage[] = []
): Promise<{ reply: string; isCrisis: boolean }> {
  // Check for critical crisis keywords across English, Sinhala, Singlish, Tamil, Tanglish
  const crisisKeywords = [
    // English
    'suicide', 'kill myself', 'cut myself', 'end my life', 'self harm', 'want to die',
    // Singlish & Sinhala
    'maranna', 'marenna', 'marila', 'kapanawa', 'jeewithe epa', 'jeewath wenna ba',
    'මැරෙන්න', 'කපාගන්න', 'ජීවිතේ එපා', 'දිවි නසා',
    // Tamil & Tanglish
    'tharkolai', 'saaganum', 'uyirai maaykka', 'maranam', 'saaga poren', 'valkka mudiyala',
    'தற்கொலை', 'சாக வேண்டும்', 'சாகணும்', 'உயிரை மாய்க்க'
  ];
  const lowerMsg = message.toLowerCase();
  const isCrisis = crisisKeywords.some((k) => lowerMsg.includes(k) || message.includes(k));

  if (!process.env.GEMINI_API_KEY) {
    // Supportive fallback mode when API key is missing
    let fallbackReply = `I hear you and I am here with you. Take a gentle, deep breath. You are safe here.\n\n`;
    if (isCrisis) {
      fallbackReply += `If you are feeling overwhelmed or having thoughts of harming yourself, please immediately reach out to our confidential 24/7 Lifeline:\n- **1926** (National Mental Health Helpline)\n- **1333** (Sumithrayo Crisis Helpline)\n\nYou are not alone and people care about you deeply.`;
    } else {
      fallbackReply += `Here are a few quick steps you can try right now:\n1. **Box Breathing**: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds.\n2. **Break it down**: Take just the very next small step instead of worrying about the whole problem.\n3. **Reach out**: Talk to a trusted friend, teacher, or counselor.\n\nTell me more about what's going on—I am listening.`;
    }
    return { reply: fallbackReply, isCrisis };
  }

  try {
    const model = getGenAIModel('gemini-2.5-flash');

    // Build context with strict language mirroring and counseling instructions
    const systemPrompt = `You are "The Silent Voice AI Counselor" — an intelligent, empathetic, compassionate, and multilingual school counselor dedicated to students at Pannala National School and youth in Sri Lanka.

CRITICAL LANGUAGE & SCRIPT MIRRORING RULE:
You MUST ALWAYS detect and reply in the EXACT SAME language, dialect, and script that the student uses:
1. **SINGLISH** (Sinhala written in English/Latin letters, e.g., "mata bayai", "stress wadi mokada karanne", "sir mata physics therenne na"):
   -> You MUST reply in natural, warm, conversational **Singlish** (Sinhala words typed in English letters). Do NOT switch to formal English unless they ask in English. Example tone: "Bayawenna epa, mama oyata help karanna innawa. Api balamu meka kohomada solve karanne..."
2. **TAMIL (தமிழ்)** (e.g., "எனக்கு மிகவும் பயமாக இருக்கிறது", "பரீட்சை பயம்"):
   -> You MUST reply in pure, comforting, natural **Tamil (தமிழ்)** script.
3. **TANGLISH** (Tamil written in English/Latin letters, e.g., "enakku bayama irukku", "stress ah irukku enna panrathu", "help pannunga"):
   -> You MUST reply in natural, empathetic **Tanglish** (Tamil words typed in English letters). Example tone: "Kavalapadatheenga, naan ungalukku help panna inga irukken. Namma sernthu ithukku solution kandupidikkalam..."
4. **SINHALA (සිංහල)** (e.g., "මට විභාග බයයි", "මට උදව් කරන්න"):
   -> You MUST reply in fluent, comforting **Sinhala (සිංහල)** script.
5. **ENGLISH** (e.g., "I'm stressed about exams", "I need help with my studies"):
   -> You MUST reply in warm, articulate, encouraging **English**.
6. **OTHER LANGUAGES**:
   -> If the student types in any other language, immediately mirror their language.

Counseling Approach:
- **Tone**: Empathetic, warm, friendly, non-judgmental, calming, and solution-focused.
- **Actionable Steps**: Offer concrete coping techniques (deep breathing 4-4-4, 5-4-3-2-1 grounding, small daily study goals, time management, staying hydrated, taking short breaks).
- **Crisis Handling**: If the student expresses severe distress, self-harm, or suicidal thoughts:
  - Deeply acknowledge their pain with genuine care and validation.
  - Provide immediate confidential Sri Lankan helplines: **1926 (National Mental Health Helpline)** and **1333 (Sumithrayo Helpline)**.
  - Reassure them that their life is precious and they are not alone.
- **Formatting**: Use clean paragraphs, bold key points, and bullet points for readability.`;

    const formattedHistory = history.map((h) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}` }],
        },
        {
          role: 'model',
          parts: [{ text: `Understood. I will strictly mirror the user's language and script — replying in Singlish for Singlish, Tamil (தமிழ்) for Tamil, Tanglish for Tanglish, Sinhala (සිංහල) for Sinhala, and English for English, while providing compassionate, actionable, and safe counseling.` }],
        },
        ...formattedHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text()?.trim() || 'I am here with you. Please feel free to share what is on your mind.';

    return { reply, isCrisis };
  } catch (error) {
    console.error('Error generating counselor response with Gemini:', error);
    return {
      reply: `I hear you and I am here with you. Take a deep breath. If you are going through an urgent crisis, please reach out to **1926** (National Mental Health Helpline) or **1333** (Sumithrayo) anytime. Tell me more about what you are going through.`,
      isCrisis,
    };
  }
}

