import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LogsService } from '../../../services/audit-logs/logs.service';
import { AuthService } from '../../../services/auth/auth.service';
import { AuditLogListDto } from '../../../models/audit-log.model';

@Component({
  selector: 'app-logs-dashboard',
  standalone: false,
  templateUrl: './logs-dashboard.component.html',
  styleUrl: './logs-dashboard.component.css',
})
export class LogsDashboardComponent {
  logs: AuditLogListDto[] = [];
  filteredLogs: AuditLogListDto[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  filterStatus = 'all'; // 'all' | 'success' | 'error'
  filterService = 'all'; // dynamic from distinct serviceNames

  serviceNames: string[] = [];

  constructor(
    private logsService: LogsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.logsService.getAllLogs().subscribe({
      next: res => {
        if (res.isSuccess && res.data) {
          this.logs = res.data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.filteredLogs = [...this.logs];
          // Build distinct service name list for filter dropdown
          this.serviceNames = [...new Set(this.logs.map(l => l.serviceName))];
        } else {
          this.errorMessage = res.message ?? 'No logs found.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Logs load error:', err);
        this.errorMessage = 'Failed to load audit logs. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
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

    if (this.filterService !== 'all') {
      result = result.filter(l => l.serviceName === this.filterService);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(l =>
        l.action.toLowerCase().includes(term) ||
        l.serviceName.toLowerCase().includes(term) ||
        (l.userEmail ?? '').toLowerCase().includes(term) ||
        (l.errorMessage ?? '').toLowerCase().includes(term)
      );
    }

    this.filteredLogs = result;
    this.cdr.detectChanges();
  }

  get totalCount(): number { return this.logs.length; }
  get successCount(): number { return this.logs.filter(l => !l.isError).length; }
  get errorCount(): number { return this.logs.filter(l => l.isError).length; }

  get currentUserRole(): string | null {
    return this.authService.getUserRole();
  }

}
