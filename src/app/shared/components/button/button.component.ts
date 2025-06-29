import { Component, Input } from '@angular/core';
import { NzButtonModule, NzButtonType } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() public type: NzButtonType = 'primary';
  @Input() public icon?: string = '';
  @Input() public block?: boolean = false;
  @Input() public loading?: boolean = false;
  @Input() public disabled?: boolean = false;
}
