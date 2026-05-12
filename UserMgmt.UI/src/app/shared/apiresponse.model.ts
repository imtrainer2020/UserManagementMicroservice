export class ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T | null;

  constructor(isSuccess: boolean, message: string, data: T | null) {
    this.isSuccess = isSuccess;
    this.message = message;
    this.data = data;
  }
}
