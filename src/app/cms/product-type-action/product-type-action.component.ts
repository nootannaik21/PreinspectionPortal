import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { InspectionSeriveService } from 'src/app/service/inspection-serive.service';

@Component({
  selector: 'app-product-type-action',
  templateUrl: './product-type-action.component.html',
  styleUrls: ['./product-type-action.component.scss']
})
export class ProductTypeActionComponent implements OnInit {
  title: string;
  productTypeData:any={};
  addEditProductTypeForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder,private inspectionServce:InspectionSeriveService,private alertService:AlertService,private router:Router) { }

  ngOnInit(): void {
    this.addEditProductTypeForm = this.formBuilder.group({
      type: ['', [Validators.required, Validators.pattern('^([a-zA-Z0-9 ])+$')]]
    });
    if (localStorage.getItem('producttypeid')) {
      this.title = "Update Product Type";
      this.inspectionServce.getProductTypeById(localStorage.getItem('producttypeid')).subscribe(
        data => {
          var res:any=JSON.stringify(data);
        this.productTypeData=JSON.parse(res);
        },
        err => { });
    }
    else {
    this.title = "Add Product Type";
    this.productTypeData = {};    
  }
  }
  get f() { return this.addEditProductTypeForm.controls; }
  onSubmit(){
    this.submitted = true;
    if (this.addEditProductTypeForm.invalid) {
      return;
    } else {
      this.inspectionServce.addProductType(this.productTypeData).subscribe(
        data => {
          var res: any = data;
          if (res.result.result == "success") {
            this.alertService.successAlert("Success", "Product Type Added Successfully");
            this.router.navigateByUrl('cms/producttype');
          }
          else {
            this.alertService.errorAlert("Oops!", "Product Type Add Failed");
          }
        },
        err => { 
this.alertService.errorAlert("Oops!", err.error.message);
        }
      )
    }
  }
  updateProductType(riskTypeData){
    this.submitted = true;
    if (this.addEditProductTypeForm.invalid) {
      return;
    } else {
      this.inspectionServce.updateProductType(riskTypeData).subscribe(
        data => {
          var res: any = data;
          if (res.result.result == "success") {
            this.alertService.successAlert("Success", "Product Type Updated Successfully");
            this.router.navigateByUrl('cms/producttype');
            this.productTypeData = {};
          }
          else {
            this.alertService.errorAlert("Oops!", "You have not updated Product Type");
            this.productTypeData = {};
          }
        },
        err => {
          this.alertService.errorAlert("Oops!", err.error.message);
        }
      )
    }
  }
  reset(){
    localStorage.removeItem('producttypeid');
    this.router.navigateByUrl('cms/producttype');
  }

}
