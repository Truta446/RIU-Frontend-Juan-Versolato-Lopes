import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { DashboardOutline, DingdingOutline } from '@ant-design/icons-angular/icons';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule, provideNzIcons } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { StateManagementService } from '../../services/state-management.service';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let stateManagementService: jasmine.SpyObj<StateManagementService>;

  beforeEach(waitForAsync(() => {
    const stateManagementSpy = jasmine.createSpyObj('StateManagementService', ['isCollapsed']);
    stateManagementSpy.isCollapsed.and.returnValue(false);

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => (key === 'id' ? '1' : null),
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [
        SidenavComponent,
        TranslateModule.forRoot(),
        NzIconModule,
        NzMenuModule,
        NzLayoutModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: StateManagementService, useValue: stateManagementSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideNzIcons([DingdingOutline, DashboardOutline]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    stateManagementService = TestBed.inject(StateManagementService) as jasmine.SpyObj<StateManagementService>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the menu with 2 items', () => {
    fixture.detectChanges();
    const menuItems = fixture.debugElement.queryAll(By.css('li[nz-menu-item]'));
    expect(menuItems.length).toBe(2);
  });

  it('should render logo for not collapsed state', () => {
    stateManagementService.isCollapsed.and.returnValue(false);
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('.sidebar-logo img'));
    expect(img.nativeElement.src).toContain('assets/images/logotipo.png');
  });

  it('should render logo for collapsed state', () => {
    stateManagementService.isCollapsed.and.returnValue(true);
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('.sidebar-logo img'));
    expect(img.nativeElement.src).toContain('assets/images/favicon.ico');
  });
});
