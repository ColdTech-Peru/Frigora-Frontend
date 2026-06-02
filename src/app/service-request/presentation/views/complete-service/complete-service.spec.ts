import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteService } from './complete-service';

describe('CompleteService', () => {
  let component: CompleteService;
  let fixture: ComponentFixture<CompleteService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
