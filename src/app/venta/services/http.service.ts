import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { Pagination } from '../../shared/models/pagination';
import { MessageResponse } from '../../shared/models/response/message-response';
import { Venta } from '../../shared/models/venta';
import { VentaSearch } from '../../shared/models/filters/venta-search';
import { DataResponse } from 'src/app/shared/models/response/data-response';

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
  pagination: Pagination;

  constructor(private http: HttpClient) {
    this.ventas = [];
    this.filterSearch = new VentaSearch();
    this.pagination = new Pagination();
  }

  private setFilterSearch(form:any): void{
    this.filterSearch.fechaInicio = form.filterFechaInicio! ?? this.filterSearch.fechaInicio;
    this.filterSearch.fechaFin = form.filterFechaFin! ?? this.filterSearch.fechaFin;
    this.filterSearch.estado = form.filterEstado! ?? this.filterSearch.estado;
  }

  /**
  * get | search productos
  * @param filterSearch Cliente
  * @returns Observable<Cliente[]>
  */
  public search(formSearchFilter: any, pagination: Pagination): Observable<DataResponse> {
    // this.pagination.setValues(pagination);
    // this.setFilterSearch(formSearchFilter);
    let params = new HttpParams();
    params = params.append('page', this.pagination.page.toString());
    params = params.append('per-page', this.pagination.pageSize.toString());
    params = params.append('showAll', this.pagination.showAll.toString());
    params = params.append('filterFechaInicio', this.filterSearch.fechaInicio);
    params = params.append('filterFechaFin', this.filterSearch.fechaFin);
    params = params.append('filterEstado', this.filterSearch.estado);

    // params: params
    return this.http.get<DataResponse>(`${path}/ventas`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
    });
  }

  /**
   * create a venta
   * @param body Observable<Venta>
   * @returns Venta
   */
  public create(body: any): Observable<Venta> {
    return this.http.post<Venta>(`${path}/ventas/create`, body, httpHeaders);
  }

  /**
   * get a Venta
   * @param id number
   * @returns Observable<Venta>
   */
  public show(id: number): Observable<Venta> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.http.get<Venta>(`${path}/ventas/show`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
      params: params
    });
  }
  
  /**
   * get a Venta
   * @param id number
   * @returns Observable<Venta>
   */
  public cancelarVenta(id: number): Observable<Venta> {
    return this.http.post<Venta>(`${path}/ventas/cancelar?id=${id.toString()}`, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
    });
  }

  /**
   * captura todos los tags tipo link
   * @param tagName
   * @return string tag type style
   */
  private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
    const htmlStr: string[] = [];
    const elements = document.getElementsByTagName(tagName);
    for (let idx: number = 0; idx < elements.length; idx++) {
      htmlStr.push(elements[idx].outerHTML);
    }
    return htmlStr.join('\r\n');
  }

  /**
   * muestra una ventana emergente con 
   * la pantalla print abierta.
   * @param contenido 
   */
  public printInWindow(contenido: string) {
    // let printContents, popupWin;
    let printContents = document.getElementById(contenido)!.innerHTML;
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto,fullscreen=yes,menubar=0');
    popupWin!.document.open();
    let stylesHtml = this.getTagsHtml('style');
    // const linksHtml = this.getTagsHtml('link');
    // onload = "window.print();window.close()"
    // ${ linksHtml }
    popupWin!.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          ${stylesHtml}
        </head>
        <script>
          function imprimir(){
            window.print();
            setTimeout(function(){
              window.close();
            }, 500);
          }
        </script>
        <body onload = "imprimir()">${printContents}</body>
      </html>`
    );
    popupWin!.document.close();
  }

  /**
   * update venta
   * @param id number
   * @returns Observable<Venta>
   */
  public update(id: number, body: Venta): Observable<Venta> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.http.put<Venta>(`${path}/ventas/update`, body, {
      headers: new HttpHeaders(environment.apiConfig.headers),
      reportProgress: true,
      params: params
    });
  }

}
