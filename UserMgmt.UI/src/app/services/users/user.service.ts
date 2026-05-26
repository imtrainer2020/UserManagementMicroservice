import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/apiresponse.model';
import { Common } from '../../models/common.model';
import { UserProfileDto } from '../../models/user-profile.model';
import { UserListDto, UserEditDto } from '../../models/user.model';
import { UserProfileService } from '../user-profile/user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authApiUrl = new Common().API_BASE_URL + 'users';

  constructor(private http: HttpClient, private profileService: UserProfileService) { }

  // --- Auth Service Calls (Accounts) ---
  getAllUsers(): Observable<ApiResponse<UserListDto[]>> {
    return this.http.get<ApiResponse<UserListDto[]>>(`${this.authApiUrl}/list`);
  }

  updateUserAuth(payload: UserEditDto): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(`${this.authApiUrl}/update`, payload);
  }

  deleteUser(userId: number): Observable<ApiResponse<number>> {
    // Angular requires 'body' to be passed in the options object for HTTP DELETE
    return this.http.delete<ApiResponse<number>>(`${this.authApiUrl}/delete`, {
      body: { id: userId }
    });
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

}
