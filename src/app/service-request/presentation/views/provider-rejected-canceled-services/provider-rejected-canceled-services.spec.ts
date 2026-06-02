import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRejectedCanceledServices } from './provider-rejected-canceled-services';

describe('ProviderRejectedCanceledServices', () => {
  let component: ProviderRejectedCanceledServices;
  let fixture: ComponentFixture<ProviderRejectedCanceledServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderRejectedCanceledServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderRejectedCanceledServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
