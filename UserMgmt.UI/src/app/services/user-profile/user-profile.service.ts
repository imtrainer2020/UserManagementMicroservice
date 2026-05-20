import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserProfileDto, UserPasswordChangeDto,
  UserProfileCreateDto, UserProfileUpdateDto
} from '../../models/user-profile.model';
import { ApiResponse } from '../../shared/apiresponse.model';
import { Common } from '../../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = new Common().API_BASE_URL + 'userdetails';

  constructor(private http: HttpClient) { }

  getMyProfile(userId: number): Observable<ApiResponse<UserProfileDto>> {
    return this.http.get<ApiResponse<UserProfileDto>>(`${this.apiUrl}/${userId}`);
  }

  updateMyProfile(payload: UserProfileUpdateDto): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.apiUrl}`, payload);
  }

  changeUserPassword(payload: UserPasswordChangeDto): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.apiUrl}/resetpassword`, payload);
  }

  createMyProfile(payload: UserProfileCreateDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}`, payload);
  }

}
