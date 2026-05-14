import { Directive, Input, OnChanges, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: false,
})
export class HasRoleDirective implements OnInit, OnChanges {
  @Input() appHasRole: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.updateView();
  }

  ngOnChanges() {
    this.updateView();
  }

  private updateView() {
    const userRole = this.authService.getUserRole()?.toLowerCase() ?? '';
    const allowed = this.appHasRole.map(role => role.toLowerCase()).includes(userRole);

    if (allowed) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
