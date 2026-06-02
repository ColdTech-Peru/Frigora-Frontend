import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServiceList } from './provider-service-list';

describe('ProviderServiceList', () => {
  let component: ProviderServiceList;
  let fixture: ComponentFixture<ProviderServiceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderServiceList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderServiceList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
