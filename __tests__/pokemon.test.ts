import { bulbasaur, charmander, squirtle, getStarterPokemon, getStarterByName } from '@/__mocks__/pokemon';

describe('Pokemon Mock Data', () => {
  describe('Starter Pokemon Types', () => {
    it('Bulbasaur should have type Grass', () => {
      expect(bulbasaur.types).toContain('Grass');
    });

    it('Charmander should have type Fire', () => {
      expect(charmander.types).toContain('Fire');
    });

    it('Squirtle should have type Water', () => {
      expect(squirtle.types).toContain('Water');
    });
  });

  describe('Pokemon Data Structure', () => {
    it('should have required properties for all starters', () => {
      const starters = getStarterPokemon();

      starters.forEach((pokemon) => {
        expect(pokemon).toHaveProperty('id');
        expect(pokemon).toHaveProperty('name');
        expect(pokemon).toHaveProperty('image');
        expect(pokemon).toHaveProperty('types');
        expect(pokemon).toHaveProperty('classification');
        expect(pokemon).toHaveProperty('attacks');
        expect(pokemon).toHaveProperty('evolutions');
      });
    });

    it('should have valid attacks structure', () => {
      const starters = getStarterPokemon();

      starters.forEach((pokemon) => {
        expect(pokemon.attacks).toHaveProperty('fast');
        expect(pokemon.attacks).toHaveProperty('special');
        expect(Array.isArray(pokemon.attacks.fast)).toBe(true);
        expect(Array.isArray(pokemon.attacks.special)).toBe(true);

        pokemon.attacks.fast.forEach((attack) => {
          expect(attack).toHaveProperty('name');
          expect(attack).toHaveProperty('type');
          expect(attack).toHaveProperty('damage');
          expect(typeof attack.damage).toBe('number');
        });
      });
    });

    it('should have valid evolution chains', () => {
      const starters = getStarterPokemon();

      starters.forEach((pokemon) => {
        expect(pokemon.evolutions).toBeDefined();
        expect(Array.isArray(pokemon.evolutions)).toBe(true);
        expect(pokemon.evolutions!.length).toBeGreaterThan(0);

        // Each starter should have a complete 3-stage evolution
        const firstEvolution = pokemon.evolutions![0];
        expect(firstEvolution).toHaveProperty('id');
        expect(firstEvolution).toHaveProperty('name');
        expect(firstEvolution).toHaveProperty('image');
        expect(firstEvolution).toHaveProperty('types');
        expect(firstEvolution.evolutions).toBeDefined();
        expect(firstEvolution.evolutions!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Secondary Types', () => {
    it('Bulbasaur should also have Poison type', () => {
      expect(bulbasaur.types).toContain('Poison');
      expect(bulbasaur.types).toHaveLength(2);
    });

    it('Charmander should only have Fire type', () => {
      expect(charmander.types).toHaveLength(1);
    });

    it('Squirtle should only have Water type', () => {
      expect(squirtle.types).toHaveLength(1);
    });
  });

  describe('Helper Functions', () => {
    it('getStarterPokemon should return all three starters', () => {
      const starters = getStarterPokemon();
      expect(starters).toHaveLength(3);
      expect(starters.map((p) => p.name)).toEqual([
        'Bulbasaur',
        'Charmander',
        'Squirtle',
      ]);
    });

    it('getStarterByName should find Pokemon case-insensitively', () => {
      expect(getStarterByName('Bulbasaur')).toBe(bulbasaur);
      expect(getStarterByName('bulbasaur')).toBe(bulbasaur);
      expect(getStarterByName('CHARMANDER')).toBe(charmander);
      expect(getStarterByName('squirtle')).toBe(squirtle);
    });

    it('getStarterByName should return undefined for unknown Pokemon', () => {
      expect(getStarterByName('Pikachu')).toBeUndefined();
      expect(getStarterByName('')).toBeUndefined();
    });
  });
});
