/** Vibe@Viet home-page gallery grid — 13 slots on a 5×8 CSS grid. */

export const VIBE_AT_VIET_SLOT_COUNT = 13;

/** 0-based slot index → Tailwind grid placement classes (desktop). */
export const VIBE_AT_VIET_GRID_CLASSES: Record<number, string> = {
  0: 'row-span-2',
  1: 'row-span-2',
  2: 'row-span-2 col-start-1 row-start-3',
  3: 'row-span-2 col-start-2 row-start-3',
  4: 'row-span-4 col-start-3 row-start-1',
  5: 'col-span-2 row-span-4 col-start-4 row-start-1',
  6: 'col-span-2 row-span-2 row-start-5',
  7: 'row-span-2 col-start-3 row-start-5',
  8: 'row-span-2 col-start-4 row-start-5',
  9: 'row-span-2 col-start-1 row-start-7',
  10: 'row-span-2 col-start-2 row-start-7',
  11: 'col-span-2 row-span-2 col-start-3 row-start-7',
  12: 'row-span-4 col-start-5 row-start-5',
};

export function getVibeAtVietGridClass(index: number): string {
  return VIBE_AT_VIET_GRID_CLASSES[index] ?? 'col-span-1 row-span-1';
}

/** 1-based slot number for admin UI and guide rendering. */
export type VibeGridSlot = {
  slot: number;
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
};

export const VIBE_AT_VIET_SLOTS: VibeGridSlot[] = [
  { slot: 1, colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 2 },
  { slot: 2, colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 2 },
  { slot: 3, colStart: 1, colSpan: 1, rowStart: 3, rowSpan: 2 },
  { slot: 4, colStart: 2, colSpan: 1, rowStart: 3, rowSpan: 2 },
  { slot: 5, colStart: 3, colSpan: 1, rowStart: 1, rowSpan: 4 },
  { slot: 6, colStart: 4, colSpan: 2, rowStart: 1, rowSpan: 4 },
  { slot: 7, colStart: 1, colSpan: 2, rowStart: 5, rowSpan: 2 },
  { slot: 8, colStart: 3, colSpan: 1, rowStart: 5, rowSpan: 2 },
  { slot: 9, colStart: 4, colSpan: 1, rowStart: 5, rowSpan: 2 },
  { slot: 10, colStart: 1, colSpan: 1, rowStart: 7, rowSpan: 2 },
  { slot: 11, colStart: 2, colSpan: 1, rowStart: 7, rowSpan: 2 },
  { slot: 12, colStart: 3, colSpan: 2, rowStart: 7, rowSpan: 2 },
  { slot: 13, colStart: 5, colSpan: 1, rowStart: 5, rowSpan: 4 },
];
