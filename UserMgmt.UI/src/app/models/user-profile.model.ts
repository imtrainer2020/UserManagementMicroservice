export interface UserProfileCreateDto {
  userId: number;
  fullname: string | null;
  photoUrl: string | null;
  address: string | null;
  phone: string | null;
}

export interface UserProfileUpdateDto extends UserProfileCreateDto {
  id: number;
}

export interface UserProfileDto extends UserProfileCreateDto {
  id: number;          
  createdAt: string | null;
  email?: string | null;
  roleName?: string | null;
  isActive?: boolean | null;
}

export interface UserPasswordChangeDto {
  userId: number;
  oldPassword?: string | null;
  newPassword: string | null;
}
