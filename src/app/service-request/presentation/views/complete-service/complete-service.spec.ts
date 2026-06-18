import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderCompletedServicesComponent } from './complete-service';

describe('CompleteService', () => {
  let component: ProviderCompletedServicesComponent;
  let fixture: ComponentFixture<ProviderCompletedServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderCompletedServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderCompletedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
