import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private httpLoading$ = new ReplaySubject<boolean>(0);
  constructor() { }

  httpProgress(): Observable<boolean> {
    return this.httpLoading$.asObservable();
  }

  setHttpProgressStatus(inprogess: boolean) {
    this.httpLoading$.next(inprogess);
  }
}
