'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_POKEMON_NAMES } from '@/lib/queries';

export interface PokemonListEntry {
  id: string;
  name: string;
  image: string;
  types: string[];
}

/**
 * Hook that fetches and caches the full list of 151 Pokemon.
 * Used for client-side search/autocomplete filtering.
 */
export function usePokemonList() {
  const { data, loading } = useQuery<{
    pokemons: PokemonListEntry[];
  }>(GET_ALL_POKEMON_NAMES);

  const pokemons = useMemo(() => data?.pokemons ?? [], [data]);

  return { pokemons, loading };
}

/**
 * Fuzzy-ish search: checks if the query characters appear in order in the name.
 * Falls back to simple includes() for short queries.
 */
export function matchPokemon(name: string, query: string): { matches: boolean; score: number } {
  const lower = name.toLowerCase();
  const q = query.toLowerCase();

  // Exact match
  if (lower === q) return { matches: true, score: 100 };

  // Starts with
  if (lower.startsWith(q)) return { matches: true, score: 90 };

  // Contains
  if (lower.includes(q)) return { matches: true, score: 70 };

  // Subsequence match for longer queries (2+ chars)
  if (q.length >= 2) {
    let qi = 0;
    for (let i = 0; i < lower.length && qi < q.length; i++) {
      if (lower[i] === q[qi]) qi++;
    }
    if (qi === q.length) return { matches: true, score: 40 };
  }

  return { matches: false, score: 0 };
}

/**
 * Highlights the matching portion of a name given a query.
 * Returns an array of { text, highlighted } segments.
 */
export function highlightMatch(
  name: string,
  query: string
): { text: string; highlighted: boolean }[] {
  if (!query) return [{ text: name, highlighted: false }];

  const lower = name.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);

  if (idx === -1) return [{ text: name, highlighted: false }];

  const segments: { text: string; highlighted: boolean }[] = [];
  if (idx > 0) segments.push({ text: name.slice(0, idx), highlighted: false });
  segments.push({ text: name.slice(idx, idx + q.length), highlighted: true });
  if (idx + q.length < name.length) {
    segments.push({ text: name.slice(idx + q.length), highlighted: false });
  }

  return segments;
}
