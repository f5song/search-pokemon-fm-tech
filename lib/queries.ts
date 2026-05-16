import { gql } from '@apollo/client';

export const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      id
      name
      image
      types
      classification
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        name
        image
        types
        evolutions {
          id
          name
          image
          types
          evolutions {
            id
            name
            image
            types
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_BASIC = gql`
  query GetPokemonBasic($name: String!) {
    pokemon(name: $name) {
      id
      name
      image
      types
      evolutions {
        id
        name
        image
        types
        evolutions {
          id
          name
          image
          types
          evolutions {
            id
            name
            image
            types
          }
        }
      }
    }
  }
`;

export const GET_ALL_POKEMON_NAMES = gql`
  query GetAllPokemonNames {
    pokemons(first: 151) {
      id
      name
      image
      types
      evolutions {
        id
        name
      }
    }
  }
`;
