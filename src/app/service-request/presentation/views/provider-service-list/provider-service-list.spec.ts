import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServiceListComponent } from './provider-service-list';

describe('ProviderServiceList', () => {
  let component: ProviderServiceListComponent;
  let fixture: ComponentFixture<ProviderServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderServiceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
