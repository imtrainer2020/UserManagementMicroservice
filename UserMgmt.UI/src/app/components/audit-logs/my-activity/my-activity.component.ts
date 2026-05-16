import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../../services/audit-logs/logs.service';
import { AuthService } from '../../../services/auth/auth.service';
import { AuditLogListDto } from '../../../models/audit-log.model';

@Component({
  selector: 'app-my-activity',
  standalone: false,
  templateUrl: './my-activity.component.html',
  styleUrl: './my-activity.component.css'
})
export class MyActivityComponent implements OnInit {

  logs: AuditLogListDto[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private logsService: LogsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'Unable to identify current user.';
      this.isLoading = false;
      return;
    }

    this.logsService.getMyActivity(userId).subscribe({
      next: res => {
        if (res.isSuccess) {
          this.logs = res.data;
        } else {
          this.errorMessage = res.message;
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load activity.';
        this.isLoading = false;
      }
    });
  }
}
