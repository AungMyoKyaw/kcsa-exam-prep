import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import Fuse from 'fuse.js';
import { glossaryTerms, getAllLetters } from '@/data/glossaryTerms';
import type { GlossaryTerm } from '@/data/glossaryTerms';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function getTermsGroupedByLetter(terms: GlossaryTerm[]): Record<string, GlossaryTerm[]> {
  const groups: Record<string, GlossaryTerm[]> = {};
  terms.forEach((t) => {
    const letter = t.term[0].toUpperCase();
    groups[letter] ??= [];
    groups[letter].push(t);
  });
  // Sort each group alphabetically
  Object.keys(groups).forEach((letter) => {
    groups[letter].sort((a, b) => a.term.localeCompare(b.term));
  });
  return groups;
}

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [manuallyExpanded, setManuallyExpanded] = useState<Set<string>>(new Set());
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Setup Fuse.js
  const fuse = useMemo(
    () =>
      new Fuse(glossaryTerms, {
        keys: ['term', 'acronym', 'definition'],
        threshold: 0.35,
        includeMatches: true,
      }),
    []
  );

  // Filter terms based on search
  const filteredTerms = useMemo(() => {
    if (searchQuery.trim().length === 0) {return glossaryTerms;}
    const results = fuse.search(searchQuery);
    return results.map((r) => r.item);
  }, [searchQuery, fuse]);

  const groupedTerms = useMemo(() => getTermsGroupedByLetter(filteredTerms), [filteredTerms]);
  const availableLetters = useMemo(() => getAllLetters(), []);

  // Derive expanded terms: all filtered terms expand during search; manual toggles when not searching
  const expandedTerms = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return new Set(filteredTerms.map((t) => t.term));
    }
    return manuallyExpanded;
  }, [searchQuery, filteredTerms, manuallyExpanded]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length === 0) {
      setManuallyExpanded(new Set());
    }
  };

  const toggleTerm = (term: string) => {
    if (searchQuery.trim().length > 0) {return;}
    setManuallyExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(term)) {
        next.delete(term);
      } else {
        next.add(term);
      }
      return next;
    });
  };

  const scrollToLetter = (letter: string) => {
    const el = letterRefs.current[letter];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveLetter(letter);
    }
  };

  const getDomainColor = (domainId?: number) => {
    if (domainId === undefined || domainId === 0) {return 'var(--text-tertiary)';}
    const colors = ['', '#9B87F5', '#326CE5', '#045036', '#E87A5D', '#F2C44D', '#A3C4A8'];
    return colors[domainId] || 'var(--text-tertiary)';
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] px-4 py-8 md:px-8">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="text-center mb-8"
        >
          <h1
            className="text-4xl md:text-5xl font-normal mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Glossary
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Searchable definitions of every term in the KCSA curriculum
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.1 }}
          className="relative max-w-[600px] mx-auto mb-8"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search terms, acronyms, concepts..."
            className="w-full h-12 pl-12 pr-4 rounded-full text-base outline-none transition-all duration-300"
            style={{
              backgroundColor: 'var(--surface-base)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--accent-primary)';
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--border-medium)';
            }}
          />
        </motion.div>

        {/* Alphabet Navigation */}
        {searchQuery.trim().length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="sticky top-[60px] z-10 py-3 mb-6 overflow-x-auto"
            style={{ backgroundColor: 'var(--page-bg)' }}
          >
            <div className="flex gap-1 justify-center min-w-max px-2">
              {ALPHABET.map((letter) => {
                const hasTerms = availableLetters.includes(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => hasTerms && scrollToLetter(letter)}
                    disabled={!hasTerms}
                    className="w-9 h-9 rounded-md text-sm font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: activeLetter === letter ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                      color: (() => {
                        if (activeLetter === letter) { return '#fff' }
                        if (hasTerms) { return 'var(--text-secondary)' }
                        return 'var(--text-tertiary)'
                      })(),
                      cursor: hasTerms ? 'pointer' : 'not-allowed',
                      opacity: hasTerms ? 1 : 0.4,
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Term List */}
        {filteredTerms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
              No terms match your search. Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTerms)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, terms]) => (
                <motion.div
                  key={letter}
                  ref={(el) => { letterRefs.current[letter] = el; }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                >
                  {/* Section Header */}
                  <div
                    className="flex items-center gap-4 mb-4 pb-2"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <h2
                      className="text-3xl font-normal"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}
                    >
                      {letter}
                    </h2>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                      {terms.length} term{terms.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Terms */}
                  <div className="space-y-1">
                    {terms.map((term, i) => {
                      const isExpanded = expandedTerms.has(term.term);
                      return (
                        <motion.div
                          key={term.term}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="rounded-xl transition-colors duration-150"
                          style={{
                            backgroundColor: isExpanded ? 'var(--surface-elevated)' : 'transparent',
                            border: '1px solid',
                            borderColor: isExpanded ? 'var(--border-subtle)' : 'transparent',
                          }}
                        >
                          <button
                            onClick={() => toggleTerm(term.term)}
                            className="w-full flex items-start gap-3 p-4 text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-2">
                                <span
                                  className="text-base font-semibold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {term.term}
                                </span>
                                {term.acronym !== undefined && term.acronym !== '' && (
                                  <code
                                    className="text-xs px-2 py-0.5 rounded"
                                    style={{
                                      color: 'var(--accent-lavender)',
                                      backgroundColor: 'var(--accent-lavender-soft)',
                                    }}
                                  >
                                    {term.acronym}
                                  </code>
                                )}
                                {term.domain !== undefined && term.domain !== 0 && (
                                  <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                                    style={{
                                      color: getDomainColor(term.domain),
                                      backgroundColor: `${getDomainColor(term.domain)  }18`,
                                    }}
                                  >
                                    Domain {term.domain}
                                  </span>
                                )}
                              </div>
                              {!isExpanded && (
                                <p className="text-sm mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                                  {term.definition.slice(0, 100)}
                                  {term.definition.length > 100 ? '...' : ''}
                                </p>
                              )}
                            </div>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex-shrink-0 mt-1"
                            >
                              <ChevronDown size={16} style={{ color: 'var(--text-tertiary)' }} />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: easeOutExpo }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4">
                                  <p
                                    className="text-sm leading-relaxed mb-3"
                                    style={{ color: 'var(--text-primary)' }}
                                  >
                                    {term.definition}
                                  </p>
                                  {term.relatedTerms !== undefined && term.relatedTerms.length > 0 && (
                                    <div className="flex items-center flex-wrap gap-2">
                                      <span
                                        className="text-xs font-semibold uppercase tracking-[0.06em]"
                                        style={{ color: 'var(--text-tertiary)' }}
                                      >
                                        See also:
                                      </span>
                                      {term.relatedTerms.map((rt) => (
                                        <button
                                          key={rt}
                                          onClick={() => {
                                            handleSearchChange(rt);
                                          }}
                                          className="text-xs px-2.5 py-1 rounded-full transition-colors duration-200 hover:opacity-80"
                                          style={{
                                            backgroundColor: 'var(--accent-lavender-soft)',
                                            color: 'var(--accent-lavender)',
                                          }}
                                        >
                                          {rt}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
          </div>
        )}

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center pb-8"
        >
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {glossaryTerms.length} terms across {Object.keys(getTermsGroupedByLetter(glossaryTerms)).length} letters
          </p>
        </motion.div>
      </div>
    </div>
  );
}
