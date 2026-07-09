import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder = 'Item',
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={placeholder}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export function StatPairsEditor({
  label,
  stats,
  onChange,
}: {
  label: string;
  stats: { value: string; label: string }[];
  onChange: (stats: { value: string; label: string }[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...stats, { value: '', label: '' }])}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      {stats.map((stat, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <Input
            value={stat.value}
            onChange={(e) => onChange(stats.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)))}
            placeholder="Value"
          />
          <div className="flex gap-2">
            <Input
              value={stat.label}
              onChange={(e) => onChange(stats.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)))}
              placeholder="Label"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => onChange(stats.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ParagraphsEditor({
  label,
  paragraphs,
  onChange,
}: {
  label: string;
  paragraphs: string[];
  onChange: (paragraphs: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...paragraphs, ''])}>
          <Plus className="h-4 w-4 mr-1" /> Add paragraph
        </Button>
      </div>
      {paragraphs.map((p, i) => (
        <div key={i} className="flex gap-2">
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={p}
            onChange={(e) => onChange(paragraphs.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={`Paragraph ${i + 1}`}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(paragraphs.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
