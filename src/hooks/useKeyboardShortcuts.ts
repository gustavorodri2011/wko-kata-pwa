import { useEffect } from 'react';

interface KeyboardShortcuts {
  onSpace?: () => void;
  onEscape?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onF?: () => void; // Fullscreen
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Evitar atajos si el usuario está escribiendo
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          shortcuts.onSpace?.();
          break;
        case 'Escape':
          shortcuts.onEscape?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          shortcuts.onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          shortcuts.onArrowRight?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          shortcuts.onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          shortcuts.onArrowDown?.();
          break;
        case 'KeyF':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            shortcuts.onF?.();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};