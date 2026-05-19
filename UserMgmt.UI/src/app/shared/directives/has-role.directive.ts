import {
  Directive, Input, TemplateRef, ViewContainerRef, effect
} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: false,
})
export class HasRoleDirective {
  @Input('appHasRole') roles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {
    effect(() => {
      const userRole = this.authService.userRole() ?? '';
      this.viewContainer.clear();  // ← always clear first

      if (this.roles.map(r => r.toLowerCase()).some(r => r === userRole)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }

}
