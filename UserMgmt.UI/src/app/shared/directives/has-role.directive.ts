import { Directive, Input, OnChanges, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: false,
})
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') roles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userRole = this.authService.getUserRole()?.toLowerCase() ?? '';
    this.viewContainer.clear();  // ← always clear first

    if (this.roles.map(r => r.toLowerCase()).some(r => r === userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
