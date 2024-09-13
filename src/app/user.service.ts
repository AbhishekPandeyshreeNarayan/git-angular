import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userElement } from './model/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  apiurl = 'http://localhost:3000/usersList';

  getAllUsers(): Observable<userElement[]> {
    return this.http.get<userElement[]>(this.apiurl);
  }

  getUsers(id: any): Observable<userElement> {
    return this.http.get<userElement>(this.apiurl + '/' + id);
  }

  deleteUsers(id: any) {
    return this.http.delete(this.apiurl + '/' + id);
  }

  addUsers(data: any) {
    return this.http.post(this.apiurl, data);
  }

  updateUsers(id: any, data: any) {
    return this.http.put(this.apiurl + '/' + id, data);
  }

}
