import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SismoDataService {

  url: string = "http://127.0.0.1:3000/api"

  constructor(
    private http: HttpClient
  ) { }

  getData(page: number, perPage: number, magType?: any) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('mag_type', magType);

    return this.http.get(this.url + "/features", { params })
  }

  postComment(body: any) {
    return this.http.post(this.url + '/comments', body)
  }
}
