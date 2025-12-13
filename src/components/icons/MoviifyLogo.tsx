
import React from 'react';
import { cn } from '@/lib/utils';

export const MoviifyLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 60"
    className={cn(
      'font-headline',
      '[&_.glow]:fill-primary [&_.glow]:[filter:drop-shadow(0_0_0.75rem_hsl(var(--primary)/0.5))]',
      '[&_.film-strip]:fill-primary/20',
      '[&_.play-button]:fill-primary',
      '[&_.pause-bars]:fill-primary-foreground',
      '[&_.main-text]:fill-white',
      className
    )}
    {...props}
  >
    <defs>
      <style>
        {
          "@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');"
        }
      </style>
    </defs>

    {/* Icon: Film strip with Play button */}
    <g className="glow">
      <path
        className="film-strip"
        d="M2 10C2 4.47715 6.47715 0 12 0H48C53.5228 0 58 4.47715 58 10V50C58 55.5228 53.5228 60 48 60H12C6.47715 60 2 55.5228 2 50V10Z"
      />
      <path
        className="play-button"
        d="M26 22.3397C26 21.2352 27.0921 20.6213 28.0064 21.1444L40.0904 28.1444C40.9719 28.6491 40.9719 29.8509 40.0904 30.3556L28.0064 37.3556C27.0921 37.8787 26 37.2648 26 36.1603V22.3397Z"
      />
      {/* Film strip holes */}
      <circle cx="10" cy="8" r="2" fill="hsl(var(--background))" />
      <circle cx="10" cy="18" r="2" fill="hsl(var(--background))" />
      <circle cx="10" cy="28" r="2" fill="hsl(var(--background))" />
      <circle cx="10" cy="38" r="2" fill="hsl(var(--background))" />
      <circle cx="10" cy="48" r="2" fill="hsl(var(--background))" />
      <circle cx="50" cy="8" r="2" fill="hsl(var(--background))" />
      <circle cx="50" cy="18" r="2" fill="hsl(var(--background))" />
      <circle cx="50" cy="28" r="2" fill="hsl(var(--background))" />
      <circle cx="50" cy="38" r="2" fill="hsl(var(--background))" />
      <circle cx="50" cy="48" r="2" fill="hsl(var(--background))" />
    </g>

    {/* Text: MOVIIFY */}
    <g transform="translate(80, 0)">
      <text
        x="0"
        y="42"
        fontSize="48"
        fontWeight="bold"
        className="main-text"
        letterSpacing="2"
      >
        MOV
      </text>

      {/* Stylized 'I's as pause bars */}
      <g className="pause-bars">
        <rect x="135" y="10" width="8" height="35" rx="4" fill='white' />
        <rect x="150" y="10" width="8" height="35" rx="4" fill='white' />

        <rect x="168" y="10" width="8" height="35" rx="4" fill='white' />
        <rect x="183" y="10" width="8" height="35" rx="4" fill='white' />
      </g>

      <text
        x="200"
        y="42"
        fontSize="48"
        fontWeight="bold"
        className="main-text"
        letterSpacing="2"
      >
        FY
      </text>
    </g>
  </svg>
);
