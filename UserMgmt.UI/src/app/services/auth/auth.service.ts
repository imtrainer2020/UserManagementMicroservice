import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoggedUserDto, ResetPasswordRequest, SignupRequest } from '../../models/authdto.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/apiresponse.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5070/gateway/auth';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<ApiResponse<LoggedUserDto>> {
    return this.http.post<ApiResponse<LoggedUserDto>>(`${this.apiUrl}/login`, data);
  }

  forgetPassword(email: string): Observable<ApiResponse<boolean>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/forgetpassword`, JSON.stringify(email), { headers });
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}/resetpassword`, data);
  }

  signup(data: SignupRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}/register`, data);
  }

  saveToken(loggedUser: LoggedUserDto): void {
    localStorage.setItem('jwt_token', loggedUser.jwtToken);
    localStorage.setItem('user_role', this.normalizeRole(loggedUser.roleName));
    localStorage.setItem('user_id', loggedUser.userId?.toString());
    localStorage.setItem('user_email', loggedUser.email);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && token !== undefined && token.trim().length > 0; // Returns true if token exists and is not empty
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  }

  getUserRole(): string | null {
    const role = localStorage.getItem('user_role');
    return role ? this.normalizeRole(role):null;
  }

  getUserEmail(): string | null {
    return localStorage.getItem('user_email');;
  }

  private normalizeRole(role: string | null | undefined): string {
    const value = (role ?? '').trim().toLowerCase();
    const roleMap: Record<string, string> = {
      'admin': 'admin',
      'role_admin': 'admin',
      'administrator': 'admin',
      'manager': 'manager',
      'role_manager': 'manager',
      'user': 'user',
      'customer': 'user',
      'role_user': 'user'
    };
    return roleMap[value] ?? value;
}

}
