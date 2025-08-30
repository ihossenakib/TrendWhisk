import { GoogleGenAI, Type } from "@google/genai";
import type { Idea } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createPrompt = (existingObjects: string[]) => `
You are an expert creative director for a 3D artist specializing in high-end, commercially valuable stock imagery for Adobe Stock. Your goal is to generate unique and diverse ideas for objects that are rare on microstock websites and have high commercial appeal.

**Core Task:**
Generate a list of 70 unique object ideas.

**Uniqueness Constraint (NON-NEGOTIABLE):**
You MUST NOT generate any object titles that are present in the following list of previously generated ideas. Every single idea you provide must be new and unique compared to this list. Repetitive or similar ideas are frustrating and must be avoided.
**Existing ideas to avoid:** [${existingObjects.join(', ')}]

**THEME DIVERSITY (CRITICAL & NON-NEGOTIABLE):**
The final list of 70 ideas MUST be extremely diverse and cover a wide range of commercially valuable, evergreen categories. Do not concentrate on one or two niches. Actively pull ideas from SEVERAL of the following categories to ensure maximum variety.
- **Simple Objects & Daily Life:**
  - **Food:** Individual fruits, vegetables, or simple, elegant food items (e.g., a perfect loaf of bread, a stack of pancakes).
  - **Household Items:** Modern furniture, minimalist decor, kitchen utensils, daily supplies.
  - **Toys & Education:** Simple and elegant kids' toys (e.g., wooden blocks, spinning top), school supplies (e.g., stack of books, art supplies).
- **Cultural & Natural Elements:**
  - **Islamic Culture:** Traditional items like prayer beads (tasbih), geometric patterns, lanterns (fanoos), elegant calligraphy (that doesn't contain specific religious text), traditional patterns.
  - **Nature:** Polished stones, unique leaves, seashells, abstract representations of natural elements.
  - **Abstract & Concepts:** Objects representing concepts like 'peace', 'innovation', or 'health'.
- **Industrial & Commercial Objects:**
  - **Medical & Healthcare:** Stethoscope, microscope, test tubes, surgical tools, modern pill bottle.
  - **Agriculture:** Modern farming drone, stylized wheat sheaf, high-tech soil sensor.
  - **Technology:** Circuit board, server rack, fiber optic cable, minimalist smartphone.
  - **Manufacturing & Industry:** CNC machine bit, industrial robot arm, gears, conveyor belt section.
  - **Food & Beverage Processing:** Stainless steel vat, bottling line component, industrial mixer.
  - **Textiles:** Spool of thread, loom shuttle, fabric swatch stack.
  - **Transportation & Logistics:** Shipping container, aircraft turbine blade, pallet jack.
  - **Financial Services:** Abstract gold coin, secure credit card chip, bull and bear statuettes.
  - **Retail:** Barcode scanner, POS terminal, minimalist shopping bag.


**CONTENT RESTRICTION: ISLAMIC COMPLIANCE (NON-NEGOTIABLE)**
This is the most important rule. ALL generated ideas MUST strictly adhere to Islamic principles.
- **ABSOLUTELY NO LIVING BEINGS:** Do not generate ideas for humans, animals, or any figures that resemble living beings. All objects must be inanimate.
- **ABSOLUTELY NO PROHIBITED ITEMS:** Avoid any objects, themes, or concepts that are prohibited (haram). This includes, but is not limited to:
    - Alcohol (e.g., wine bottles, glasses of wine, beer mugs).
    - Gambling items (e.g., poker chips, dice).
    - Non-halal food items, especially pork.
    - Religious symbols of other faiths.
    - Any indecent, suggestive, or inappropriate objects.
- **EXPLICITLY AVOID NON-ISLAMIC HOLIDAYS:** Do not generate ideas for Christmas, Easter, Halloween, Valentine's Day, or St. Patrick's Day. Focus on secular seasonal events (autumn, winter), national holidays (Thanksgiving, Canada Day), and general celebrations (New Year's).
- Failure to adhere to these content restrictions will result in an invalid output.

**Object Title Rules:**
1.  The "object" title MUST be SEO-optimized for Adobe Stock. It should be descriptive, clear, and contain relevant keywords that a buyer would search for. Think about titles like "Minimalist Ceramic Pumpkin for Autumn Decor" instead of just "Pumpkin".
2.  **Exactly 35 of the 70 titles** MUST end with the phrase ", on transparent background". The other 35 titles should not. Distribute this randomly.

**Keyword Generation Rules:**
1.  For each idea, provide a list of **exactly 25 highly relevant SEO keywords**.
2.  The keywords MUST be ordered from the most commercially valuable and relevant to the least relevant.
3.  The keywords list **MUST ALWAYS include 'png' and 'transparent background'**.

**Strict Image Generation Rules (for the prompt):**
1.  **Background Control:** The object MUST be isolated on a seamless, clean, **pure white OR pure black background**. No other colors, gradients, or textures are allowed.
2.  **Absolute Sharpness:** The image must be hyper-realistic, incredibly detailed, and in **razor-sharp focus from edge to edge**. There should be **absolutely zero blur**.
3.  **No Text or Watermarks:** The image must be **completely free of any text, typography, letters, numbers, logos, or watermarks**.
4.  **Lighting & Composition:** Use 'soft, professional studio lighting' for an elegant look. The composition should be artistic, minimalist, and visually appealing.
5.  **Clean Content:** Strictly no distracting shadows, and absolutely no people or animals.

**Final Output Structure:**
Return your response as a valid JSON array. Each element in the array must be an object with three keys: "object", "prompt", and "keywords".

Example of a single element in the output array:
{
  "object": "Hand-carved Wooden Acorn with Brass Cap, Autumnal Decor, on transparent background",
  "prompt": "Artistic photo of a single, hand-carved wooden acorn with a polished brass cap, resting on a clean surface. Isolated on a seamless, pure white background under soft, professional studio lighting. The image must be hyper-detailed, crystal clear, and in razor-sharp focus, showing the wood grain and metal texture. Minimalist composition, absolutely no blur, no text, no distracting shadows.",
  "keywords": ["acorn", "autumn", "fall decor", "thanksgiving", "wooden toy", "seasonal", "harvest", "minimalist", "isolated", "3d render", "product shot", "e-commerce", "graphic design element", "seasonal graphic", "autumnal", "forest", "nature", "eco-friendly", "handmade", "rustic", "decorative object", "still life", "transparent background", "cutout", "png"]
}
`;

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      object: {
        type: Type.STRING,
        description: 'The SEO-optimized name of the object or concept for Adobe Stock.',
      },
      prompt: {
        type: Type.STRING,
        description: 'The generated prompt for an image creation tool.',
      },
      keywords: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: 'An array of 25 SEO keywords related to the object.',
      }
    },
    required: ["object", "prompt", "keywords"],
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
        temperature: 0.8,
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