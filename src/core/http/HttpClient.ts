import { env } from '../config/env';

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = env.supabaseUrl;
    this.apiKey = env.supabaseKey;

    if (!this.baseUrl || !this.apiKey) {
      console.error('Missing Supabase credentials in environment configuration');
    }
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Prefer': 'return=representation'
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/rest/v1/${endpoint}`, {
      method: 'GET',
      headers: this.headers,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/rest/v1/${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/rest/v1/${endpoint}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = { message: response.statusText };
      }
      throw new Error(errorBody.message || 'HTTP Request failed');
    }
    
    // In some cases like 204 No Content, there is no body
    const text = await response.text();
    return text ? JSON.parse(text) : {} as T;
  }
}

export const httpClient = new HttpClient();
