'use client';

import { MoviifyLogo } from '@/components/icons/MoviifyLogo';
import { cn } from '@/lib/utils';

export default function SplashScreen() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-background'
      )}
    >
      <div className="relative">
        <MoviifyLogo
          className={cn(
            'w-64 h-auto text-primary animate-pulse-grow'
          )}
        />
      </div>
    </div>
  );
}
