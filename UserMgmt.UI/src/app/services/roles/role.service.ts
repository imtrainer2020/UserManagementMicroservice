import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/apiresponse.model';
import { Common } from '../../models/common.model';
import { RoleDto, ManageRolesDto } from '../../models/roles.model'; 

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = new Common().API_BASE_URL + 'roles';

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<ApiResponse<RoleDto[]>> {
    return this.http.get<ApiResponse<RoleDto[]>>(`${this.apiUrl}`);
  }

  getRoleById(id: number): Observable<ApiResponse<RoleDto>> {
    return this.http.get<ApiResponse<RoleDto>>(`${this.apiUrl}/${id}`);
  }

  createRole(payload: ManageRolesDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}`, payload);
  }

  updateRole(payload: RoleDto): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.apiUrl}`, payload);
  }

  deleteRole(id: number): Observable<ApiResponse<number>> {
    return this.http.delete<ApiResponse<number>>(`${this.apiUrl}/${id}`);
  }

}
