import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {

  @ViewChild('stickyNavbar', {static: false}) stickyNavbar: ElementRef;

  sticky: boolean = false;
  elementPosition: any;
  scrollPosition = 0;

  prevScrollpos = 0;  
  
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
   this.elementPosition = this.stickyNavbar.nativeElement.offsetTop;
   this.prevScrollpos = window.pageYOffset;
  }

  @HostListener('window:scroll')
    handleScroll(){
      let currentScrollPos = window.pageYOffset;
      if (this.prevScrollpos > currentScrollPos) {
        document.getElementById("navbar-top-id").style.top = "0";
        document.getElementById("navbar-bottom-id").style.top = "23px";  
      } else {
        document.getElementById("navbar-top-id").style.top = "-23px";    
        document.getElementById("navbar-bottom-id").style.top = "0px";   
      }
      this.prevScrollpos = currentScrollPos;
  }
}
