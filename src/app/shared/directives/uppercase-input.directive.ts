import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercaseInput]',
  standalone: true,
})
export class UppercaseInputDirective {
  private ngControl: NgControl = inject(NgControl);

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upper = input.value.toUpperCase();
    input.value = upper;
    this.ngControl.control?.setValue(upper, { emitEvent: false });
  }
}
