export interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
  errors?: string[];
  statusCode: number;
}

export interface BookingData {
  id?: number;
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
}

export interface TestUser {
  username: string;
  password: string;
  email: string;
  token?: string;
}

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface TestStepOptions {
  name: string;
  action: () => Promise<void>;
}

export interface EnvironmentInfo {
  baseUrl: string;
  apiBaseUrl: string;
  browser: string;
  viewport: string;
  timestamp: string;
}

export interface RoomData {
  type: 'Single' | 'Double' | 'Suite';
  title: string;
  price?: number;
  description?: string;
  amenities?: string[];
}

export interface RoomBookingData {
  roomType: string;
  roomTitle: string;
  isReserveButtonVisible: boolean;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  username: string;
  password: string;
  isLoggedIn?: boolean;
}

export interface AdminRoomData {
  id?: number;
  type: 'Single' | 'Double' | 'Suite';
  price: number;
  description?: string;
  amenities?: string[];
  isActive?: boolean;
}

export interface ContactFormData {
  name: string;  // Keep single name field
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormValidation {
  firstname: { required: true };
  lastname: { required: true };
  email: { required: true; format: 'email' };
  phone: { required: true; format: 'phone' };
  subject: { required: true; minLength: 5; maxLength: 100 };
  message: { required: true; minLength: 20; maxLength: 2000 };
}

export interface AdminRoomFormData {
  roomName: string;
  type: 'Single' | 'Twin' | 'Double' | 'Family' | 'Suite';
  accessible: boolean;
  price: number;
  features: {
    wifi: boolean;
    refreshments: boolean;
    tv: boolean;
    safe: boolean;
    radio: boolean;
    views: boolean;
  };
}

export interface RoomCreationValidation {
  roomName: { required: true };
  price: { required: true; minimum: 1 };
}

export interface AdminAuthCredentials {
  username: string;
  password: string;
}

export interface AdminAuthToken {
  token: string;
}

export interface ApiRoomData {
  roomName: string;
  type: string;
  accessible: boolean;
  description: string;
  image: string;
  roomPrice: string;
  features: string[];
}

export interface RoomCreationResponse {
  success: boolean;
}
