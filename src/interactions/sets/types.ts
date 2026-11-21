import type { ReactNode } from 'react';

export interface Spot {
  /** Position in viewBox units. */
  x: number;
  y: number;
  title: string;
  en?: string;
  body: string;
}

export interface HotspotSet {
  question: string;
  how: string;
  width: number;
  height: number;
  draw: ReactNode;
  spots: Spot[];
  /** Shown after every spot has been opened. */
  wrap: ReactNode;
}
