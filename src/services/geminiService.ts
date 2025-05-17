import { GeminiResponse } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const identifyMonument = async (imageBase64: string): Promise<GeminiResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    const base64Content = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Identify this Nepalese temple or monument and provide its exact location. Return the name, a short historical or cultural description, and its precise latitude and longitude coordinates. If you can identify the monument but are not completely certain about the coordinates, provide your best estimate based on its known location. Format the response as JSON with fields: name (string), description (string), latitude (number), longitude (number). The coordinates should be for the monument's actual location, not where the photo was taken."
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
        temperature: 0.2,
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
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error('Invalid response format from Gemini API');
    }

    try {
      let jsonStr = textResponse;
      const jsonMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1];
      }
      
      const parsedResponse = JSON.parse(jsonStr);
      
      // Ensure we have coordinates for the actual monument location
      if (!parsedResponse.latitude || !parsedResponse.longitude) {
        throw new Error('Monument coordinates not found');
      }
      
      return {
        name: parsedResponse.name || 'Unknown Monument',
        description: parsedResponse.description || 'No description available',
        latitude: parsedResponse.latitude,
        longitude: parsedResponse.longitude,
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Could not determine the monument\'s location. Please try again with a clearer image.');
    }
  } catch (error) {
    console.error('Error in identifyMonument:', error);
    return {
      name: 'Unable to identify',
      description: 'Could not identify the monument or determine its location. Please try again with a clearer image of a Nepalese monument.',
      latitude: 27.7172, // Default to Kathmandu
      longitude: 85.3240,
    };
  }
};