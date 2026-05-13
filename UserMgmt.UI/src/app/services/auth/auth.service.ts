import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoggedUserDto, ResetPasswordRequest } from '../../models/authdto.model';
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
    console.log(email);
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/forgetpassword`, JSON.stringify(email), { headers });
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}/resetpassword`, data);
  }

  saveToken(loggedUser: LoggedUserDto): void {
    localStorage.setItem('jwt_token', loggedUser.jwttoken);
    localStorage.setItem('user_role', loggedUser.role);
    localStorage.setItem('user_id', loggedUser.userId?.toString());
    localStorage.setItem('user_email', loggedUser.userEmail);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  }

  // 1. Helper to decode the JWT payload
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      // base64 decode
      const decodedJson = atob(payload);
      return JSON.parse(decodedJson);
    } catch (e) {
      return null;
    }
  }

  // 2. Helper to get the user's role
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    // .NET often uses this long URL schema for roles, or simply 'role'
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded['role'] || null;
  }

}
