'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Discover Pokemon
      </h2>
      <p className="leading-relaxed text-muted-foreground">
        Search for any Pokemon to explore their types, attacks, and evolution chains.
        Start by typing a name above.
      </p>
    </motion.div>
  );
}
