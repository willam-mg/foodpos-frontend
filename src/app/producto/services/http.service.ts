import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import { MessageResponse } from 'src/app/shared/models/response/message-response';
import { Producto } from 'src/app/shared/models/producto';
import { Pagination } from 'src/app/shared/models/pagination';
import { PuntoVenta } from 'src/app/shared/models/punto-venta';

const httpHeaders = {
  headers: new HttpHeaders(environment.apiConfig.headers),
  reportProgress: true
}
const path = environment.apiConfig.path;
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  productos: Array<Producto>;

  constructor(private http: HttpClient) {
    this.productos = [];
  }

  /**
   * get | search productos
   * @param filterSearch Producto
   * @returns Observable<Producto[]>
   */
  public search(filterSearch: Producto, pagination: Pagination): Observable<DataResponse> {
    let params = new HttpParams();
    params = params.append('page', pagination.page.toString());
    params = params.append('per-page', pagination.pageSize.toString());
    params = params.append('nombre', filterSearch.nombre);
    params = params.append('publicado', filterSearch.publicado);
    params = params.append('punto_venta_id', filterSearch.punto_venta_id);

    return this.http.get<DataResponse>(`${path}/productos`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
      params: params
    });
  }

  /**
   * create a cliente
   * @param body Observable<Producto>
   * @returns Producto
   */
  public create(body: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${path}/productos/create`, body, httpHeaders);
  }

  /**
   * update a cliente
   * @param id number
   * @param body Producto
   * @returns Observable<Producto>
   */
  public update(id: number, body: Producto): Observable<Producto> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.http.put<Producto>(`${path}/productos/update`, body, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
      params: params
    });
  }

  /**
   * get a cliente
   * @param id number
   * @returns Observable<Producto>
   */
  public show(id: number): Observable<Producto> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.http.get<Producto>(`${path}/productos/show`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
      params: params
    });
  }

  /**
   * 
   * @param id number
   * @returns Observable<String>
   */
  public delete(id: number): Observable<MessageResponse> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.http.delete<MessageResponse>(`${path}/productos/delete`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
      params: params
    });
  }

  /**
   * get | list puntos venta
   * @param filterSearch Producto
   * @returns Observable<Producto[]>
   */
  public puntosVenta(): Observable<Array<PuntoVenta>> {
    return this.http.get<Array<PuntoVenta>>(`${path}/productos/puntos-venta`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
    });
  }
}
