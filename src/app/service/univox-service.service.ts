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

  constructor(private http: HttpUtilsService) {

    //REGISTRATION
    this.getDetailsEndPoint = this.baseUrl + '/students/{nic}';
    this.createDetailsEndPoint = this.baseUrl + '/students/{id}';
    this.uploadFileEndPoint = this.baseUrl + '/upload';
    this.authenticateEndPoint = this.baseUrl + '/auth/local';
  }

  ///////////
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
}
