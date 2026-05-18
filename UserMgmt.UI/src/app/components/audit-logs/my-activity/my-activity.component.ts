import { Component, OnInit, computed } from '@angular/core';
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
  filteredLogs: AuditLogListDto[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  filterStatus = 'all'; // 'all' | 'success' | 'error'

  constructor(
    private logsService: LogsService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (!userId || userId <= 0) {
      this.errorMessage = 'Unable to identify current user.';
      this.isLoading = false;
      return;
    }

    this.logsService.getMyActivity(userId).subscribe({
      next: res => {
        if (res.isSuccess && res.data) {
          this.logs = res.data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.filteredLogs = [...this.logs];
        } else {
          this.errorMessage = res.message ?? 'No activity found.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Activity load error:', err);
        this.errorMessage = 'Failed to load activity. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.logs];

    if (this.filterStatus === 'success') {
      result = result.filter(l => !l.isError);
    } else if (this.filterStatus === 'error') {
      result = result.filter(l => l.isError);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(l =>
        l.action.toLowerCase().includes(term) ||
        l.serviceName.toLowerCase().includes(term) ||
        (l.errorMessage ?? '').toLowerCase().includes(term)
      );
    }

    this.filteredLogs = result;
  }

  get successCount(): number {
    return this.logs.filter(l => !l.isError).length;
  }
  get errorCount(): number {
    return this.logs.filter(l => l.isError).length;
  }

}
