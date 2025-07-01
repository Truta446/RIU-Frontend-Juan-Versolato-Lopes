import { Component, input, InputSignal } from '@angular/core';
import { NzButtonModule, NzButtonType } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  public type: InputSignal<NzButtonType> = input<NzButtonType>('primary');
  public icon: InputSignal<string> = input<string>('');
  public block: InputSignal<boolean> = input<boolean>(false);
  public loading: InputSignal<boolean> = input<boolean>(false);
  public disabled: InputSignal<boolean> = input<boolean>(false);
}
