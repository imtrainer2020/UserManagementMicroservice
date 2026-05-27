export interface UserListDto {
  id: number;
  email: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserEditDto {
  id: number;
  email: string;
  roleId: number;
  isActive: boolean;
}

export interface UserRoleChangeDto {
  id: number;
  email: string;
  newRoleId: number;
}
