'use client';

import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Pokemon Not Found
      </h2>
      <p className="leading-relaxed text-muted-foreground">
        {"We couldn't find that Pokemon. Try searching for another one like "}
        <span className="font-medium text-foreground">Pikachu</span>{', '}
        <span className="font-medium text-foreground">Charizard</span>{', or '}
        <span className="font-medium text-foreground">Bulbasaur</span>.
      </p>
    </motion.div>
  );
}
