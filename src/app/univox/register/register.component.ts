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
  isSignature = false;
  registrationForm: FormGroup;
  submitted = false;
  public pad = {
    signature: null
  };
  submitFile
  isSign = false
  isNic = false
  isSchoolLeaving = false
  isCertificate = false
  // subject_keyword = 'subject_name';
  // stream_keyword = 'stream_name';
  common_keyword = 'name';
  streams = [
    {id: 1,name: 'Engineering Technology'},
    {id: 2,name: 'Bio-Systems Technology'},
    {id: 3,name: 'Physical Science'},
    {id: 4,name: 'Biological Science'},
    {id: 5,name: 'Commerce'},
    {id: 6,name: 'Art'},
  ]
  public subjects = [
    {id: 1,name: 'Accountancy'},{id: 2,name: 'Agricultural Science'},{id: 3,name: 'Agriculture Technology'},{id: 4,name: 'Arabic'},{id: 5,name: 'Art'},{id: 6,name: 'Bio Resource Technology'},{id: 7,name: 'Biology'},{id: 8,name: 'Biosystems Technology'},{id: 9,name: 'Buddhism'},{id: 10,name: 'Buddhist Civilization'},
    {id: 11,name: 'Business Statistics'},{id: 12,name: 'Business Studies'},{id: 13,name: 'Chemistry'},{id: 14,name: 'Chinese'},{id: 15,name: 'Christian Civilization'},{id: 16,name: 'Christianity'},{id: 17,name: 'Civil Technology'},{id: 18,name: 'Combined Mathematics'},
    // {id: 19,name: 'Common General Test'},
    {id: 20,name: 'Communication & Media Studies'},{id: 21,name: 'Dancing (Bharatha)'},{id: 22,name: 'Dancing (Indigenous)'},{id: 23,name: 'Drama and Theatre (English)'},{id: 24,name: 'Drama and Theatre (Sinhala)'},{id: 25,name: 'Drama and Theatre (Tamil)'},{id: 26,name: 'Economics'},{id: 27,name: 'Electrical, Electronic and Information Technology'},{id: 28,name: 'Engineering Technology'},{id: 29,name: 'English'},
    {id: 30,name: 'Food Technology'},{id: 31,name: 'French'},
    // {id: 32,name: 'General English'},
    {id: 33,name: 'Geography'},{id: 34,name: 'German'},{id: 35,name: 'Greek and Roman Civilization'},{id: 36,name: 'Higher Mathematics'},{id: 37,name: 'Hindi'},{id: 38,name: 'Hindu Civilization'},{id: 39,name: 'Hinduism'},{id: 40,name: 'History of Europe'},
    {id: 41,name: 'History of India'},{id: 42,name: 'History of Sri Lanka'},{id: 43,name: 'Home Economics'},{id: 44,name: 'Information & Communication Technology'},{id: 45,name: 'Islam'},{id: 46,name: 'Islam Civilization'},{id: 47,name: 'Japanese'},{id: 48,name: 'Logic and Scientific Method'},{id: 49,name: 'Malay'},
    {id: 50,name: 'Mathematics'},{id: 51,name: 'Mechanical Technology'},{id: 52,name: 'Modern World History'},{id: 53,name: 'Music (Carnatic)'},{id: 54,name: 'Music (Oriental)'},{id: 55,name: 'Music (Western)'},{id: 56,name: 'Pali'},{id: 57,name: 'Physics'},{id: 58,name: 'Political Science'},{id: 59,name: 'Russian'},
    {id: 60,name: 'Sanskrit'},{id: 61,name: 'Science for Technology'},{id: 62,name: 'Sinhala'},{id: 63,name: 'Tamil'},
  ];
  public grades = [
    {id: 1,name: 'A'},
    {id: 2,name: 'B'},
    {id: 3,name: 'C'},
    {id: 4,name: 'S'},
    {id: 5,name: 'F'}
 ];
 public nation = [
  {id: 1,name: 'SRI LANKAN'},
  {id: 2,name: 'OTHER'}
];
 public district = [
  {id: 1,name: 'AMPARA'},{id: 2,name: 'ANURADHAPURA'},{id: 3,name: 'BADULLA'},{id: 4,name: 'BATTICALOA'},{id: 5,name: 'COLOMBO'},{id: 6,name: 'GALLE'},{id: 7,name: 'GAMPAHA'},{id: 8,name: 'HAMBANTHOTA'},{id: 9,name: 'JAFFNA'},{id: 10,name: 'KANDY'},
  {id: 11,name: 'KEGALLE'},{id: 12,name: 'KILINOCHCHI'},{id: 13,name: 'ANURADHAPURA'},{id: 14,name: 'KURUNEHALA'},{id: 15,name: 'MANNAR'},{id: 16,name: 'MATALE'},{id: 17,name: 'MATARA'},{id: 18,name: 'MONARAGALA'},{id: 19,name: 'MULLAITIVU'},{id: 20,name: 'NUWARA ELIYA'},
  {id: 21,name: 'POLONNARUWA'},{id: 22,name: 'PUTTALAM'},{id: 23,name: 'RATHNAPURA'},{id: 24,name: 'TRINCOMALEE'},{id: 25,name: 'VAVUNIYA'}
];
public year = [
  {id: 1,name: '2020'},{id: 2,name: '2019'}
];
public alattemt = [
  {id: 1,name: '1'},
  {id: 2,name: '2'},
  {id: 3,name: '3'}
];

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
      nameInFull: [{value: '', disabled: true}, [Validators.required]],
      nameInInitial: [{value: '', disabled: true}, Validators.required],
      permanentAddress: ['', Validators.required],
      contactAddress: [''],
      residence: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12),
        Validators.pattern(/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|3|4|5|6|7|8|9)\d)\d{6}$/)]],
      mobile: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12),
        Validators.pattern(/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/)]],
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
      kmFromWork: [''],
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
      isPresentInstitute: ['',],
      external_education: ['',],
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
    this.details = null;
    this.getRegisterDetails()
    Swal.fire({
      // 'Attention!',
      // 'This is system genarated. The system does not allow to login again after submit your details. Please be patient to submit your correct details on first try!',
      // 'warning',
      title: '<strong>Welcome to UnivoX Student Registration System!</strong>',
      icon: 'warning',
      width: 1200,
      html:
        '<div class="privacy"><p>Please kindly read the below instructions.</p>' +
        '<p>You are allowed to Log-In or Log-Out from the system freely.</p>' +
        '<p class="oneatmpt">After successfully filling in relevant details, once you click ‘Save Details’ you will be logged out from the system and a confirmation email will be sent to your email ID. You are <span class="dan">NOT</span> allowed to log in again.</p>' +
        '<hr>' +
        '<p>Before starting to fill in the form, kindly be ready to submit your scanned images of the AL Exam Result certificate, School Leaving Certificate, National ID card, and Signature image. Please note if you can place your signature on the Signing Pad no need for a Signature Image.</p>' +
        '<hr>' +
        '<span><b>Furthermore</b></span>' +
        '<ul><li>You will have only one attempt to complete this registration.</li>' +
        '<li>All the fields highlighted in gray color are disabled; cannot be edited.</li>' +
        '<li>Any field that is enabled must be filled with correct details and some are compulsory.</li>' +
        '<li>When you upload your certificate images kindly use moderate size clear images.</li>' +
        '<li>Please use the digital signature area to sign the document or upload a clear image of your signature.</li>' +
        '<li>After you successfully submit the form, you will be logged out and a registration confirmation email will be received to your personal email address.</li>' +
        '<li>You can use the comments field for any comment that you need to make.</li>' +
        '<li>If any assistance necessary, you may write to <a href="mailto:admission2020@univotec.ac.lk">admission2020@univotec.ac.lk</a></li>' +
        '</ul>' + 
        '<p class="tks">Thank You,<br>University of Vocational Technology.</p>' +
        '<hr>' +
        '<span><b>Terms of Use</b></span>' +
        '<ul><li>Students must prepare their NIC image, School Leaving, A/L result sheet, and Personal Signature clearly scanned and prepared for upload.</li>' +
        '<li>If students use the digital signing signature pad no need for a Signature Image.</li>' +
        '<li>Students can login and double-check the details provided before clicking the ‘Save Details’ button; You can login and logout without saving. When the ‘Save Details’ button is clicked, the information is recorded, and the user will be automatically logged out plus a confirmation email will be sent out to Admin and a copy to the student him/herself to their email provided at the registration.</li>' +
        '<li>If any assistance is necessary, you may write to <a href="mailto:admission2020@univotec.ac.lk">admission2020@univotec.ac.lk</a></li>' +
        '<li>If a student accidentally clicks the saved button and if he/she wants to change information, he/she must write to <a href="mailto:admission2020@univotec.ac.lk">admission2020@univotec.ac.lk</a>, and then an authorized officer should send an official request to <a href="mailto:admin@univox.site">admin@univox.site</a> thereafter the NIC block will be lifted, and then again student can edit and resubmit.</li>' +
        '</div>',
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> OK!',
      confirmButtonAriaLabel: 'Thumbs up, OK!',
      cancelButtonText:
        '<i class="fa fa-thumbs-down"></i>',
      cancelButtonAriaLabel: 'Thumbs down'
    }
    )
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

  selectEvent(item) {
    // do something with selected item
  }
 
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e){
    // do something when input is focused
  }

  canSignature(status) {
    this.isSignature = status
  }

  getStreamList() {
    this.univoxService.getStream().subscribe(
      res => {
        console.log(res);
        this.streams = res
        
      },
      error => {
        // console.log(error);
        this.loading = false;
        this.notifier.notify('error', 'Something went wrong!');
      }
    );
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

  uploadFiles(data, type, diff) {
    // uploadFiles

    this.submitFile = null
    if (!diff && type !== 'signature') {
      this.submitFile = data.target.files[0]
      if (type === 'nic_card') {
        this.isNic = true
      } else if (type === 'school_leaving_certificate') {
        this.isSchoolLeaving = true
      } else {
        this.isCertificate = true
      }
    } else if (diff && type === 'signature') {
      this.submitFile = data.target.files[0]
      this.isSign = true
    } else {
      if (!this.pad.signature) {
        this.notifier.notify('error', 'No signature found!');
        return
      }
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
          // this.getRegisterDetails();
          this.notifier.notify('success', 'Document upload success!');
        } else {
          this.loading = false;
          this.notifier.notify('error', 'Something wrong...');
        }
        
      },
      error => {
        // console.log(error);
        this.loading = false;
        this.notifier.notify('error', 'Something went wrong!');
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

  isDisabledField (formControl) {
    if (this.registrationForm.controls[formControl].value) {
      return true
    }
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
        // this.getStreamList()
        
        this.setDetails()
        } else {
          this.notifier.notify('error', 'Details not found!');
        }
        this.loading = false;
      },
      error => {
        this.notifier.notify('error', 'Something wrong!');
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
      attempt: this.details.attempt ? this.details.attempt : '',
      stream: this.details.stream ? this.details.stream : '',
      subject1: this.details.sub_1 ? this.details.sub_1 : '',
      subject2: this.details.sub_2 ? this.details.sub_2 : '',
      subject3: this.details.sub_3 ? this.details.sub_3 : '',
      subject4: 'General English',
      subject5: 'Common General Test',
      subject6: this.details.sub_6 ? this.details.sub_6 : '',
      grade1: this.details.grd_1 ? this.details.grd_1 : '',
      grade2: this.details.grd_2 ? this.details.grd_2 : '',
      grade3: this.details.grd_3 ? this.details.grd_3 : '',
      grade4: this.details.grd_4 ? this.details.grd_4 : '',
      grade5: this.details.grd_5 ? this.details.grd_5 : '',
      grade6: this.details.grd_6 ? this.details.grd_6 : '',
      presentEducation: this.details.institution,
      isPresentInstitute: this.details.institution_name,
      external_education: this.details.external_education,
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
      sub_1: this.registrationForm.value.subject1.name,
      sub_2: this.registrationForm.value.subject2.name,
      sub_3: this.registrationForm.value.subject3.name,
      sub_4: this.registrationForm.value.subject4,
      sub_5: this.registrationForm.value.subject5,
      sub_6: this.registrationForm.value.subject6,
      grd_1: this.registrationForm.value.grade1.name,
      grd_2: this.registrationForm.value.grade2.name,
      grd_3: this.registrationForm.value.grade3.name,
      grd_4: this.registrationForm.value.grade4.name,
      grd_5: this.registrationForm.value.grade5,
      grd_6: this.registrationForm.value.grade6,
      institution: this.registrationForm.value.presentEducation,
      institution_name: this.registrationForm.value.isPresentInstitute,
      external_education: this.registrationForm.value.external_education,
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
      if (!this.isSign) {
        this.notifier.notify('error', 'Please save your signature!');
        return
      } else if (!this.isNic) {
        this.notifier.notify('error', 'Please upload your NIC!');
        return
      } else if (!this.isSchoolLeaving) {
        this.notifier.notify('error', 'Please upload your school leaving!');
        return
      } else if (!this.isCertificate) {
        this.notifier.notify('error', 'Please upload your certificate!');
        return
      }
      this.loading = true;
      this.univoxService.saveData(payload, this.registrationForm.value.id).subscribe(
        res => {
          if (res.nic_no) {
            this.loading = false;
          // this.notifier.notify('success', 'Your details was recorded. Thank you!');
          this.isSign = false
          this.isNic = false
          this.isSchoolLeaving = false
          this.isCertificate = false
          Swal.fire({
            title: 'Thank You! Your are information have been recorded successfully!',
            text: 'A confirmation email already sent to your E-mail address ' + this.registrationForm.value.email +' provided at the registration.',
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
