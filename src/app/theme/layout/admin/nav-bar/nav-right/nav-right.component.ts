import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { PreinspectionService } from 'src/app/service/preinspection.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {

  constructor(private router:Router, private preInspectionService:PreinspectionService,private apiService:ApiService) { }
loggedInUser:string = '';
  ngOnInit() { 
this.loggedInUser = localStorage.getItem('loggedInUser');
  }
  logOutUser() {
    this.apiService.logout();
  }
  changePassword(){
    this.router.navigateByUrl('users/changePassword');
  }
}
