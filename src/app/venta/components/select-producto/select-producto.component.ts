import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { HttpService as ProductoHttpService } from 'src/app/producto/services/http.service';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import { Pagination } from 'src/app/shared/models/pagination';
import { Producto } from 'src/app/shared/models/producto';

@Component({
  selector: 'app-select-producto',
  templateUrl: './select-producto.component.html',
  styleUrls: ['./select-producto.component.css']
})
export class SelectProductoComponent implements OnInit {
  formSearch: FormGroup;
  submitted: boolean;
  subscription: Subscription;
  responseData: DataResponse;
  productos: Array<Producto>;
  pagination: Pagination;
  @Output()
  isSelected: EventEmitter<Producto> = new EventEmitter<Producto>();

  constructor(
    private httpService: ProductoHttpService,
    public modal: NgbActiveModal) {
    this.submitted = false;
    this.productos = [];
    this.subscription = new Subscription;
    this.responseData = new DataResponse();
    this.pagination = new Pagination();
    this.formSearch = new FormGroup({ 
      fieldNombre: new FormControl(""),
      fieldCodigo: new FormControl(""), 
    });
  }

  ngOnInit(): void {
    this.search();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search() {
    this.httpService.search(this.formSearch.value, this.pagination).subscribe((data) => {
      this.responseData = data;
      this.productos = this.responseData.data;
      this.pagination.totalCount = data.total;
    });
  }

  select(almacen: Producto) {
    this.modal.close();
    this.isSelected.emit(almacen);
  }
}
