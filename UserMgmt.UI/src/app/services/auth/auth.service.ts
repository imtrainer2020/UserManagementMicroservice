import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, AuthResponse } from '../../models/authdto.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/apiresponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5070/gateway/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/login`, data);
  }

  saveToken(authData: AuthResponse): void {
    localStorage.setItem('jwt_token', authData.token);
    localStorage.setItem('user_role', authData.role);
    localStorage.setItem('user_id', authData.userId.toString());
    localStorage.setItem('user_email', authData.userEmail);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  }
}
