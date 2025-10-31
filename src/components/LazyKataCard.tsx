import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { KataCard } from '@/components/KataCard';
import type { Kata } from '@/types';

interface LazyKataCardProps {
  kata: Kata;
  onClick: () => void;
}

export const LazyKataCard = ({ kata, onClick }: LazyKataCardProps) => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '300px'
  });

  if (!hasIntersected) {
    return (
      <div 
        ref={elementRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse overflow-hidden"
      >
        <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
        <div className="p-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div ref={elementRef}>
      <KataCard kata={kata} onClick={onClick} />
    </div>
  );
};