import {Component, HostListener, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userActivity;
  userInactive: Subject<any> = new Subject();
  constructor(private router: Router) { 
    this.setTimeout();
    this.userInactive.subscribe(() => 
    {
      this.router.navigateByUrl("/login");
    });
  }

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 36000000);
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
}
