import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { ButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button [type]="type" [icon]="icon" [block]="block" [loading]="loading" [disabled]="disabled">{{
      text
    }}</app-button>
  `,
})
class HostComponent {
  type = 'primary';
  icon = '';
  block = false;
  loading = false;
  disabled = false;
  text = 'Save';
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideNzIcons([PlusOutline])],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the button with content from ng-content', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.textContent).toContain('Save');
  });

  it('should apply the primary type by default', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('ant-btn-primary');
  });

  it('should apply the correct button type when provided', () => {
    host.type = 'dashed';
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('ant-btn-dashed');
  });

  it('should render the icon when provided', () => {
    host.icon = 'plus';
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('nz-icon');
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('ng-reflect-nz-type')).toBe('plus');
  });

  it('should not render the icon if icon input is empty', () => {
    host.icon = '';
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('nz-icon');
    expect(icon).toBeFalsy();
  });

  it('should apply the loading state when set', () => {
    host.loading = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('ant-btn-loading');
  });

  it('should apply the block style when set', () => {
    host.block = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('ant-btn-block');
  });

  it('should disable the button when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBeTrue();
  });
});
