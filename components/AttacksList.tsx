'use client';

import { motion } from 'framer-motion';
import { Attack } from '@/lib/types';
import { getTypeColor } from '@/lib/pokemon-types';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, Star } from 'lucide-react';

interface Props {
  attacks: {
    fast: Attack[];
    special: Attack[];
  };
}

function AttackChip({ attack, isDark }: { attack: Attack; isDark: boolean }) {
  const colors = getTypeColor(attack.type, isDark);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between rounded-xl border p-3 transition-colors"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>
          {attack.name}
        </span>
        <span className="text-xs font-medium" style={{ color: colors.text }}>
          {attack.type}
        </span>
      </div>
      <div
        className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold"
        style={{
          backgroundColor: `${colors.text}18`,
          color: colors.text,
        }}
      >
        {attack.damage}
        <span className="text-[10px] font-medium opacity-70">DMG</span>
      </div>
    </motion.div>
  );
}

export default function AttacksList({ attacks }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Fast Attacks */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Fast Attacks
          </h3>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {attacks.fast.map((attack, idx) => (
            <AttackChip key={idx} attack={attack} isDark={isDark} />
          ))}
        </div>
      </div>

      {/* Special Attacks */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Special Attacks
          </h3>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {attacks.special.map((attack, idx) => (
            <AttackChip key={idx} attack={attack} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  );
}
