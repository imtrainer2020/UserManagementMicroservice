import { LoggedUserDto } from "./authdto.model";

export interface AuthState {
  token: string | null;
  userId: number | null;
  email: string | null;
  roleName: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
