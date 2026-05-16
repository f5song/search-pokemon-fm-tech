'use client';

import { getTypeColor } from '@/lib/pokemon-types';
import { useTheme } from '@/components/ThemeProvider';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const { theme } = useTheme();
  const colors = getTypeColor(type, theme === 'dark');

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span
      className={`${sizeClasses} rounded-full font-medium inline-flex items-center transition-colors`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {type}
    </span>
  );
}
