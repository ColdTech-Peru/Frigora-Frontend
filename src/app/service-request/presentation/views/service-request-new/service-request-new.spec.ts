import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestNewComponent } from './service-request-new';

describe('ServiceRequestNew', () => {
  let component: ServiceRequestNewComponent;
  let fixture: ComponentFixture<ServiceRequestNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
