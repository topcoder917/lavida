import { Injectable } from '@angular/core';
import { config } from '../../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { DbService } from '../../sqlite/db.service';

const api_baseUrl = config.api_baseUrl;


@Injectable({
  providedIn: 'root'
})
export class ExportService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  exportOrderMasterList = [];
  exportOrderDetailList = [];
  exportsavedOrderMasterList = [];
  exportsavedOrderDetailList = [];

  constructor(
    public http: HttpClient,
    public db: DbService) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  saveOrderMaster(param: any){
    return this.http
      .post<any>(api_baseUrl + '/addsaveordermaster', JSON.stringify(param))
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  saveOrderDetail(param: any){
    return this.http
      .post<any>(api_baseUrl + '/addsaveorderdetail', JSON.stringify(param))
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }  
  checkoutOrderMaster(param: any){
    return this.http
      .post<any>(api_baseUrl + '/addcheckoutordermaster', JSON.stringify(param))
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  checkoutOrderDetail(param: any){
    return this.http
      .post<any>(api_baseUrl + '/addcheckoutorderdetail', JSON.stringify(param))
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }  
  
  getLastRegDateFromServer(){
    return this.http.get<any>(api_baseUrl + `/getlastregdate`);
  }
  
  updateOnlineFromLocal(param){
    return this.http
    .post<any>(api_baseUrl + '/updatefromlocal', JSON.stringify(param))
    .pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  exportToServer(){
    this.getLastRegDateFromServer().subscribe(async result => {
          console.log("exportOrderMasterList====", this.exportOrderMasterList);
          console.log("exportOrderDetailList====", this.exportOrderDetailList);

      // this.db.getDatabaseState().subscribe(async (res) => {
      //   if(res){
      //     this.exportOrderMasterList = await this.db.getOrderMasterByRegDate(result.orderRegDate);
      //     this.exportOrderDetailList = await this.db.getOrderDetailList(result.orderRegDate);
      //     this.exportsavedOrderMasterList = await this.db.getSavedOrderMasterByRegDate(result.savedOrderRegDate);
      //     this.exportsavedOrderDetailList = await this.db.getSavedOrderDetailList(result.savedOrderRegDate);

      //     var param = {
      //       orderMasterList: this.exportOrderMasterList,
      //       orderDetailList: this.exportOrderDetailList,
      //       savedOrderMaster: this.exportsavedOrderMasterList,
      //       savedOrderDetail: this.exportsavedOrderDetailList
      //     };
      //     this.updateOnlineFromLocal(param).subscribe(async result => {
      //       console.log(result);
      //     }
      //     ,err => {
      //       alert("Error: Couldn't update to online.");
      //     });
      //   }
      // });  
  
    },err => {
      alert("Error: Couldn't get last reg_date of order.");
    });
  }
}
