//export interface AuthDto {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoggedUserDto {
  jwttoken: string;
  userId: number;
  userEmail: string;
  role: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}
