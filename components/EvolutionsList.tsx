'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Evolution } from '@/lib/types';
import TypeBadge from './TypeBadge';
import { ArrowRight } from 'lucide-react';

interface Props {
  evolutions: Evolution[];
}

export default function EvolutionsList({ evolutions }: Props) {
  const router = useRouter();

  if (!evolutions || evolutions.length === 0) {
    return null;
  }

  const handleEvolutionClick = (name: string) => {
    router.push(`/?name=${encodeURIComponent(name.toLowerCase())}`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Evolutions
        </h3>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {evolutions.map((evolution, idx) => (
          <div key={evolution.id} className="flex items-center gap-3">
            {idx > 0 && (
              <ArrowRight className="hidden h-5 w-5 text-muted-foreground/50 md:block" />
            )}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEvolutionClick(evolution.name)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              <div className="relative h-20 w-20">
                <Image
                  src={evolution.image}
                  alt={evolution.name}
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="80px"
                />
              </div>
              <span className="text-sm font-semibold capitalize text-card-foreground">
                {evolution.name}
              </span>
              <div className="flex gap-1">
                {evolution.types.map((type) => (
                  <TypeBadge key={type} type={type} size="sm" />
                ))}
              </div>
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
}
