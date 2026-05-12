import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoggedUserDto } from '../../models/authdto.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/apiresponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5070/gateway/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<ApiResponse<LoggedUserDto>> {
    return this.http.post<ApiResponse<LoggedUserDto>>(`${this.apiUrl}/login`, data);
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
}
