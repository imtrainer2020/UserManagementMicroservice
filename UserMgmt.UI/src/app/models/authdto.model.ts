//export interface AuthDto {}

export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}

export interface AuthResponse {
  token: string;
  userId: number;
  userEmail: string;
  role: string;
}
