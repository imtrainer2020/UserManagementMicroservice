export interface AuditLogListDto {
  userId: number | null;
  userEmail: string | null;
  action: string;
  serviceName: string;
  isError: boolean;
  errorMessage: string | null;
  createdAt: string;   // ISO date string from API
}
