'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GET_POKEMON } from '@/lib/queries';
import { Pokemon } from '@/lib/types';
import SearchInput from '@/components/SearchInput';
import PokemonCard from '@/components/PokemonCard';
import NotFound from '@/components/NotFound';
import { useQuery } from '@apollo/client/react';

function PokemonSearchContent() {
  const searchParams = useSearchParams();
  const pokemonName = searchParams.get('name');

  const { loading, error, data } = useQuery<{ pokemon: Pokemon }>(GET_POKEMON, {
    variables: { name: pokemonName || '' },
    skip: !pokemonName,
  });

  return (
    <>
      {loading && pokemonName && (
        <div className="text-center p-8">
          <div className="animate-spin text-4xl">⚡</div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      )}

      {error && pokemonName && <NotFound />}

      {data?.pokemon && <PokemonCard pokemon={data.pokemon as Pokemon} />}

      {!pokemonName && (
        <div className="text-center p-8 text-gray-500">
          <p className="text-xl">Search for a Pokémon to get started!</p>
          <p className="mt-2">Try: Pikachu, Charizard, Mewtwo</p>
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Pokémon Search
        </h1>
        <SearchInput />
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <PokemonSearchContent />
        </Suspense>
      </div>
    </main>
  );
}