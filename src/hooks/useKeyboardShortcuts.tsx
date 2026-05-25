import { useEffect, useCallback, useRef } from 'react';

export type ShortcutMap = Record<string, (e: KeyboardEvent) => void | boolean>;

/**
 * Hook for registering global keyboard shortcuts.
 *
 * - Ignores key events when the user is typing in an input/textarea/select.
 * - Supports "1"–"4", "enter", "space", "escape", "?", "f", "n", "p", etc.
 * - Automatically prevents default for matched shortcuts (unless the handler returns `true`).
 * - Uses a stable ref internally so the handler always sees the latest callbacks
 *   without re-binding the native listener.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handler = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable
    ) {
      return;
    }

    let key = e.key.toLowerCase();

    // Treat " " as "space" for convenience
    if (key === ' ') key = 'space';

    const fn = shortcutsRef.current[key];
    if (!fn) return;

    const shouldAllowDefault = fn(e);
    if (shouldAllowDefault !== true) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
}

/**
 * Small helper badge component for showing keyboard shortcut hints.
 * Rendered inside option buttons.
 */
export function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded px-1 py-0 text-[10px] font-bold leading-none ml-auto"
      style={{
        backgroundColor: 'rgba(128,128,128,0.15)',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)',
        minWidth: '16px',
      }}
    >
      {children}
    </span>
  );
}
