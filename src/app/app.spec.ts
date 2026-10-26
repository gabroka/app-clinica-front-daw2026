import { TestBed } from '@angular/core/testing';
import { App } from './app';

//Verifica la correcta inicialización del componente y el renderizado inicial de la interfaz
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  // Prueba  que verifica que el componente raíz se crea exitosamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  //prueba  que verifica que el título esperado se renderiza correctamente en el DOM
  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, app_clinica');
  });
});
