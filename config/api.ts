import env from "@/config/env";

export const API_URL = env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export default async function apiRequest<T = any>( endpoint: string, options: RequestInit = {} ): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('sports_travel_token');

  const headers: Record<string, string> = {'Content-Type': 'application/json'};

  // Merge additional headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}