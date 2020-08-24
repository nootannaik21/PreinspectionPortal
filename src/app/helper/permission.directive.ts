
import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { userService } from 'src/app/service/user.service';
@Directive({
  selector: '[Permission]'
})
export class PermissionDirective {
  userPermissions: any;
  @Input() permission: string;
  @Input() type: string;

  constructor(private el: ElementRef, public renderer: Renderer2, private userService: userService) { }

  ngOnInit() {
    if (this.permission) {
      localStorage.setItem("permission", this.permission);
      if (this.hasPermission()) {
        return;
      }
      else {
        if (this.type == undefined || this.type == null)
          this.renderer.setStyle(this.el.nativeElement.parentElement, 'display', 'none');
        else
          this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
      }
    } else
      return;
  }
  hasPermission() {
    let userType = this.userService.getUserType();
    // var list = Object.keys(this.userPermissions);
    let data = this.permission.split('|');
    var elementsPermission = data.filter(x => x.toLowerCase() == userType.toLowerCase());
    if (elementsPermission.length > 0) {
      return true;
    }
    else {
      return false
    }
  }

}
