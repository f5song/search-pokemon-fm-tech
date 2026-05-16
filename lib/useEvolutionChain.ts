'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_POKEMON_NAMES } from '@/lib/queries';

export interface ChainNode {
  id: string;
  name: string;
  image: string;
  types: string[];
  isCurrent: boolean;
}

interface PokemonBasic {
  id: string;
  name: string;
  image: string;
  types: string[];
  evolutions?: PokemonBasic[] | null;
}

interface AllPokemonEntry {
  id: string;
  name: string;
  image: string;
  types: string[];
  evolutions?: { id: string; name: string }[] | null;
}

/**
 * Flattens a nested evolution tree into a linear chain.
 * Assumes a single evolution path (no branching for simplicity).
 */
function flattenEvolutions(pokemon: PokemonBasic): ChainNode[] {
  const nodes: ChainNode[] = [
    {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.types,
      isCurrent: false,
    },
  ];

  let current = pokemon;
  while (current.evolutions && current.evolutions.length > 0) {
    const next = current.evolutions[0];
    nodes.push({
      id: next.id,
      name: next.name,
      image: next.image,
      types: next.types,
      isCurrent: false,
    });
    current = next;
  }

  return nodes;
}

/**
 * Builds a reverse lookup map: pokemonName -> parentName
 * Using the full list of 151 Pokemon from the API.
 */
function buildReverseMap(
  allPokemon: AllPokemonEntry[]
): Map<string, string> {
  const reverseMap = new Map<string, string>();

  for (const pokemon of allPokemon) {
    if (pokemon.evolutions) {
      for (const evo of pokemon.evolutions) {
        reverseMap.set(evo.name, pokemon.name);
      }
    }
  }

  return reverseMap;
}

/**
 * Walks backward from the current Pokemon to find the base form.
 */
function findBaseForm(
  currentName: string,
  reverseMap: Map<string, string>
): string {
  let name = currentName;
  const visited = new Set<string>();

  while (reverseMap.has(name) && !visited.has(name)) {
    visited.add(name);
    name = reverseMap.get(name)!;
  }

  return name;
}

/**
 * Hook that builds the complete evolution chain for a given Pokemon.
 *
 * Strategy:
 * 1. Fetch all 151 Pokemon names + their direct evolutions (cached after first load)
 * 2. Build a reverse lookup map (child -> parent)
 * 3. Walk backward from the current Pokemon to find the base form
 * 4. Walk forward from the base form using the deeply nested evolutions from the main query
 * 5. Mark the current Pokemon in the chain
 */
export function useEvolutionChain(
  currentPokemon: PokemonBasic
): { chain: ChainNode[]; loading: boolean } {
  const { data: allData, loading } = useQuery<{
    pokemons: AllPokemonEntry[];
  }>(GET_ALL_POKEMON_NAMES);

  const chain = useMemo(() => {
    if (!allData?.pokemons) return [];

    const allPokemon = allData.pokemons;
    const reverseMap = buildReverseMap(allPokemon);
    const baseName = findBaseForm(currentPokemon.name, reverseMap);

    // If this Pokemon IS the base form, build chain from its own evolutions
    if (baseName === currentPokemon.name) {
      const nodes: ChainNode[] = [
        {
          id: currentPokemon.id,
          name: currentPokemon.name,
          image: currentPokemon.image,
          types: currentPokemon.types,
          isCurrent: true,
        },
      ];

      // Walk forward from the current Pokemon's nested evolutions
      let current: PokemonBasic | undefined = currentPokemon;
      while (current?.evolutions && current.evolutions.length > 0) {
        const next = current.evolutions[0];
        nodes.push({
          id: next.id,
          name: next.name,
          image: next.image,
          types: next.types,
          isCurrent: false,
        });
        current = next;
      }

      return nodes;
    }

    // Find the base form in allPokemon and use its data to build the chain from there
    const basePokemon = allPokemon.find(
      (p) => p.name === baseName
    );

    if (!basePokemon) return [];

    // Build the chain names starting from the base form
    const chainNames: string[] = [baseName];
    let walkName = baseName;
    const visited = new Set<string>();

    while (!visited.has(walkName)) {
      visited.add(walkName);
      const entry = allPokemon.find((p) => p.name === walkName);
      if (entry?.evolutions && entry.evolutions.length > 0) {
        const nextName = entry.evolutions[0].name;
        chainNames.push(nextName);
        walkName = nextName;
      } else {
        break;
      }
    }

    // Build ChainNodes from allPokemon data
    const nodes: ChainNode[] = chainNames.map((name) => {
      const entry = allPokemon.find((p) => p.name === name);
      return {
        id: entry?.id || '',
        name,
        image: entry?.image || '',
        types: entry?.types || [],
        isCurrent: name === currentPokemon.name,
      };
    });

    return nodes;
  }, [allData, currentPokemon]);

  return { chain, loading };
}
