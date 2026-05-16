'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SearchX, ArrowRight } from 'lucide-react';

const POPULAR_POKEMON = ['Pikachu', 'Charizard', 'Bulbasaur', 'Eevee', 'Mewtwo'];

export default function NotFound() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchedName = searchParams.get('name') || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10"
      >
        <SearchX className="h-10 w-10 text-destructive" />
      </motion.div>

      {/* Heading */}
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Pokemon Not Found
      </h2>

      {/* Searched term */}
      {searchedName && (
        <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
          {"No Pokemon found for "}
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-mono text-sm font-medium text-foreground">
            {searchedName}
          </span>
        </p>
      )}

      {/* Tips */}
      <div className="mb-8 w-full rounded-xl border border-border bg-card p-4 text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Suggestions
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Check the spelling of the Pokemon name
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Use the autocomplete suggestions as you type
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Only Generation 1 Pokemon (1-151) are available
          </li>
        </ul>
      </div>

      {/* Popular Pokemon */}
      <div className="w-full">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Try one of these
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_POKEMON.map((name) => (
            <button
              key={name}
              onClick={() =>
                router.push(
                  `/?name=${encodeURIComponent(name.toLowerCase())}`
                )
              }
              className="group flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:shadow-sm active:scale-95"
            >
              {name}
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
