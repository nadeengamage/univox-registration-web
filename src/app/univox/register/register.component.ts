import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserPermissionService } from '../../service/permissions/user-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AuthService } from '../../service/authentication.service';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild(SignaturePad, {static: false}) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    'canvasWidth': 700,
    'canvasHeight': 250,
    backgroundColor: '#fff'
  };
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  details;
  showData = {
    degree: null,
    nic: null
  }
  registrationForm: FormGroup;
  submitted = false;
  public pad = {
    signature: null
  };
  submitFile
  isSign = false

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private userPermissionService: UserPermissionService,
    private authService: AuthService,
  ) {
    // this.userCreateForm = this.fb.group({
    //   username: ['', [Validators.required, Validators.minLength(8)]],
    //   password: ['', [Validators.required, Validators.minLength(8)]],
    //   firstname: ['', Validators.required],
    //   lastname: ['', Validators.required],
    //   role: ['', Validators.required]
    // });
    this.registrationForm = this.fb.group({
      id: ['', [Validators.required]],
      degreeName: ['', [Validators.required]],
      nameInFull: ['', [Validators.required]],
      nameInInitial: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      contactAddress: [''],
      residence: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12),
        Validators.pattern(/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/)]],
      mobile: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12),
        Validators.pattern(/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/)]],
      email: ['', [Validators.required, Validators.email,
        Validators.pattern(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)]],
      nic: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)]],
      issueNic: ['', Validators.required],
      civil: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: [''],
      religion: [''],
      district: ['', Validators.required],
      kmFromAddress: ['', Validators.required],
      kmFromWork: ['', Validators.required],
      indexNo: ['', Validators.required],
      year: ['', Validators.required],
      zscore: ['', Validators.required],
      attempt: ['', Validators.required],
      stream: ['', Validators.required],
      subject1: ['', Validators.required],
      subject2: ['', Validators.required],
      subject3: ['', Validators.required],
      subject4: ['', Validators.required],
      subject5: [''],
      subject6: [''],
      grade1: ['', Validators.required],
      grade2: ['', Validators.required],
      grade3: ['', Validators.required],
      grade4: ['', Validators.required],
      grade5: [''],
      grade6: [''],
      presentEducation: ['', Validators.required],
      isPresentInstitute: ['', Validators.required],
      comment: [''],
      degree: {
        id: ['', Validators.required]
      }
    });
  }

  ngOnInit() {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   responsive: true
    // };
    // this.canUserAdd = this.userPermissionService.isUserAdd(
    //   this.userDetailsService.getRequestInfo()
    // );
    // this.canUserEdit = this.userPermissionService.isUserEdit(
    //   this.userDetailsService.getRequestInfo()
    // );
    // this.canUserDelete = this.userPermissionService.isUserDelete(
    //   this.userDetailsService.getRequestInfo()
    // );
    // this.getAllUsers();
    this.details = null;
    this.getRegisterDetails()
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 2); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL('image/png', 0.8));
    this.pad.signature = this.signaturePad.toDataURL('image/png', 0.8)
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  clearSignature () {
    this.signaturePad.set('minWidth', 2);
    this.signaturePad.clear();
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  uploadFiles(data, type) {
    // uploadFiles

    this.submitFile = null
    if (type !== 'signature') {
      this.submitFile = data.target.files[0]
    } else {
      this.submitFile = this.DataURIToBlob(this.pad.signature)
      this.isSign = true
      // submitFile = this.pad.signature
    }
    
    // console.log(this.submitFile)
    this.loading = true;
    this.univoxService.uploadFiles(this.submitFile, type).subscribe(
      res => {
        // console.log(res);
        if (res.length >= 0) {
          this.loading = false;
          this.getRegisterDetails();
          this.notifier.notify('success', 'Document upload success!');
        } else {
          this.notifier.notify('error', 'Something wrong...');
        }
        
      },
      error => {
        // console.log(error);
        this.loading = false;
        this.notifier.notify('error', error.error);
      }
    );
  }

  // confirm() {
  //   if (this.signaturePad.isEmpty()) {
  //     this.notifier.notify('error', 'Please add your signature!');
  //   } else {
  //     this.setSignatureImage.emit({
  //       signatureBase64: this.pad.signature
  //     });
  //     this.clearPad();
  //     this.signatureCaptureModal.hide();
  //   }
  // }

  isInvalidField(formControl) {
    return (this.registrationForm.controls[formControl].touched ||
      this.registrationForm.controls[formControl].dirty) &&
      this.registrationForm.controls[formControl].errors
      ? true
      : false;
  }

  getRegisterDetails() {
    this.loading = true;
    const user = JSON.parse(
      window.atob(
        localStorage.getItem('user_details')
        ? localStorage.getItem('user_details')
        : 'e30='
      )
    );
    this.univoxService.getRegisterDetails(user).subscribe(
      res => {
        if (res.nic_no) {
        
        this.details = res;
        // console.log(this.details)
        this.setDetails()
        } else {
          this.notifier.notify('warning', res.error);
        }
        this.loading = false;
      },
      error => {
        this.notifier.notify('warning', error.error);
        this.loading = false;
      }
    );
  }

  setDetails() {
    this.showData.degree = this.details.degree.description
    this.showData.nic = this.details.nic_no
    this.registrationForm.patchValue({
      id: this.details.id,
      degreeName: this.details.degree.description,
      nameInFull: this.details.full_name,
      nameInInitial: this.details.initial_name,
      permanentAddress: this.details.permanent_address,
      contactAddress: this.details.contact_address,
      residence: this.details.residence_contact,
      mobile: this.details.mobile_contact,
      email: this.details.email,
      nic: this.details.nic_no,
      issueNic: this.details.nic_issue_date,
      civil: this.details.civil_status,
      gender: this.details.gender,
      nationality: this.details.nationality,
      religion: this.details.religion,
      district: this.details.district_of_residence,
      kmFromAddress: this.details.distance_to_address,
      kmFromWork: this.details.distance_work,
      indexNo: this.details.z_index_number,
      year: this.details.exam_year,
      zscore: this.details.z_score,
      attempt: this.details.attempt,
      stream: this.details.stream,
      subject1: this.details.sub_1,
      subject2: this.details.sub_2,
      subject3: this.details.sub_3,
      subject4: this.details.sub_4,
      subject5: this.details.sub_5,
      subject6: this.details.sub_6,
      grade1: this.details.grd_1,
      grade2: this.details.grd_2,
      grade3: this.details.grd_3,
      grade4: this.details.grd_4,
      grade5: this.details.grd_5,
      grade6: this.details.grd_6,
      presentEducation: this.details.institution,
      isPresentInstitute: this.details.institution_name,
      comment: this.details.comment,
      application_number: this.details.application_number,
      degree: {
        id: this.details.degree.id
      }
    });
    this.signaturePad.clear();
    this.pad.signature = null
  }

  updateDetails() {
    if (!this.isSign) {
      this.notifier.notify('error', 'Please save your signature!');
      return
    }
    const payload = {
      id: this.registrationForm.value.id,
      full_name: this.registrationForm.value.nameInFull,
      initial_name: this.registrationForm.value.nameInInitial,
      permanent_address: this.registrationForm.value.permanentAddress,
      contact_address: this.registrationForm.value.contactAddress,
      residence_contact: this.registrationForm.value.residence,
      mobile_contact: this.registrationForm.value.mobile,
      email: this.registrationForm.value.email,
      nic_no: this.registrationForm.value.nic,
      civil_status: this.registrationForm.value.civil,
      gender: this.registrationForm.value.gender,
      nationality: this.registrationForm.value.nationality,
      religion: this.registrationForm.value.religion,
      z_index_number: this.registrationForm.value.indexNo,
      exam_year: this.registrationForm.value.year,
      z_score: this.registrationForm.value.zscore,
      attempt: this.registrationForm.value.attempt,
      stream: this.registrationForm.value.stream,
      sub_1: this.registrationForm.value.subject1,
      sub_2: this.registrationForm.value.subject2,
      sub_3: this.registrationForm.value.subject3,
      sub_4: this.registrationForm.value.subject4,
      sub_5: this.registrationForm.value.subject5,
      sub_6: this.registrationForm.value.subject6,
      grd_1: this.registrationForm.value.grade1,
      grd_2: this.registrationForm.value.grade2,
      grd_3: this.registrationForm.value.grade3,
      grd_4: this.registrationForm.value.grade4,
      grd_5: this.registrationForm.value.grade5,
      grd_6: this.registrationForm.value.grade6,
      institution: this.registrationForm.value.presentEducation,
      institution_name: this.registrationForm.value.isPresentInstitute,
      comment: this.registrationForm.value.comment,
      degree: {
          id: this.registrationForm.value.degree.id
      },
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      nic_issue_date: this.registrationForm.value.issueNic,
      status: null,
      application_number: this.registrationForm.value.application_number,
      district_of_residence: this.registrationForm.value.district,
      distance_to_address: this.registrationForm.value.kmFromAddress,
      distance_work: this.registrationForm.value.kmFromWork
  }
    if (!this.registrationForm.invalid) {
      this.loading = true;
      this.univoxService.saveData(payload, this.registrationForm.value.id).subscribe(
        res => {
          if (res.nic_no) {
          // this.notifier.notify('success', 'Your details was recorded. Thank you!');
          this.isSign = false
          Swal.fire({
            title: 'Your details has been recorded!',
            text: 'Do you want to logout?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'No, Keep Me Log In',
            cancelButtonText: 'Yes, Log Out!'
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Attention!',
                'This is system genarated. Do not submit your details again & again!',
                'warning'
              )
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Swal.fire(
              //   'Cancelled!',
              //   'Your data has not been recorded!',
              //   'error'
              // )
              this.authService.doLogout();
            }
          })
          this.getRegisterDetails()

          } else {
            this.notifier.notify('error', 'Please try again');
          }
          this.loading = false;
        },
        error => {
          this.notifier.notify('error', error.message);
          this.loading = false;
        }
      );

    } else {
      this.submitted = true;
      this.notifier.notify('error', 'Please check again!');
    }
  }
}
