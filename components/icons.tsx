import React from 'react';

export const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l-1.12 2.242-2.478.358a.75.75 0 00-.42 1.286l1.794 1.748-.424 2.468a.75.75 0 001.088.79l2.215-1.165 2.215 1.165a.75.75 0 001.088-.79l-.424-2.468 1.794-1.748a.75.75 0 00-.42-1.286l-2.478-.358-1.12-2.242a.75.75 0 00-1.356 0zM6 15.75L4.88 18l-2.478.358a.75.75 0 00-.42 1.286l1.794 1.748-.424 2.468a.75.75 0 001.088.79l2.215-1.165 2.215 1.165a.75.75 0 001.088-.79l-.424-2.468 1.794-1.748a.75.75 0 00-.42-1.286L8.12 18 7 15.75a.75.75 0 00-1 0zM17.25 9l-1.12 2.242-2.478.358a.75.75 0 00-.42 1.286l1.794 1.748-.424 2.468a.75.75 0 001.088.79l2.215-1.165 2.215 1.165a.75.75 0 001.088-.79l-.424-2.468 1.794-1.748a.75.75 0 00-.42-1.286l-2.478-.358L18.25 9a.75.75 0 00-1 0z" />
  </svg>
);


export const LoadingSpinnerIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={`${className} animate-spin`}
  >
    <path
      d="M12 2a10 10 0 1 0 10 10"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="40 80"
    />
  </svg>
);

export const HandIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9.75 4.5l3-2.25 3 2.25M6.75 15l3 2.25-3 2.25m4.5 0h3m2.25-18l-6 18c-1.282 4.04-6.233 4.04-7.515 0l-6-18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5h3v1.5h-3v-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15h3v1.5h-3v-1.5z" />
    </svg>
);

export const ChevronLeftIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const TerminalIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5-3.75h6" />
  </svg>
);

export const BreakpointIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const InfoIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const VariableIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);

export const CallStackIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M6 12l4-4m-4 4l4 4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12l-4 4m4-4l-4-4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 17.25h16.5" />
  </svg>
);

export const PlayIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

export const SettingsIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.008 1.11-1.233l.056-.022c.55-.224 1.157-.102 1.587.285l.047.043.83.829c.39.39.927.585 1.472.585h.286c.545 0 1.066.213 1.448.595l.045.045c.382.382.595.903.595 1.448v.286c0 .545.195 1.082.585 1.472l.829.83.043.047c.388.43.51 1.037.285 1.587l-.022.056c-.225.55-.692 1.02-1.233 1.11l-.06.012c-.542.09-1.042-.04-1.428-.38l-.043-.046-.83-.829a2.25 2.25 0 00-1.472-.585h-.286a2.25 2.25 0 00-1.448.595l-.045.045a2.25 2.25 0 01-.595 1.448v.286c0 .545-.195 1.082-.585 1.472l-.829.83-.043.047c-.388.43-.51 1.037-.285 1.587l.022.056c.225.55.692 1.02 1.233 1.11l.06.012c.542.09 1.042-.04 1.428-.38l.043-.046.83-.829c.39-.39.927-.585 1.472-.585h.286c.545 0 1.066.213 1.448.595l.045.045c.382.382.595.903.595 1.448v.286c0 .545.195 1.082.585 1.472l.829.83.043.047c.388.43.51 1.037.285 1.587l-.022.056c-.225.55-.692 1.02-1.233 1.11l-.06.012c-.542.09-1.042-.04-1.428-.38l-.043-.046-.83-.829a2.25 2.25 0 00-1.472-.585h-.286a2.25 2.25 0 00-1.448.595l-.045.045a2.25 2.25 0 01-.595 1.448v.286c0 .545-.195 1.082-.585 1.472l-.829.83-.043.047c-.388.43-.51 1.037-.285 1.587l.022.056c.225.55.692 1.02 1.233 1.11l.06.012c.542.09 1.042-.04 1.428-.38l.043-.046.83-.829c.39-.39.927-.585 1.472-.585h.286c.545 0 1.066.213 1.448.595l.045.045c.382.382.595.903.595 1.448v.286c0 .545.195 1.082.585 1.472l.829.83.043.047c.388.43.51 1.037-.285 1.587l-.022.056c-.225.55-.692 1.02-1.233 1.11l-.06.012c-.542.09-1.042-.04-1.428-.38l-.043-.046-.83-.829a2.25 2.25 0 00-1.472-.585h-.286a2.25 2.25 0 00-1.448.595l-.045.045a2.25 2.25 0 01-.595 1.448v.286c0 .545-.195 1.082-.585 1.472l-.829.83-.043.047c-.388.43-.51 1.037-.285 1.587l.022.056c.225.55.692 1.02 1.233 1.11l.06.012c.542.09 1.042-.04 1.428-.38l.043-.046.83-.829a2.25 2.25 0 00-1.472-.585h-.286a2.25 2.25 0 00-1.448.595l-.045.045a2.25 2.25 0 01-.595 1.448v.286c0 .545-.195 1.082-.585 1.472l-.829.83-.043.047c-.388.43-.51 1.037-.285 1.587l.022.056c-.225.55-.692 1.02-1.233 1.11l-.06.012c-.542.09-1.042-.04-1.428-.38l-.043-.046-.83-.829a2.25 2.25 0 00-1.472-.585h-.286a2.25 2.25 0 00-1.448.595l-.045.045a2.25 2.25 0 01-.595 1.448v.286c0 .545-.195 1.082-.585 1.472l-.829.83-.043.047c-.388.43-.51 1.037-.285 1.587l.022.056c.225.55.692 1.02 1.233 1.11l.06.012c.542.09 1.042-.04 1.428-.38l.043-.046.83-.829c.39-.39.927-.585 1.472-.585h.286c.545 0 1.066.213 1.448.595l.045.045c.382.382.595.903.595 1.448v.286c0 .545.195 1.082.585 1.472l.829.83.043.047c.388.43.51 1.037-.285 1.587l-.022.056c-.225.55-.692 1.02-1.233 1.11l-.06.012c-.542.09-1.042-.04-1.428-.38l-.043-.046-.83-.829a2.25 2.25 0 00-1.472-.585h-.286a2.25 2.25 0 00-1.448.595l-.045.045a2.25 2.25 0 01-.595 1.448v.286c0 .545-.195 1.082-.585 1.472l-.829.83-.043.047c-.388.43-.51 1.037-.285 1.587l.022.056c.225.55.692 1.02 1.233 1.11a1.5 1.5 0 001.66-.285l.046-.043.83-.829c.39-.39.927-.585 1.472-.585h.286c.545 0 1.066.213 1.448.595l.045.045c.382.382.595.903.595 1.448v.286c0 .545.195 1.082.585 1.472l.829.83.043.047c.388.43.51 1.037.285 1.587l-.022.056c-.225.55-.692 1.02-1.233 1.11" />
  </svg>
);

export const SunIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

export const MoonIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

export const ExportIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);