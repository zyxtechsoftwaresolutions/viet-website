import { VIBE_AT_VIET_SLOTS } from '@/lib/vibeAtVietLayout';

type VibeAtVietGridGuideProps = {
  /** 1-based slot number to highlight (e.g. selected position in admin). */
  highlightSlot?: number;
  className?: string;
};

const COLS = 5;
const ROWS = 8;
const GAP = 4;
const CELL_W = 48;
const CELL_H = 18;

const TOTAL_W = COLS * CELL_W + (COLS - 1) * GAP;
const TOTAL_H = ROWS * CELL_H + (ROWS - 1) * GAP;

function slotRect(slot: (typeof VIBE_AT_VIET_SLOTS)[number]) {
  const x = (slot.colStart - 1) * (CELL_W + GAP);
  const y = (slot.rowStart - 1) * (CELL_H + GAP);
  const w = slot.colSpan * CELL_W + (slot.colSpan - 1) * GAP;
  const h = slot.rowSpan * CELL_H + (slot.rowSpan - 1) * GAP;
  return { x, y, w, h };
}

export function VibeAtVietGridGuide({ highlightSlot, className = '' }: VibeAtVietGridGuideProps) {
  return (
    <svg
      viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
      className={`w-full max-w-sm ${className}`}
      role="img"
      aria-label="Vibe@Viet grid layout guide showing 13 numbered positions"
    >
      {VIBE_AT_VIET_SLOTS.map((s) => {
        const { x, y, w, h } = slotRect(s);
        const highlighted = highlightSlot === s.slot;
        const area = s.colSpan * s.rowSpan;
        return (
          <g key={s.slot}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={4}
              fill={highlighted ? '#0a192f' : '#f3f4f6'}
              stroke={highlighted ? '#0a192f' : '#9ca3af'}
              strokeWidth={1.5}
            />
            <text
              x={x + w / 2}
              y={y + h / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill={highlighted ? '#ffffff' : '#0a192f'}
              fontSize={area > 2 ? 13 : 10}
              fontWeight="700"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {s.slot}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default VibeAtVietGridGuide;
