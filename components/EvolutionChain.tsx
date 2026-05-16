'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChainNode, useEvolutionChain } from '@/lib/useEvolutionChain';
import TypeBadge from './TypeBadge';
import { ChevronRight, GitBranch } from 'lucide-react';

interface Props {
  pokemon: {
    id: string;
    name: string;
    image: string;
    types: string[];
    evolutions?: {
      id: string;
      name: string;
      image: string;
      types: string[];
      evolutions?: {
        id: string;
        name: string;
        image: string;
        types: string[];
        evolutions?: {
          id: string;
          name: string;
          image: string;
          types: string[];
        }[] | null;
      }[] | null;
    }[] | null;
  };
}

function ChainNodeCard({
  node,
  index,
  total,
  onClick,
}: {
  node: ChainNode;
  index: number;
  total: number;
  onClick: () => void;
}) {
  const stageLabel =
    index === 0 ? 'Base' : `Stage ${index}`;

  return (
    <div className="flex items-center">
      {/* Arrow connector */}
      {index > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.05 }}
          className="flex shrink-0 items-center px-1 md:px-2"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground/40 md:h-6 md:w-6" />
        </motion.div>
      )}

      {/* Card */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.35 }}
        whileHover={{ scale: 1.04, y: -4 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        aria-label={`View ${node.name}${node.isCurrent ? ' (current)' : ''}`}
        className={`
          group relative flex shrink-0 flex-col items-center gap-2.5 rounded-2xl border p-4 transition-all
          focus:outline-none focus:ring-2 focus:ring-ring/40
          md:gap-3 md:p-5
          ${
            node.isCurrent
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary/20'
              : 'border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
          }
        `}
      >
        {/* Current indicator */}
        {node.isCurrent && (
          <motion.div
            layoutId="current-indicator"
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm"
          >
            Current
          </motion.div>
        )}

        {/* Stage label */}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {stageLabel}
        </span>

        {/* Image */}
        <div
          className={`
            relative h-20 w-20 rounded-xl transition-colors
            md:h-24 md:w-24
            ${node.isCurrent ? 'bg-primary/10' : 'bg-muted/50 group-hover:bg-muted'}
          `}
        >
          {node.image && (
            <Image
              src={node.image}
              alt={node.name}
              fill
              className="object-contain p-1.5 drop-shadow-md"
              sizes="96px"
            />
          )}
        </div>

        {/* Name */}
        <span
          className={`text-sm font-semibold capitalize md:text-base ${
            node.isCurrent ? 'text-primary' : 'text-card-foreground'
          }`}
        >
          {node.name}
        </span>

        {/* ID */}
        <span className="font-mono text-[10px] text-muted-foreground">
          #{node.id}
        </span>

        {/* Type badges */}
        <div className="flex flex-wrap justify-center gap-1">
          {node.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </div>
      </motion.button>
    </div>
  );
}

function ChainSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 py-4 md:gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center">
          {i > 0 && (
            <ChevronRight className="mx-2 h-5 w-5 text-muted-foreground/20" />
          )}
          <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 md:p-5">
            <div className="h-3 w-10 animate-pulse rounded bg-muted" />
            <div className="h-20 w-20 animate-pulse rounded-xl bg-muted md:h-24 md:w-24" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-10 animate-pulse rounded bg-muted" />
            <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EvolutionChain({ pokemon }: Props) {
  const router = useRouter();
  const { chain, loading } = useEvolutionChain(pokemon);

  const handleClick = (name: string) => {
    router.push(`/?name=${encodeURIComponent(name.toLowerCase())}`);
  };

  // Don't render anything if there's no evolution chain (single Pokemon)
  if (!loading && chain.length <= 1) {
    return null;
  }

  return (
    <div>
      {/* Section header */}
      <div className="mb-6 flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Evolution Chain
        </h3>
        {!loading && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {chain.length} stages
          </span>
        )}
      </div>

      {/* Chain display */}
      {loading ? (
        <ChainSkeleton />
      ) : (
        <div className="-mx-2 overflow-x-auto px-2 pb-3 md:-mx-4 md:px-4">
          <div className="flex min-w-min items-center justify-center py-3">
            {chain.map((node, idx) => (
              <ChainNodeCard
                key={node.id || node.name}
                node={node}
                index={idx}
                total={chain.length}
                onClick={() => handleClick(node.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
