import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import { MessageResponse } from 'src/app/shared/models/response/message-response';
import { Producto } from 'src/app/shared/models/producto';
import { Pagination } from 'src/app/shared/models/pagination';
import { PuntoVenta } from 'src/app/shared/models/punto-venta';
import { Aditamento } from 'src/app/shared/models/aditamento';

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
    params = params.append('categoria_producto_id', filterSearch.categoria_producto_id);
    params = params.append('publicado', filterSearch.publicado);
    params = params.append('punto_venta_id', filterSearch.punto_venta_id);
    if (filterSearch.es_aditamento) {
      params = params.append('es_aditamento', filterSearch.es_aditamento);
    }

    return this.http.get<DataResponse>(`${path}/productos`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
      params: params
    });
  }

  /**
   * create a producto
   * @param body Observable<Producto>
   * @returns Producto
   */
  public create(body: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${path}/productos/create`, body, httpHeaders);
  }
  
  /**
   * create aditamento
   * @param body Observable<Producto>
   * @returns Producto
   */
  public addAditamento(idProducto: number, idAditamento: number): Observable<Producto> {
    let body = {
      producto_id: idProducto,
      aditamento_id: idAditamento,
      descripcion: "es aditamento",
    }
    return this.http.post<Producto>(`${path}/productos/aditamentos/create`, body, httpHeaders);
  }
  
  /**
   * create aditamento
   * @param body Observable<Producto>
   * @returns Producto
   */
  public removeAditamento(id: number): Observable<Producto> {
    return this.http.delete<Producto>(`${path}/productos/aditamentos/remove/${id}`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
    });
  }

  /**
   * update a producto
   * @param id number
   * @param body Producto
   * @returns Observable<Producto>
   */
  public update(id: number, body: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${path}/productos/update/${id}`, body, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
    });
  }

  /**
   * get a producto
   * @param id number
   * @returns Observable<Producto>
   */
  public show(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${path}/productos/show/${id}`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
    });
  }

  /**
   * 
   * @param id number
   * @returns Observable<String>
   */
  public delete(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${path}/productos/delete/${id}`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
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

  public misAditamentos(id: number): Observable<Array<Aditamento>> {
    return this.http.get<Array<Aditamento>>(`${path}/productos/aditamentos/${id}`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
    });
  }
}
