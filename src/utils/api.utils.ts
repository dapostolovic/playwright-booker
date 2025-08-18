import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../config/test.config';
import { ApiResponse, ApiRequestOptions, AuthCredentials, AuthToken, BookingData, AdminAuthCredentials, AdminAuthToken, ApiRoomData, RoomCreationResponse } from '../types/common.types';

export class ApiUtils {
  private client: AxiosInstance;
  private authToken?: string;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || config.apiBaseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token for future requests
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = undefined;
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, this.buildRequestConfig(options));
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, this.buildRequestConfig(options));
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, this.buildRequestConfig(options));
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch(url, data, this.buildRequestConfig(options));
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, this.buildRequestConfig(options));
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Authenticate user and get token
   */
  async authenticate(credentials: AuthCredentials): Promise<ApiResponse<AuthToken>> {
    const response = await this.post<AuthToken>('/auth', credentials);
    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: Omit<BookingData, 'id'>): Promise<ApiResponse<BookingData>> {
    return this.post<BookingData>('/booking', bookingData);
  }

  /**
   * Get booking by ID
   */
  async getBooking(id: number): Promise<ApiResponse<BookingData>> {
    return this.get<BookingData>(`/booking/${id}`);
  }

  /**
   * Get all bookings
   */
  async getAllBookings(): Promise<ApiResponse<BookingData[]>> {
    return this.get<BookingData[]>('/booking');
  }

  /**
   * Update booking
   */
  async updateBooking(id: number, bookingData: Partial<BookingData>): Promise<ApiResponse<BookingData>> {
    return this.put<BookingData>(`/booking/${id}`, bookingData);
  }

  /**
   * Partially update booking
   */
  async partialUpdateBooking(id: number, bookingData: Partial<BookingData>): Promise<ApiResponse<BookingData>> {
    return this.patch<BookingData>(`/booking/${id}`, bookingData);
  }

  /**
   * Delete booking
   */
  async deleteBooking(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/booking/${id}`);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.get<{ status: string }>('/ping');
  }

  /**
   * Admin authentication to get admin token
   */
  async authenticateAdmin(credentials: AdminAuthCredentials): Promise<ApiResponse<AdminAuthToken>> {
    try {
      console.log('🔍 Sending request to: http://localhost/api/auth/login');
      console.log('🔍 Request body:', JSON.stringify(credentials));
      
      const response = await fetch('http://localhost/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      console.log(`🔍 Fetch Response Status: ${response.status}`);
      console.log(`🔍 Content-Type:`, response.headers.get('content-type'));
      
      let responseData;
      const responseText = await response.text();
      console.log(`🔍 Raw Response Text:`, responseText);
      
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🔍 JSON Parse Error:', parseError);
        responseData = { error: 'Invalid JSON response', rawText: responseText };
      }

      const formattedResponse: ApiResponse<AdminAuthToken> = {
        data: responseData,
        success: response.status >= 200 && response.status < 300,
        statusCode: response.status,
        message: response.statusText
      };
      
      if (formattedResponse.success && formattedResponse.data?.token) {
        this.setAuthToken(formattedResponse.data.token);
      }
      
      return formattedResponse;
    } catch (error) {
      console.error('🔍 Fetch Error:', error);
      return {
        success: false,
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Unknown error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Create room via API (requires admin authentication)
   */
  async createRoomViaApi(roomData?: ApiRoomData): Promise<ApiResponse<RoomCreationResponse>> {
    // Default room data as specified in requirements
    const defaultRoomData: ApiRoomData = {
      roomName: "105",
      type: "Suite",
      accessible: true,
      description: "Please enter a description for this room",
      image: "https://www.gentinghotel.co.uk/_next/image?url=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fstaticgh.gentinghotel.co.uk%2Fuploads%2Ffeed-cards%2F_750x750_crop_center-center_none%2FRW_Hotel_Finals_GentingSuiteTable_sqr.jpg&w=1080&q=75",
      roomPrice: "999",
      features: [
        "WiFi",
        "TV", 
        "Radio",
        "Refreshments",
        "Safe",
        "Views"
      ]
    };

    const dataToSend = roomData || defaultRoomData;
    return this.post<RoomCreationResponse>('/room', dataToSend);
  }

  /**
   * Complete admin room creation workflow (authenticate + create room)
   */
  async createRoomWithAdminAuth(
    adminCredentials: AdminAuthCredentials = { username: 'admin', password: 'password' },
    roomData?: ApiRoomData
  ): Promise<ApiResponse<RoomCreationResponse>> {
    
    // Step 1: Authenticate admin
    const authResponse = await this.authenticateAdmin(adminCredentials);
    
    if (!authResponse.success) {
      return {
        success: false,
        statusCode: authResponse.statusCode,
        message: 'Admin authentication failed',
        errors: authResponse.errors
      };
    }

    // Step 2: Create room with the authenticated token
    const roomResponse = await this.createRoomViaApi(roomData);
    
    return roomResponse;
  }

  private buildRequestConfig(options?: ApiRequestOptions): AxiosRequestConfig {
    return {
      headers: options?.headers,
      timeout: options?.timeout || config.api.timeout
    };
  }

  private formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      success: response.status >= 200 && response.status < 300,
      statusCode: response.status,
      message: response.statusText
    };
  }

  private handleError(error: any): ApiResponse<any> {
    const response = error.response;
    return {
      success: false,
      statusCode: response?.status || 500,
      message: response?.statusText || error.message,
      errors: response?.data?.errors || [error.message]
    };
  }

  /**
   * Retry a request with exponential backoff
   */
  async retryRequest<T>(
    requestFn: () => Promise<ApiResponse<T>>,
    maxRetries: number = config.api.maxRetries
  ): Promise<ApiResponse<T>> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await requestFn();
        if (response.success) {
          return response;
        }
        lastError = response;
      } catch (error) {
        lastError = error;
      }

      if (attempt < maxRetries) {
        const delay = config.api.retryDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Retrying request in ${delay}ms (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
