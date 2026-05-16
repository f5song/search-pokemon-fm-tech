'use client';

import { motion } from 'framer-motion';

export default function PokemonSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        {/* Header skeleton */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="h-48 w-48 animate-pulse rounded-2xl bg-muted" />
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-muted md:mx-0" />
            <div className="mx-auto h-4 w-32 animate-pulse rounded-lg bg-muted md:mx-0" />
            <div className="flex justify-center gap-2 md:justify-start">
              <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>

        {/* Attacks skeleton */}
        <div className="mt-8 space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>

        {/* Evolutions skeleton */}
        <div className="mt-8 space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
