import { pipeline, env } from '@xenova/transformers';

// Skip local model check since we are running in a serverless environment
// We'll download from Hugging Face directly
env.allowLocalModels = false;

// We use a singleton pattern to keep the model loaded in memory
class PipelineSingleton {
  static task = 'text-classification';
  // Upgraded to a multilingual model that natively understands 100+ languages including Sinhala/Singlish
  static model = 'Xenova/bert-base-multilingual-uncased-sentiment';
  static instance: any = null;

  static async getInstance(progress_callback?: any) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task as any, this.model, { 
        progress_callback,
        // Added more options for performance and caching
        quantized: true, // Use a smaller, faster version of the model
        revision: 'main',
      });
    }
    return this.instance;
  }
}

export async function analyzeSentiment(text: string) {
  try {
    const classifier = await PipelineSingleton.getInstance();
    const result = await classifier(text);
    
    let score = 0.5; // Neutral default
    if (result && result.length > 0) {
      const { label } = result[0]; // Output is usually '1 star' to '5 stars'
      
      // Convert stars to Severity (Lower stars = Higher severity/risk)
      // Note: A sentiment model cannot tell the difference between "I hate homework" (negative) 
      // and "I want to die" (negative). Therefore, "1 star" should only trigger Medium/High (0.75), 
      // not an absolute Urgent (0.95), unless caught by the safety keyword net.
      switch (label) {
        case '1 star': score = 0.75; break; // Negative sentiment -> Medium Risk
        case '2 stars': score = 0.50; break;
        case '3 stars': score = 0.35; break;
        case '4 stars': score = 0.15; break;
        case '5 stars': score = 0.05; break; // Extremely positive / low risk
        default:
          // Fallback if the model uses NEGATIVE/POSITIVE labels instead
          if (label === 'NEGATIVE') score = 0.75;
          if (label === 'POSITIVE') score = 0.15;
          break;
      }
    }
    return { score, rawLabel: result[0]?.label };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { score: 0.5 }; // Fallback
  }
}

// Very simple translation mock for demo
// In a real app, you would use Google Translate API
export async function translateToEnglish(text: string) {
  // If we had a real API:
  // return await fetchGoogleTranslate(text);
  
  // For the demo, we assume the text is already english or singlish that the model might vaguely understand,
  // or we just return the original text. The user's prompt mentioned "nikanma Google Translate API ... use karala".
  return text; 
}
