'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Pokemon } from '@/lib/types';
import AttacksList from './AttacksList';
import EvolutionChain from './EvolutionChain';
import TypeBadge from './TypeBadge';

interface Props {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header section */}
        <div className="relative flex flex-col items-center gap-6 p-6 md:flex-row md:items-start md:p-8">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
          </div>

          {/* Pokemon image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl bg-muted/50"
          >
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              fill
              className="relative z-10 object-contain p-2 drop-shadow-lg"
              sizes="192px"
              priority
            />
          </motion.div>

          {/* Pokemon info */}
          <div className="relative flex flex-col items-center gap-3 md:items-start">
            <h1 className="text-3xl font-bold capitalize tracking-tight text-card-foreground">
              {pokemon.name}
            </h1>
            {pokemon.classification && (
              <p className="text-sm text-muted-foreground">
                {pokemon.classification}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border md:mx-8" />

        {/* Attacks section */}
        <div className="p-6 md:p-8">
          <AttacksList attacks={pokemon.attacks} />
        </div>

        {/* Evolution Chain section */}
        <div className="mx-6 border-t border-border md:mx-8" />
        <div className="p-6 md:p-8">
          <EvolutionChain pokemon={pokemon} />
        </div>
      </div>
    </motion.div>
  );
}
