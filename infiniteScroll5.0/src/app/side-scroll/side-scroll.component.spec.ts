import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideScrollComponent } from './side-scroll.component';

describe('SideScrollComponent', () => {
  let component: SideScrollComponent;
  let fixture: ComponentFixture<SideScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
