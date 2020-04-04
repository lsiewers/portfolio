import { Component, OnInit, HostListener, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  moreInfo = false;

  constructor() { }

  ngOnInit() {
  }

  toggleMoreInfo() {
    console.log(this.moreInfo);

    this.moreInfo = !this.moreInfo;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log('click');

    this.moreInfo ? this.moreInfo = false : null;
  }
}
