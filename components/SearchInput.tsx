'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const query = searchParams.get('name');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?name=${encodeURIComponent(searchTerm.trim().toLowerCase())}`);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    router.push('/');
    inputRef.current?.focus();
  };

  const suggestions = ['Pikachu', 'Charizard', 'Mewtwo', 'Bulbasaur', 'Gengar'];

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <motion.div
          className="relative"
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div
            className={`
              flex items-center gap-3 rounded-2xl border bg-card px-5 py-3.5
              transition-all duration-300
              ${isFocused
                ? 'border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/20'
                : 'border-border shadow-sm hover:border-muted-foreground/30'
              }
            `}
          >
            <Search
              className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                isFocused ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search Pokemon..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-base"
              aria-label="Search for a Pokemon by name"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95"
            >
              Search
            </button>
          </div>
        </motion.div>
      </form>

      {!searchParams.get('name') && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {suggestions.map((name) => (
            <button
              key={name}
              onClick={() => {
                setSearchTerm(name);
                router.push(`/?name=${encodeURIComponent(name.toLowerCase())}`);
              }}
              className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted-foreground/15 active:scale-95"
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
