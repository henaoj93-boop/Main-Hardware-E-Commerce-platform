import { GoogleGenAI } from "@google/genai";
import { HeroConfig, PageWidget, GlobalTheme } from "../types";

// Helper to check if API key is selected for paid features (Video/High-Res Image)
export const checkApiKey = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const aistudio = (window as any).aistudio;
    if (await aistudio.hasSelectedApiKey()) {
      return true;
    }
    try {
      await aistudio.openSelectKey();
      return await aistudio.hasSelectedApiKey();
    } catch (error) {
      console.error("API Key selection cancelled or failed", error);
      return false;
    }
  }
  return true; // Fallback for environments where window.aistudio isn't available
};

const SYSTEM_INSTRUCTION = `
You are "Hank", the veteran hardware expert and virtual assistant for Main Hardware & Pool Discount Supply located in Wilkes-Barre, PA.
Your tone is friendly, helpful, experienced, and slightly "old-school" but efficient.

Store Details:
- Address: 642 South Main St. Wilkes-Barre PA 18701
- Phone: 570-823-3938
- Hours: Mon-Sat 8am to 6pm, Sunday 9am to 4pm.

You help customers with:
1. Home repair advice (Hardware department).
2. Pool maintenance tips (chemicals, opening/closing).
3. Christmas decorating ideas (Christmasland).
4. Bulk/Commercial order inquiries.

Refer to the store's specific offerings:
- "Christmasland" is open all year.
- We have "Veteran-level customer service" (no robots, but you are a helpful AI assistant bridging the gap).
- We are a "hometown powerhouse".
- We offer flexible Layaway plans specifically for pool orders.

Keep answers concise (under 100 words unless complex).
If asked about pre-orders, direct them to the Pre-Order Drop Zone on the website.
`;

export const sendMessageToGemini = async (message: string, history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';
    
    // Create a chat session
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creative and factual
      },
      history: history
    });

    const response = await chat.sendMessage({ message });
    
    return response.text || "I'm sorry, I couldn't quite catch that. Could you rephrase your question about our hardware or pool supplies?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Sorry, I'm having trouble checking the back inventory right now. Please try again later.");
  }
};

export const generateHolidayVideo = async (): Promise<string> => {
  // Ensure we have a paid API key for Veo
  const hasKey = await checkApiKey();
  if (!hasKey) {
    throw new Error("API Key selection required for video generation.");
  }

  // Create a new instance with the potentially updated key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Create a vibrant, cartoon-style animated video.
    
    Scene Sequence:
    1. Exterior Roof: Santa Claus lands his sleigh with reindeer on the snowy roof of "Main Hardware", a classic red brick building.
    2. Entry: Santa slides down the chimney.
    3. Christmasland (Upstairs): Santa lands inside and the room magically transforms into "Christmasland", filled with lit Christmas trees, snowman inflatables, and glowing decorations.
    4. Walkthrough: Santa walks through the aisles, admiring the lights and holiday displays.
    5. Downstairs: Santa walks down the stairs to the main hardware floor.
    6. Hardware Section: He passes a display of winter hats, gloves, and a large stack of "Rock Salt" bags (Winter supplies).
    7. Coffee Break: Santa ends his tour at the "Quick Joe" coffee station, holding a cup of coffee and smiling.
    
    Style: 3D Cartoon animation, festive atmosphere, magical lighting, cheerful and welcoming.
  `;

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("No video URI returned");
    }

    // Append API key to the URI for playback
    return `${videoUri}&key=${process.env.API_KEY}`;
  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};

export const generateImage = async (dept: string): Promise<string> => {
  const hasKey = await checkApiKey();
  if (!hasKey) {
    throw new Error("API Key selection required for image generation.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-image-preview';

  let prompt = "A high quality, photorealistic, cinematic wide shot of ";
  switch (dept) {
    case 'HARDWARE': 
      prompt += "a neatly organized hardware store aisle stocked with tools, power drills, and equipment, warm lighting, professional atmosphere."; 
      break;
    case 'POOL': 
      prompt += "a sparkling clear blue swimming pool in a beautiful backyard setting with summer vibes, pool cleaning supplies nearby."; 
      break;
    case 'CHRISTMAS': 
      prompt += "a magical christmas store interior filled with twinkling lights, decorated christmas trees, ornaments, and festive holiday decorations."; 
      break;
    case 'COMMERCIAL': 
      prompt += "a clean and professional commercial warehouse supply facility with pallets of industrial goods and a forklift in the background."; 
      break;
    default: 
      prompt += "a hardware and pool supply store interior.";
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from API");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

// --- ADMIN INTELLIGENCE ---

export type AdminActionType = 'UPDATE_HERO' | 'CREATE_WIDGET' | 'UPDATE_THEME';

export interface AdminAction {
  type: AdminActionType;
  explanation: string;
  data: any;
}

export const generateAdminAction = async (userPrompt: string, context: { department: string, currentHero: HeroConfig }): Promise<AdminAction> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const systemInstruction = `
    You are an AI Site Administrator for Main Hardware.
    Your job is to interpret natural language commands from the admin and generate structured JSON configuration updates for the website.
    
    You support 3 types of actions:
    1. UPDATE_HERO: Updates the main landing page hero section.
    2. CREATE_WIDGET: Generates a new content widget for a department page.
    3. UPDATE_THEME: Updates global site colors or background.

    CONTEXT:
    Current Department: ${context.department}
    Current Hero Title: ${context.currentHero.title}

    WIDGET TYPES AVAILABLE:
    - HERO (Large banner)
    - TEXT_BLOCK (Simple text)
    - SPLIT_CONTENT (Image + Text side by side)
    - PRODUCT_SPOTLIGHT (For ecommerce sales, has price, badge, image)
    - VIDEO_EMBED
    
    RESPONSE FORMAT:
    You must return a raw JSON object (no markdown formatting).
    {
      "type": "UPDATE_HERO" | "CREATE_WIDGET" | "UPDATE_THEME",
      "explanation": "Short description of what you did.",
      "data": { ... } // The actual config object
    }

    EXAMPLES:
    User: "Change the home banner to say Summer Sale is here"
    Response: { "type": "UPDATE_HERO", "explanation": "Updated hero title.", "data": { "title": "Summer Sale is Here", "subtitle": "Get ready for the heat.", "buttonText": "Shop Now" } }

    User: "Add a sale section for Chlorine Tablets $99"
    Response: { 
      "type": "CREATE_WIDGET", 
      "explanation": "Created a product spotlight for Chlorine.", 
      "data": { 
         "type": "PRODUCT_SPOTLIGHT",
         "content": { "title": "3-Inch Chlorine Tablets", "text": "Keep your pool crystal clear all summer.", "price": "$129.99", "salePrice": "$99.00", "badgeText": "Hot Deal", "buttonText": "Add to Cart" },
         "style": { "backgroundColor": "#ffffff", "padding": "medium" }
      } 
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: userPrompt }] },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AdminAction;
  } catch (error) {
    console.error("Admin AI Error:", error);
    throw new Error("Failed to interpret admin command.");
  }
};