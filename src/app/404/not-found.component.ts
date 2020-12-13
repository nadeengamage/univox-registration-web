import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
    constructor(
        
      ) {}

      ngOnInit() {
    }
}