'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokemonList, matchPokemon, highlightMatch } from '@/lib/usePokemonList';
import TypeBadge from './TypeBadge';

const MAX_RESULTS = 8;
const MAX_RECENT = 5;
const DEBOUNCE_MS = 150;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('pokemon-recent-searches');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(name: string) {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentSearches().filter(
      (s) => s.toLowerCase() !== name.toLowerCase()
    );
    recent.unshift(name);
    localStorage.setItem(
      'pokemon-recent-searches',
      JSON.stringify(recent.slice(0, MAX_RECENT))
    );
  } catch {
    // silently fail
  }
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('pokemon-recent-searches');
  } catch {
    // silently fail
  }
}

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { pokemons, loading: listLoading } = usePokemonList();

  // Sync input value from URL
  useEffect(() => {
    const query = searchParams.get('name');
    if (query) {
      setInputValue(query);
    }
  }, [searchParams]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Filtered results
  const filteredResults = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 1) return [];

    return pokemons
      .map((p) => ({ ...p, ...matchPokemon(p.name, debouncedQuery) }))
      .filter((p) => p.matches)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);
  }, [debouncedQuery, pokemons]);

  const showRecent = isOpen && !debouncedQuery && recentSearches.length > 0;
  const showResults = isOpen && debouncedQuery.length >= 1;
  const showDropdown = showRecent || showResults;

  // Items for keyboard navigation
  const navItems = useMemo(() => {
    if (showRecent) return recentSearches;
    if (showResults) return filteredResults.map((r) => r.name);
    return [];
  }, [showRecent, showResults, recentSearches, filteredResults]);

  const navigateTo = useCallback(
    (name: string) => {
      addRecentSearch(name);
      setRecentSearches(getRecentSearches());
      setInputValue(name);
      setIsOpen(false);
      router.push(`/?name=${encodeURIComponent(name.toLowerCase())}`);
      inputRef.current?.blur();
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && activeIndex < navItems.length) {
      navigateTo(navItems[activeIndex]);
    } else if (inputValue.trim()) {
      navigateTo(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    setDebouncedQuery('');
    router.push('/');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < navItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : navItems.length - 1
        );
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Enter':
        // handled by form submit
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll('[data-item]');
      items[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className="relative"
          animate={{ scale: isOpen ? 1.02 : 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div
            className={`
              flex items-center gap-3 rounded-2xl border bg-card px-5 py-3.5
              transition-all duration-300
              ${isOpen
                ? 'border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/20'
                : 'border-border shadow-sm hover:border-muted-foreground/30'
              }
              ${showDropdown ? 'rounded-b-none border-b-transparent' : ''}
            `}
          >
            {listLoading ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
            ) : (
              <Search
                className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                  isOpen ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
            )}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search Pokemon..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-base"
              aria-label="Search for a Pokemon by name"
              aria-expanded={showDropdown}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0 ? `search-item-${activeIndex}` : undefined
              }
              role="combobox"
              autoComplete="off"
            />
            {inputValue && (
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

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 overflow-hidden rounded-b-2xl border border-t-0 border-primary/50 bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/20"
            role="listbox"
          >
            {/* Recent searches */}
            {showRecent && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Recent
                  </span>
                  <button
                    type="button"
                    onClick={handleClearRecent}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((name, idx) => (
                  <button
                    key={name}
                    data-item
                    id={`search-item-${idx}`}
                    role="option"
                    aria-selected={activeIndex === idx}
                    onClick={() => navigateTo(name)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`
                      flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
                      ${activeIndex === idx ? 'bg-muted' : 'hover:bg-muted/50'}
                    `}
                  >
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium capitalize text-foreground">
                      {name}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </button>
                ))}
              </div>
            )}

            {/* Search results */}
            {showResults && (
              <div className="p-2">
                {filteredResults.length === 0 && !listLoading ? (
                  <div className="px-3 py-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      {"No Pokemon found for "}
                      <span className="font-semibold text-foreground">
                        &ldquo;{debouncedQuery}&rdquo;
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      Check your spelling or try another name
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="px-3 py-1.5">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {filteredResults.map((result, idx) => {
                      const segments = highlightMatch(result.name, debouncedQuery);
                      return (
                        <button
                          key={result.id}
                          data-item
                          id={`search-item-${idx}`}
                          role="option"
                          aria-selected={activeIndex === idx}
                          onClick={() => navigateTo(result.name)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`
                            flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors
                            ${activeIndex === idx ? 'bg-muted' : 'hover:bg-muted/50'}
                          `}
                        >
                          {/* Thumbnail */}
                          <div className="relative h-10 w-10 shrink-0 rounded-lg bg-muted/60">
                            <Image
                              src={result.image}
                              alt={result.name}
                              fill
                              className="object-contain p-0.5"
                              sizes="40px"
                            />
                          </div>

                          {/* Name + types */}
                            <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                            <span className="text-sm font-medium capitalize text-foreground">
                              {segments.map((seg, i) =>
                                seg.highlighted ? (
                                  <mark
                                    key={i}
                                    className="bg-primary/20 text-primary rounded-sm px-0.5"
                                  >
                                    {seg.text}
                                  </mark>
                                ) : (
                                  <span key={i}>{seg.text}</span>
                                )
                              )}
                            </span>
                            <div className="flex items-center gap-1">
                              {result.types.map((type) => (
                                <TypeBadge key={type} type={type} size="sm" />
                              ))}
                            </div>
                          </div>

                          {/* Arrow */}
                          <ArrowRight
                            className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                              activeIndex === idx
                                ? 'text-primary'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* Keyboard hint */}
            <div className="flex items-center gap-3 border-t border-border px-4 py-2">
              <div className="flex items-center gap-1">
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground">
                  &uarr;
                </kbd>
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground">
                  &darr;
                </kbd>
                <span className="text-[10px] text-muted-foreground">navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  &crarr;
                </kbd>
                <span className="text-[10px] text-muted-foreground">select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  esc
                </kbd>
                <span className="text-[10px] text-muted-foreground">close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion chips (only when no search is active and dropdown is closed) */}
      {!searchParams.get('name') && !isOpen && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {['Pikachu', 'Charizard', 'Mewtwo', 'Bulbasaur', 'Gengar'].map((name) => (
            <button
              key={name}
              onClick={() => navigateTo(name)}
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
