import { TestBed } from '@angular/core/testing';
import { ICON_COMPONENTS } from '.';

for (const type of ICON_COMPONENTS) {
    describe(type.name, () => {
        it ('can be created', async () => {
            await TestBed.configureTestingModule({
                declarations: [type],
            }).compileComponents();
            const fixture = TestBed.createComponent(type);
            const component = fixture.componentInstance;
            fixture.detectChanges();
            expect(component).toBeTruthy();
        });
    });
}
