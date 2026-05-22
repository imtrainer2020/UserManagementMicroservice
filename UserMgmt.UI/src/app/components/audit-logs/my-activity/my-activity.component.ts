import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  filterStatus = 'all';

  constructor(
    private logsService: LogsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (!userId || userId <= 0) {
      this.errorMessage = 'Unable to identify current user.';
      this.isLoading = false;
      return;
    }

    this.logsService.getMyActivity(userId).subscribe({
      // We use 'any' here temporarily to safely check for both camelCase and PascalCase
      next: (response: any) => {
        try {
          // 1. Safe extraction (handles both JSON casing styles)
          const isSuccess = response?.isSuccess ?? response?.IsSuccess;
          const data = response?.data ?? response?.Data;
          const message = response?.message ?? response?.Message;

          if (isSuccess && Array.isArray(data)) {
            // 2. Ultra-safe sort (protects against null objects inside the array)
            this.logs = data.sort((a: any, b: any) => {
              const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });

            this.filteredLogs = [...this.logs];
          } else {
            this.errorMessage = message || 'No activity found.';
          }
        } catch (e) {
          console.error('Data parsing error:', e);
          this.errorMessage = 'An error occurred while processing your data.';
        } finally {
          // 3. FINALLY block guarantees the spinner turns off even if a crash happens
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Activity load error:', err);
        this.errorMessage = 'Failed to load activity. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    try {
      let result = [...this.logs];

      if (this.filterStatus === 'success') {
        result = result.filter(l => l && !l.isError);
      } else if (this.filterStatus === 'error') {
        result = result.filter(l => l && l.isError);
      }

      if (this.searchTerm && this.searchTerm.trim()) {
        const term = this.searchTerm.trim().toLowerCase();
        result = result.filter(l =>
          l?.action?.toLowerCase().includes(term) ||
          l?.serviceName?.toLowerCase().includes(term) ||
          (l?.errorMessage || '').toLowerCase().includes(term)
        );
      }

      this.filteredLogs = result;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Filter error:', error);
    }
  }

  get successCount(): number {
    return this.logs.filter(l => l && !l.isError).length;
  }

  get errorCount(): number {
    return this.logs.filter(l => l && l.isError).length;
  }

}
