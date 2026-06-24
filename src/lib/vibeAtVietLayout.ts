/** Vibe@Viet home-page gallery grid — 11 slots on a 5×8 CSS grid. */

export const VIBE_AT_VIET_SLOT_COUNT = 11;

/** 0-based slot index → Tailwind grid placement classes (desktop). */
export const VIBE_AT_VIET_GRID_CLASSES: Record<number, string> = {
  0: 'row-span-2',
  1: 'row-span-2',
  2: 'row-span-2 col-start-1 row-start-3',
  3: 'row-span-2 col-start-2 row-start-3',
  4: 'row-span-4 col-start-3 row-start-1',
  5: 'col-span-2 row-span-4 col-start-4 row-start-1',
  6: 'col-span-2 row-span-4 col-start-1 row-start-5',
  7: 'row-span-2 col-start-3 row-start-5',
  8: 'row-span-2 col-start-4 row-start-5',
  9: 'col-span-2 row-span-2 col-start-3 row-start-7',
  10: 'row-span-4 col-start-5 row-start-5',
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
  { slot: 7, colStart: 1, colSpan: 2, rowStart: 5, rowSpan: 4 },
  { slot: 8, colStart: 3, colSpan: 1, rowStart: 5, rowSpan: 2 },
  { slot: 9, colStart: 4, colSpan: 1, rowStart: 5, rowSpan: 2 },
  { slot: 10, colStart: 3, colSpan: 2, rowStart: 7, rowSpan: 2 },
  { slot: 11, colStart: 5, colSpan: 1, rowStart: 5, rowSpan: 4 },
];

export type VibeSlotImageSpec = {
  dimensions: string;
  aspectRatio: string;
};

/** Recommended upload size per grid position (1-based). */
export const VIBE_SLOT_IMAGE_SPECS: Record<number, VibeSlotImageSpec> = {
  1: { dimensions: '800 × 1000 px', aspectRatio: '4:5' },
  2: { dimensions: '800 × 1000 px', aspectRatio: '4:5' },
  3: { dimensions: '800 × 1000 px', aspectRatio: '4:5' },
  4: { dimensions: '800 × 1000 px', aspectRatio: '4:5' },
  5: { dimensions: '800 × 2000 px', aspectRatio: '2:5' },
  6: { dimensions: '1200 × 1500 px', aspectRatio: '4:5' },
  7: { dimensions: '1200 × 1500 px', aspectRatio: '4:5' },
  8: { dimensions: '800 × 1000 px', aspectRatio: '4:5' },
  9: { dimensions: '800 × 1000 px', aspectRatio: '4:5' },
  10: { dimensions: '1600 × 1000 px', aspectRatio: '8:5' },
  11: { dimensions: '800 × 2000 px', aspectRatio: '2:5' },
};

export function getVibeSlotImageSpec(slot: number): VibeSlotImageSpec {
  return VIBE_SLOT_IMAGE_SPECS[slot] ?? { dimensions: '800 × 1000 px', aspectRatio: '4:5' };
}

/** Remap legacy 13-slot orders (0-based) to the current 11-slot layout. */
export function remapLegacyVibeOrder(order: number): number {
  if (order <= 8) return order;
  if (order === 9 || order === 10) return 6;
  if (order === 11) return 9;
  if (order === 12) return 10;
  return order;
}
