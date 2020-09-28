import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/service/alert.service';
import { InspectionSeriveService } from 'src/app/service/inspection-serive.service';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss']
})
export class ProductTypeComponent implements OnInit {

  constructor(private inspectionService:InspectionSeriveService,private router:Router,private alertService:AlertService) { }
  dtOptions: any = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  productTypeList: Object;
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      pageLength: 10,
      processing: true,
        dom: 'Blfrtip',
          buttons: [
              'excel'
          ]
    };
    this.getallProductType();
  }
  getallProductType() {
    this.inspectionService.getAllProductType().subscribe(
      (data) => {
        this.productTypeList = data;
        this.rerender();
      },
      (err) => {}
    );
  }
  gotoAddProductTypeScreen(){
    localStorage.removeItem('producttypeid');
    this.router.navigateByUrl('cms/producttypeaction');
  }
  editProductType(item){
    localStorage.setItem('producttypeid', item.id);
    this.router.navigateByUrl('cms/producttypeaction');
  }
  deleteProductType(item)
  {
    this.alertService.confirmAlert(() => {
      this.inspectionService.deleteProductType(item.id).subscribe(
        data =>{
          this.alertService.successAlert("Success","Product Type Deleted Successfully");
          this.getallProductType();
        },
        err =>{
  
        }
      )})
  }
  rerender(): void {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
