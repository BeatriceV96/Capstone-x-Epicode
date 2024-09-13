import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkManagementComponent } from './artwork-management.component';

describe('ArtworkManagementComponent', () => {
  let component: ArtworkManagementComponent;
  let fixture: ComponentFixture<ArtworkManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtworkManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtworkManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
