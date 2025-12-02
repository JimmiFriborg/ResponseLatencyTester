import React, { useMemo } from 'react';

export interface AxisSelection {
  axis: string;
  direction: string;
}

export interface AxisCard {
  key: string;
  testCaseName: string;
  executionName: string;
  axis: string;
  direction: string;
  stats: {
    min: number;
    avg: number;
    max: number;
    total: number;
  };
  distanceLabel?: string;
}

export const UniqueSelectedAxes = (selectedAxes: AxisSelection[]): AxisSelection[] => {
  const seen = new Set<string>();
  return selectedAxes.filter((selection) => {
    const key = `${selection.axis}:${selection.direction}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

interface CardsDataViewProps {
  cards: AxisCard[];
  selectedAxes: AxisSelection[];
  onFocusAxis?: (axisKey: string) => void;
}

const formatStat = (label: string, value: number, tone?: 'min' | 'avg' | 'max') => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}:</span>
    <span className={`font-mono font-bold ${tone === 'min' ? 'text-green-600' : tone === 'max' ? 'text-red-600' : 'text-blue-600'}`}>
      {value.toFixed(1)} ms
    </span>
  </div>
);

const CardsDataView: React.FC<CardsDataViewProps> = ({ cards, selectedAxes, onFocusAxis }) => {
  const uniqueSelectedAxes = useMemo(() => UniqueSelectedAxes(selectedAxes), [selectedAxes]);

  return (
    <section aria-label="Cards Data View" className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-gray-500">Data view</p>
          <h2 className="text-xl font-semibold">Axis Execution Cards</h2>
        </div>
        <p data-testid="unique-axes-count" className="text-sm text-gray-600">
          {uniqueSelectedAxes.length} unique {uniqueSelectedAxes.length === 1 ? 'axis' : 'axes'} selected
        </p>
      </header>

      {cards.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-4 text-gray-500 text-sm">No axis cards available.</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const axisKey = `${card.axis}${card.direction}`;
          return (
            <article key={card.key} className="bg-white rounded-lg shadow p-4 border border-blue-50 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase text-gray-500 tracking-wide">{card.testCaseName}</p>
                  <h3 className="text-lg font-semibold text-blue-700">
                    {card.axis} ({card.direction})
                  </h3>
                  <p className="text-sm text-gray-600">{card.executionName}</p>
                  {card.distanceLabel ? (
                    <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                      {card.distanceLabel}
                    </span>
                  ) : null}
                </div>
                {onFocusAxis ? (
                  <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-800" onClick={() => onFocusAxis(axisKey)}>
                    Focus card
                  </button>
                ) : null}
              </div>
              <div className="space-y-2 text-sm">
                {formatStat('Min', card.stats.min, 'min')}
                {formatStat('Avg', card.stats.avg, 'avg')}
                {formatStat('Max', card.stats.max, 'max')}
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Test runs:</span>
                  <span className="font-bold">{card.stats.total}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CardsDataView;
