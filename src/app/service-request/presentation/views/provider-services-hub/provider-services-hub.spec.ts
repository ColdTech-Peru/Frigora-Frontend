import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServicesHub } from './provider-services-hub';

describe('ProviderServicesHub', () => {
  let component: ProviderServicesHub;
  let fixture: ComponentFixture<ProviderServicesHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderServicesHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderServicesHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
