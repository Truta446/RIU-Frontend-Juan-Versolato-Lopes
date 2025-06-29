import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateManagementService {
  public isCollapsed: WritableSignal<boolean> = signal(false);
  public language: WritableSignal<string> = signal('es');
}
