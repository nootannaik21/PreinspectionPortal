import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PreinspectionService } from 'src/app/service/preinspection.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {

  constructor(private router:Router, private preInspectionService:PreinspectionService) { }

  ngOnInit() { }
  logOutUser() {
    localStorage.clear();
    this.preInspectionService.removeCurrentUser();
    this.router.navigateByUrl("/login");
  }
}
