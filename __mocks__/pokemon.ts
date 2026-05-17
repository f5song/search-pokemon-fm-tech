import type { Pokemon, Attack } from '@/lib/types';

/**
 * Reusable Pokemon mock data for testing.
 * Contains accurate type information for the three starter Pokemon.
 */

const createAttack = (name: string, type: string, damage: number): Attack => ({
  name,
  type,
  damage,
});

export const bulbasaur: Pokemon = {
  id: 'UG9rZW1vbjowMDE=',
  name: 'Bulbasaur',
  image: 'https://img.pokemondb.net/artwork/bulbasaur.jpg',
  types: ['Grass', 'Poison'],
  classification: 'Seed Pokemon',
  attacks: {
    fast: [
      createAttack('Tackle', 'Normal', 12),
      createAttack('Vine Whip', 'Grass', 7),
    ],
    special: [
      createAttack('Power Whip', 'Grass', 70),
      createAttack('Seed Bomb', 'Grass', 40),
      createAttack('Sludge Bomb', 'Poison', 55),
    ],
  },
  evolutions: [
    {
      id: 'UG9rZW1vbjowMDI=',
      name: 'Ivysaur',
      image: 'https://img.pokemondb.net/artwork/ivysaur.jpg',
      types: ['Grass', 'Poison'],
      evolutions: [
        {
          id: 'UG9rZW1vbjowMDM=',
          name: 'Venusaur',
          image: 'https://img.pokemondb.net/artwork/venusaur.jpg',
          types: ['Grass', 'Poison'],
        },
      ],
    },
  ],
};

export const charmander: Pokemon = {
  id: 'UG9rZW1vbjowMDQ=',
  name: 'Charmander',
  image: 'https://img.pokemondb.net/artwork/charmander.jpg',
  types: ['Fire'],
  classification: 'Lizard Pokemon',
  attacks: {
    fast: [
      createAttack('Ember', 'Fire', 10),
      createAttack('Scratch', 'Normal', 6),
    ],
    special: [
      createAttack('Flame Burst', 'Fire', 30),
      createAttack('Flame Charge', 'Fire', 25),
      createAttack('Flamethrower', 'Fire', 55),
    ],
  },
  evolutions: [
    {
      id: 'UG9rZW1vbjowMDU=',
      name: 'Charmeleon',
      image: 'https://img.pokemondb.net/artwork/charmeleon.jpg',
      types: ['Fire'],
      evolutions: [
        {
          id: 'UG9rZW1vbjowMDY=',
          name: 'Charizard',
          image: 'https://img.pokemondb.net/artwork/charizard.jpg',
          types: ['Fire', 'Flying'],
        },
      ],
    },
  ],
};

export const squirtle: Pokemon = {
  id: 'UG9rZW1vbjowMDc=',
  name: 'Squirtle',
  image: 'https://img.pokemondb.net/artwork/squirtle.jpg',
  types: ['Water'],
  classification: 'Tiny Turtle Pokemon',
  attacks: {
    fast: [
      createAttack('Bubble', 'Water', 25),
      createAttack('Tackle', 'Normal', 12),
    ],
    special: [
      createAttack('Aqua Jet', 'Water', 25),
      createAttack('Aqua Tail', 'Water', 45),
      createAttack('Water Pulse', 'Water', 35),
    ],
  },
  evolutions: [
    {
      id: 'UG9rZW1vbjowMDg=',
      name: 'Wartortle',
      image: 'https://img.pokemondb.net/artwork/wartortle.jpg',
      types: ['Water'],
      evolutions: [
        {
          id: 'UG9rZW1vbjowMDk=',
          name: 'Blastoise',
          image: 'https://img.pokemondb.net/artwork/blastoise.jpg',
          types: ['Water'],
        },
      ],
    },
  ],
};

/**
 * Helper function to get all starter Pokemon as an array.
 */
export const getStarterPokemon = (): Pokemon[] => [
  bulbasaur,
  charmander,
  squirtle,
];

/**
 * Helper function to get a Pokemon by name from the starters.
 */
export const getStarterByName = (name: string): Pokemon | undefined => {
  return getStarterPokemon().find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
};
