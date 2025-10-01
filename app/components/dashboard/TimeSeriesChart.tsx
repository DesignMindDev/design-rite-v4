'use client'

interface DataPoint {
  date: string
  [key: string]: number | string
}

interface TimeSeriesChartProps {
  data: DataPoint[]
  title?: string
  xKey: string
  yKeys: string[]
  colors?: string[]
  height?: number
}

export default function TimeSeriesChart({
  data,
  title,
  xKey,
  yKeys,
  colors = ['#3B82F6', '#10B981', '#F59E0B'],
  height = 300
}: TimeSeriesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available for the selected time range
      </div>
    )
  }

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data.map(d => Math.max(...yKeys.map(key => Number(d[key]) || 0)))
  )

  const chartHeight = height - 60 // Reserve space for labels

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {yKeys.map((key, index) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-600 capitalize">
              {key.replace(/_/g, ' ')}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <g key={ratio}>
              <line
                x1="50"
                y1={chartHeight * ratio + 10}
                x2="100%"
                y2={chartHeight * ratio + 10}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x="10"
                y={chartHeight * ratio + 15}
                fill="#9CA3AF"
                fontSize="12"
              >
                {Math.round(maxValue * (1 - ratio))}
              </text>
            </g>
          ))}

          {/* Data lines */}
          {yKeys.map((key, keyIndex) => {
            const points = data.map((d, i) => {
              const x = 50 + (i / (data.length - 1 || 1)) * (100 - 50);
              const value = Number(d[key]) || 0;
              const y = chartHeight * (1 - value / (maxValue || 1)) + 10;
              return `${x}%,${y}`;
            }).join(' ');

            return (
              <polyline
                key={key}
                points={points}
                fill="none"
                stroke={colors[keyIndex % colors.length]}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Data points */}
          {yKeys.map((key, keyIndex) =>
            data.map((d, i) => {
              const x = 50 + (i / (data.length - 1 || 1)) * (100 - 50);
              const value = Number(d[key]) || 0;
              const y = chartHeight * (1 - value / (maxValue || 1)) + 10;

              return (
                <g key={`${key}-${i}`}>
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill={colors[keyIndex % colors.length]}
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                  <title>{`${key}: ${value}`}</title>
                </g>
              );
            })
          )}

          {/* X-axis labels */}
          {data.map((d, i) => {
            // Show every nth label to avoid crowding
            const showEveryN = Math.ceil(data.length / 8);
            if (i % showEveryN !== 0 && i !== data.length - 1) return null;

            const x = 50 + (i / (data.length - 1 || 1)) * (100 - 50);
            const dateStr = String(d[xKey]);
            const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });

            return (
              <text
                key={i}
                x={`${x}%`}
                y={height - 10}
                fill="#9CA3AF"
                fontSize="12"
                textAnchor="middle"
              >
                {formattedDate}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  )
}
