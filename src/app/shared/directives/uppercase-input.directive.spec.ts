import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UppercaseInputDirective } from './uppercase-input.directive';

@Component({
  template: `
    <form>
      <input [formControl]="name" appUppercaseInput />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, UppercaseInputDirective],
})
class TestHostComponent {
  name = new FormControl('');
}

describe('UppercaseInputDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: HTMLInputElement;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  it('should convert input value to uppercase visually', () => {
    input.value = 'batman';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('BATMAN');
  });

  it('should update the form control value to uppercase', () => {
    input.value = 'superman';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.name.value).toBe('SUPERMAN');
  });

  it('should keep already uppercase values unchanged', () => {
    input.value = 'IRONMAN';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('IRONMAN');
    expect(component.name.value).toBe('IRONMAN');
  });

  it('should handle mixed-case inputs', () => {
    input.value = 'wOnDeR wOmAn';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('WONDER WOMAN');
    expect(component.name.value).toBe('WONDER WOMAN');
  });
});
