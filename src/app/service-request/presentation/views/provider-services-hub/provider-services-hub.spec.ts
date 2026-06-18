import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServicesHubComponent } from './provider-services-hub';

describe('ProviderServicesHub', () => {
  let component: ProviderServicesHubComponent;
  let fixture: ComponentFixture<ProviderServicesHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderServicesHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderServicesHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
