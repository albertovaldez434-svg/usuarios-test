import { SearchPipe } from './search-pipe';

describe('SearchPipe', () => {
  let pipe: SearchPipe;

  beforeEach(() => {
    pipe = new SearchPipe();
  });

  it('debe crearse correctamente', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe devolver todos los elementos cuando no hay texto de búsqueda', () => {
    const items = [{ nombre: 'Alberto' }, { nombre: 'Carlos' }];

    expect(pipe.transform(items, '', ['nombre'])).toEqual(items);
  });

  it('debe filtrar elementos por el campo indicado', () => {
    const items = [
      { nombre: 'Alberto', apellidos: 'Valdez' },
      { nombre: 'Crista', apellidos: 'Valdez' },
      { nombre: 'Ana', apellidos: 'García' }
    ];

    expect(pipe.transform(items, 'al', ['nombre'])).toEqual([{ nombre: 'Alberto', apellidos: 'Valdez' }]);
  });

  it('debe buscar en varios campos y devolver los elementos coincidentes', () => {
    const items = [
      { nombre: 'Alberto', apellidos: 'López' },
      { nombre: 'Crista', apellidos: 'Valdez' },
      { nombre: 'Ana', apellidos: 'García' }
    ];

    expect(pipe.transform(items, 'val', ['nombre', 'apellidos'])).toEqual([
      { nombre: 'Crista', apellidos: 'Valdez' }
    ]);
  });
});
