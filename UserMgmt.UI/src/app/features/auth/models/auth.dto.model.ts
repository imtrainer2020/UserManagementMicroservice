//export interface AuthDto {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  // Add other fields returned by ApiResponse.cs
}