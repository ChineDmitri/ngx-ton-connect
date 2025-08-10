import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTonconnectComponent } from './ngx-ton-connect.component';

describe('NgxTonconnectComponent', () => {
  let component: NgxTonconnectComponent;
  let fixture: ComponentFixture<NgxTonconnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTonconnectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxTonconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
