export const typeColors: Record<string, { bg: string; text: string; border: string; bgDark: string; textDark: string; borderDark: string }> = {
  Normal:   { bg: '#f5f5f4', text: '#57534e', border: '#d6d3d1', bgDark: '#292524', textDark: '#d6d3d1', borderDark: '#44403c' },
  Fire:     { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', bgDark: '#450a0a', textDark: '#fca5a5', borderDark: '#7f1d1d' },
  Water:    { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', bgDark: '#172554', textDark: '#93c5fd', borderDark: '#1e3a5f' },
  Electric: { bg: '#fefce8', text: '#ca8a04', border: '#fde68a', bgDark: '#422006', textDark: '#fcd34d', borderDark: '#713f12' },
  Grass:    { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', bgDark: '#052e16', textDark: '#86efac', borderDark: '#14532d' },
  Ice:      { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc', bgDark: '#083344', textDark: '#67e8f9', borderDark: '#155e75' },
  Fighting: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', bgDark: '#450a0a', textDark: '#fca5a5', borderDark: '#7f1d1d' },
  Poison:   { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff', bgDark: '#3b0764', textDark: '#c4b5fd', borderDark: '#581c87' },
  Ground:   { bg: '#fefce8', text: '#a16207', border: '#fef08a', bgDark: '#422006', textDark: '#fde047', borderDark: '#713f12' },
  Flying:   { bg: '#eef2ff', text: '#6366f1', border: '#c7d2fe', bgDark: '#1e1b4b', textDark: '#a5b4fc', borderDark: '#312e81' },
  Psychic:  { bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8', bgDark: '#500724', textDark: '#f9a8d4', borderDark: '#831843' },
  Bug:      { bg: '#f0fdf4', text: '#65a30d', border: '#d9f99d', bgDark: '#1a2e05', textDark: '#bef264', borderDark: '#365314' },
  Rock:     { bg: '#fefce8', text: '#a16207', border: '#fef08a', bgDark: '#422006', textDark: '#fde047', borderDark: '#713f12' },
  Ghost:    { bg: '#faf5ff', text: '#7c3aed', border: '#ddd6fe', bgDark: '#2e1065', textDark: '#c4b5fd', borderDark: '#4c1d95' },
  Dragon:   { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe', bgDark: '#1e1b4b', textDark: '#a5b4fc', borderDark: '#312e81' },
  Dark:     { bg: '#f5f5f4', text: '#44403c', border: '#d6d3d1', bgDark: '#1c1917', textDark: '#d6d3d1', borderDark: '#44403c' },
  Steel:    { bg: '#f8fafc', text: '#64748b', border: '#cbd5e1', bgDark: '#0f172a', textDark: '#94a3b8', borderDark: '#334155' },
  Fairy:    { bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8', bgDark: '#500724', textDark: '#f9a8d4', borderDark: '#831843' },
};

export function getTypeColor(type: string, isDark: boolean = false) {
  const color = typeColors[type];
  if (!color) {
    return isDark
      ? { bg: '#1c2035', text: '#94a3b8', border: '#1e293b' }
      : { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
  }
  return isDark
    ? { bg: color.bgDark, text: color.textDark, border: color.borderDark }
    : { bg: color.bg, text: color.text, border: color.border };
}
