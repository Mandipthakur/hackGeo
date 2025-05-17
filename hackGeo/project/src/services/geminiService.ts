import { GeminiResponse } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const identifyMonument = async (imageBase64: string): Promise<GeminiResponse> => {
  try {
    // Ensure the API key is available
    if (!API_KEY) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    // Strip the data URL prefix if present
    const base64Content = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Identify this temple or monument. It's most likely located in Kathmandu or Dhulikhel, Nepal. Return the name and a short historical or cultural description. If you can identify it, also return the approximate latitude and longitude. Format the response as JSON with fields: name (string), description (string), latitude (number, optional), longitude (number, optional)."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Content
              }
            }
          ]
        }
      ],
      generation_config: {
        temperature: 0.4,
        top_p: 0.95,
        response_mime_type: "application/json"
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Parse the response text as JSON (Gemini returns text that contains JSON)
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error('Invalid response format from Gemini API');
    }

    // Extract JSON from the response text
    try {
      // The response might be a JSON string or might contain markdown code blocks
      let jsonStr = textResponse;
      
      // Check if response is wrapped in markdown code blocks ```json ... ```
      const jsonMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1];
      }
      
      const parsedResponse = JSON.parse(jsonStr);
      
      return {
        name: parsedResponse.name || 'Unknown Monument',
        description: parsedResponse.description || 'No description available',
        latitude: parsedResponse.latitude,
        longitude: parsedResponse.longitude,
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      
      // Fallback: If JSON parsing fails, extract information using regex
      const nameMatch = textResponse.match(/name["\s:]+(.*?)[\n",]/i);
      const descMatch = textResponse.match(/description["\s:]+(.*?)[\n",}]/i);
      
      return {
        name: nameMatch?.[1]?.trim() || 'Unknown Monument',
        description: descMatch?.[1]?.trim() || 'No description available',
      };
    }
  } catch (error) {
    console.error('Error in identifyMonument:', error);
    return {
      name: 'Unable to identify',
      description: 'There was an error processing the image. Please try again with a clearer image of the monument.',
    };
  }
};