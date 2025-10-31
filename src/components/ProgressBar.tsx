interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar = ({ progress, className = '' }: ProgressBarProps) => {
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 ${className}`}>
      <div 
        className="bg-primary-500 h-1 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
};