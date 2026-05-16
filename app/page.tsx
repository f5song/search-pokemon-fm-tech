'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GET_POKEMON } from '@/lib/queries';
import { Pokemon } from '@/lib/types';
import SearchInput from '@/components/SearchInput';
import PokemonCard from '@/components/PokemonCard';
import PokemonSkeleton from '@/components/PokemonSkeleton';
import NotFound from '@/components/NotFound';
import EmptyState from '@/components/EmptyState';
import ThemeToggle from '@/components/ThemeToggle';
import { useQuery } from '@apollo/client/react';
import { motion } from 'framer-motion';

function PokemonSearchContent() {
  const searchParams = useSearchParams();
  const pokemonName = searchParams.get('name');

  const { loading, error, data } = useQuery<{ pokemon: Pokemon }>(GET_POKEMON, {
    variables: { name: pokemonName || '' },
    skip: !pokemonName,
  });

  return (
    <>
      {loading && pokemonName && <PokemonSkeleton />}
      {!loading && pokemonName && (error || (data && !data.pokemon)) && (
        <NotFound />
      )}
      {data?.pokemon && <PokemonCard pokemon={data.pokemon as Pokemon} />}
      {!pokemonName && <EmptyState />}
    </>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Background pattern */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-4">
        {/* Header */}
        <header className="flex items-center justify-between pb-2 pt-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-primary-foreground"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              PokeDex
            </span>
          </motion.div>
          <ThemeToggle />
        </header>

        {/* Hero + Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col items-center gap-6 pb-8 pt-12 md:pt-16"
        >
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Pokemon Search
            </h1>
            <p className="mt-3 text-balance text-muted-foreground">
              Explore detailed stats, attacks, and evolution chains for any Pokemon.
            </p>
          </div>
          <SearchInput />
        </motion.div>

        {/* Content */}
        <div className="flex-1 pb-12">
          <Suspense fallback={<PokemonSkeleton />}>
            <PokemonSearchContent />
          </Suspense>
        </div>

        {/* Footer */}
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          Built with Next.js, GraphQL, and Tailwind CSS
        </footer>
      </div>
    </main>
  );
}
