import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/apiresponse.model';
import { Common } from '../../models/common.model';
import { UserProfileDto, UserPasswordChangeDto } from '../../models/user-profile.model';
import { UserListDto, UserEditDto, UserRoleChangeDto } from '../../models/user.model';
import { UserProfileService } from '../user-profile/user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authApiUrl = new Common().API_BASE_URL + 'auth';

  constructor(private http: HttpClient, private profileService: UserProfileService) { }

  // --- Auth Service Calls (Accounts) ---
  getAllUsers(): Observable<ApiResponse<UserListDto[]>> {
    return this.http.get<ApiResponse<UserListDto[]>>(`${this.authApiUrl}/list`);
  }

  updateUserAuth(payload: UserEditDto): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.authApiUrl}/update`, payload);
  }

  deleteUser(userId: number): Observable<ApiResponse<number>> {
    return this.http.delete<ApiResponse<number>>(`${this.authApiUrl}/delete`, {
      body: { id: userId }
    });
  }

  changeUserRole(payload: UserRoleChangeDto): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.authApiUrl}/resetuserrole`, payload);
  }

  createUser(payload: any): Observable<ApiResponse<number>> {
    // This targets your gateway's auth/register endpoint 
    return this.http.post<ApiResponse<number>>(`${this.authApiUrl}/createuser`, payload);
  }


  // --- User Profile Service Calls ---
  getUserProfile(userId: number): Observable<ApiResponse<UserProfileDto>> {
    return this.profileService.getMyProfile(userId);
  }

  updateUserProfile(formData: FormData): Observable<ApiResponse<number>> {
    return this.profileService.updateMyProfile(formData);
  }

  deleteUserProfile(userId: number): Observable<ApiResponse<number>> {
    return this.profileService.deleteMyProfile(userId);
  }

  adminResetUserPassword(payload: UserPasswordChangeDto): Observable<ApiResponse<number>> {
    return this.profileService.changeUserPassword(payload);
  }

}
