import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlystring]'
})
export class OnlystringDirective {
  @Input() onlyAlpha: boolean;
  @Input() regex: any;

  constructor(private el: ElementRef) { }
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    
    var value = this.el.nativeElement.value == "" ? e.key : this.el.nativeElement.value + e.key;
    if (this.onlyAlpha) {
      var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
      var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      //  if ( e.keyCode > 105) {
      //   e.preventDefault();
      // }
      // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
      if (!keyCodeChar.match(new RegExp("^[a-zA-Z ]*$", "i")) || e.keyCode > 105 || (event.keyCode==32 && this.el.nativeElement.value=="")) {
        event.preventDefault();
        return false;
      }
    }
  }

}
