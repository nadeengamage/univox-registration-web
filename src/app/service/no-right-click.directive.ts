import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoRightClick]'
})
export class NoRightClickDirective {

    @HostListener('contextmenu', ['$event'])
    onRightClick(event) {
        event.preventDefault();
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      console.log(event)
        if (event.code === 'F12') {
          event.preventDefault();
        } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) { // Prevent Ctrl+Shift+I        
          event.preventDefault();
      }
    }

  constructor() { }

}
