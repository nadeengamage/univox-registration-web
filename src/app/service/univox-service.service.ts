import { Injectable } from '@angular/core';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class UnivoxService {

  private baseUrl = 'https://univox.site';

  private getDetailsEndPoint: string;
  private createDetailsEndPoint: string;
  private uploadFileEndPoint: string;
  private authenticateEndPoint: string;
  private getStreamEndPoint: string;
  private getSubjectEndPoint: string;
  private updateUser: string;

  constructor(private http: HttpUtilsService) {

    //REGISTRATION
    this.getDetailsEndPoint = this.baseUrl + '/students/{nic}';
    this.createDetailsEndPoint = this.baseUrl + '/students/{id}';
    this.uploadFileEndPoint = this.baseUrl + '/upload';
    this.authenticateEndPoint = this.baseUrl + '/auth/local';
    this.getStreamEndPoint = this.baseUrl + '/streams';
    this.getSubjectEndPoint = this.baseUrl + '/subject/1';
    this.updateUser = this.baseUrl + '/users/{user}';
  }

  ///////////
  public updateUserDate(data, user) {
    const auth = this.updateUser.replace(
      '{user}', user
    );
    return this.http.put(auth, data);
  }
  public authenticateUser(data) {
    const auth = this.authenticateEndPoint
    return this.http.post(auth, data);
  }
  public getRegisterDetails(nic) {
    const getDetails = this.getDetailsEndPoint.replace(
      '{nic}', nic
    );
    return this.http.get(getDetails);
  }
  public saveData(data, id) {
    const create = this.createDetailsEndPoint.replace(
      '{id}', id
    );
    return this.http.put(create, data);
  }
  public uploadFiles(data, type) {
    const upload = this.uploadFileEndPoint;
    return this.http.multiPart(upload, data, type);
  }
  public getStream() {
    const stream = this.getStreamEndPoint;
    return this.http.get(stream);
  }
}
