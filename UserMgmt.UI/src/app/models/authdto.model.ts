//export interface AuthDto {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoggedUserDto {
  jwtToken: string;
  userId: number;
  email: string;
  roleName: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface UserRoleChangeDto {
  userId: number;
  oldRoleId?: number;
  newRoleId: number;
}
