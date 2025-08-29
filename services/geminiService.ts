import { GoogleGenAI, Type } from "@google/genai";
import type { Idea } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createPrompt = (existingObjects: string[]) => `
You are an expert creative director for a 3D artist specializing in high-end, commercially valuable stock imagery. Your goal is to generate unique and diverse ideas for objects that are rare on microstock websites.

**Core Task:**
Generate a list of 6 unique object ideas. These objects MUST NOT be in the following list of already generated objects:
[${existingObjects.join(', ')}]

**Object Categories to Explore:**
Your suggestions should be diverse. Draw from a wide range of categories, including but not limited to:
*   **Exotic Fruits & Flora:** Rare fruits, intricate flowers, or unique trees from around the world.
*   **Cultural Artifacts:** Traditional tools, crafts, or daily objects from diverse global cultures (e.g., a Japanese matcha whisk, a Moroccan tagine, a Scandinavian wooden butter knife).
*   **Modern Gadgets & Tools:** Sleek, minimalist tech or specialized professional tools.
*   **Everyday Objects Reimagined:** Common daily items presented with an exceptionally artistic or unique perspective.

**Crucially, all objects must be inanimate. DO NOT include humans or animals.**

**Output Format & Prompt Style:**
For each object, create a specific, detailed prompt for an image generation AI. The prompt must produce a clean, aesthetic, and high-quality image.

**Key Prompt Requirements:**
1.  **Clarity & Detail:** The image must be hyper-detailed, crystal clear, and in razor-sharp focus. **Absolutely no blur.**
2.  **Isolation:** The object must be isolated on a seamless, clean background. Usually white, but you can occasionally suggest a soft, complementary pastel color for a more vibrant aesthetic.
3.  **Lighting:** Describe the lighting as 'soft, professional studio lighting' to create an elegant look.
4.  **Composition:** The composition should be artistic, minimalist, and visually appealing.
5.  **No Distractions:** Strictly no text, no distracting shadows, no people or animals.
6.  **Varying Styles:** While the core is minimalist, you can occasionally introduce a pop of color or a more vibrant feel, especially for objects like fruits or cultural artifacts.

**Final Output Structure:**
Return your response as a valid JSON array. Each element in the array must be an object with two keys: "object" and "prompt".

Example of a single element in the output array:
{
  "object": "Dragon Fruit (Pitaya)",
  "prompt": "Vibrant, artistic photo of a perfectly sliced Dragon Fruit (Pitaya), showcasing its vivid magenta skin and black-speckled white flesh. Isolated on a seamless, pure white background under soft, professional studio lighting. The image must be hyper-detailed, crystal clear, and in razor-sharp focus. Minimalist composition, no blur, no text, no shadows."
}
`;

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      object: {
        type: Type.STRING,
        description: 'The name of the object or concept.',
      },
      prompt: {
        type: Type.STRING,
        description: 'The generated prompt for an image creation tool.',
      },
    },
    required: ["object", "prompt"],
  },
};

export async function generateTrendingIdeas(existingObjects: string[] = []): Promise<Idea[]> {
  try {
    const prompt = createPrompt(existingObjects);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.9,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("The AI model returned an empty response. Please try again.");
    }
    const ideas: Idea[] = JSON.parse(jsonText);
    return ideas;
  } catch (error) {
    console.error("Error generating ideas:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the AI's response. The data might be malformed. Please try again.");
    }
    throw new Error("Failed to generate ideas. The AI model might be busy or an error occurred. Please try again in a moment.");
  }
}