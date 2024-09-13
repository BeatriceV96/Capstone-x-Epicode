import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkListComponent } from './artwork-list.component';

describe('ArtworkListComponent', () => {
  let component: ArtworkListComponent;
  let fixture: ComponentFixture<ArtworkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtworkListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtworkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
