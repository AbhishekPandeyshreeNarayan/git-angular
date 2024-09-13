import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterDailogComponent } from './alter-dailog.component';

describe('AlterDailogComponent', () => {
  let component: AlterDailogComponent;
  let fixture: ComponentFixture<AlterDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlterDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlterDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
