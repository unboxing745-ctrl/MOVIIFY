'use client';

import { Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SplashScreen() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-background'
      )}
    >
      <div className="relative">
        <Film
          className={cn(
            'w-24 h-24 text-primary animate-pulse-grow'
          )}
        />
      </div>
    </div>
  );
}
