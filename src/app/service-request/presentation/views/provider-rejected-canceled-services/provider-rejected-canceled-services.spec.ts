import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRejectedCanceledServicesComponent } from './provider-rejected-canceled-services';

describe('ProviderRejectedCanceledServices', () => {
  let component: ProviderRejectedCanceledServicesComponent;
  let fixture: ComponentFixture<ProviderRejectedCanceledServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderRejectedCanceledServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderRejectedCanceledServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
