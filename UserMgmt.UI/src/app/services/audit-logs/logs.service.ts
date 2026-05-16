import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/apiresponse.model';
import { HttpHeaders } from '@angular/common/http';
import { AuditLogListDto } from '../../models/audit-log.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private apiUrl = 'http://localhost:5070/gateway/auditlogs';
  constructor(private http: HttpClient, private authService: AuthService) { }

  getMyActivity(userId: number): Observable<ApiResponse<AuditLogListDto[]>> {
    return this.http.get<ApiResponse<AuditLogListDto[]>>(`${this.apiUrl}/user/${userId}`);
  }

  getAllLogs(): Observable<ApiResponse<AuditLogListDto[]>> {
    return this.http.get<ApiResponse<AuditLogListDto[]>>(`${this.apiUrl}`);
  }

}
