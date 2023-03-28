import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { Pagination } from '../../shared/models/pagination';
import { MessageResponse } from '../../shared/models/response/message-response';
import { Venta } from '../../shared/models/venta';
import { VentaSearch } from '../../shared/models/filters/venta-search';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import { CategoriaProducto } from 'src/app/shared/models/categoria-producto';

const httpHeaders = {
  headers: new HttpHeaders(environment.apiConfig.headers),
  reportProgress: true
}
const path = environment.apiConfig.path;
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  ventas: Array<Venta>;
  filterSearch: VentaSearch;

  constructor(private http: HttpClient) {
    this.ventas = [];
    this.filterSearch = new VentaSearch();
  }

  /**
  * Get | search productos
  * @param filterSearch Cliente
  * @returns Observable<Cliente[]>
  */
  public getCategorias(nombre: string | null = null): Observable<Array<CategoriaProducto>> {
    let params = new HttpParams();
    params = params.append('nombre', nombre!);

    return this.http.get<Array<CategoriaProducto>>(`${path}/categorias/list`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
      params: params
    });
  }

}
