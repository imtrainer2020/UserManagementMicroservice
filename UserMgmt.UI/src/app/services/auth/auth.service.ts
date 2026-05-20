import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { LoginRequest, LoggedUserDto, ResetPasswordRequest, SignupRequest, UserRoleChangeDto } from '../../models/authdto.model';
import { Common } from '../../models/common.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/apiresponse.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = new Common().API_BASE_URL + 'auth';

  private _currentUser = signal<LoggedUserDto | null>(this.loadUserFromStorage());
  readonly currentUser = this._currentUser.asReadonly();

  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly userRole = computed(() => this.normalizeRole(this.currentUser()?.roleName) ?? 'user');
  readonly userEmail = computed(() => this.currentUser()?.email ?? '');
  readonly userId = computed(() => this.currentUser()?.userId);

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<ApiResponse<LoggedUserDto>> {
    return this.http.post<ApiResponse<LoggedUserDto>>(`${this.apiUrl}/login`, data);
  }

  forgetPassword(email: string): Observable<ApiResponse<boolean>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/forgetpassword?email=${email}`,);
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.apiUrl}/resetpassword`, data);
  }

  signup(data: SignupRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}/register`, data);
  }

  changeUserRole(data: UserRoleChangeDto): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.apiUrl}/resetuserrole`, data);
  }

  saveToken(loggedUser: LoggedUserDto): void {
    localStorage.setItem('jwt_token', loggedUser.jwtToken);
    localStorage.setItem('user_role', this.normalizeRole(loggedUser.roleName));
    localStorage.setItem('user_id', loggedUser.userId?.toString());
    localStorage.setItem('user_email', loggedUser.email);
    this._currentUser.set(loggedUser);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }
  getUserId(): number | null {
    return Number(localStorage.getItem('user_id'));
  }
  getUserRole(): string | null {
    const role = localStorage.getItem('user_role');
    return role ? this.normalizeRole(role) : null;
  }

  loadUserFromStorage(): LoggedUserDto | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return {
      jwtToken: token,
      email: this.getUserEmail(),
      userId: this.getUserId(),
      roleName: this.getUserRole()
    } as LoggedUserDto;
  }

  // isLoggedIn(): boolean {
  //   const token = this.getToken();
  //   return !!token && token !== undefined && token.trim().length > 0; // Returns true if token exists and is not empty
  // }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    this._currentUser.set(null);
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
