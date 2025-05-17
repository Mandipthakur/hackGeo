export interface Monument {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  userName?: string;
}

export interface GeminiResponse {
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
}