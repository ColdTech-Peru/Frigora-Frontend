import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressServicesComponent } from './in-progress-services';

describe('InProgressServices', () => {
  let component: InProgressServicesComponent;
  let fixture: ComponentFixture<InProgressServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InProgressServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InProgressServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
