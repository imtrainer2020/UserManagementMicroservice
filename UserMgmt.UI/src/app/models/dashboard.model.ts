export interface DashboardWidget {
  label: string;
  icon: string;         // Bootstrap icon class
  route: string | null; // null = no navigation, just display
  description: string;
}
 
export interface DashboardConfig {
  title: string;
  greeting: string;
  badgeClass: string;   // Bootstrap badge color
  widgets: DashboardWidget[];
}
