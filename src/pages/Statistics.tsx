import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react'
import { useAppStore } from '@/store'
import { categoryStats, closureRateTrend } from '@/data/mock'

const TYPE_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#06b6d4']

const TYPE_LABELS: Record<string, string> = {
  price_mismatch: '价格不一致',
  promo_violation: '促销违规',
  sync_failure: '同步失败',
  label_damage: '标签损坏',
}

export default function Statistics() {
  const anomalies = useAppStore(s => s.anomalies)

  const total = anomalies.length
  const pending = anomalies.filter(a => a.status === 'pending').length
  const confirmed = anomalies.filter(a => a.status === 'confirmed').length
  const closed = anomalies.filter(a => a.status === 'closed').length

  const typeStatsMap: Record<string, number> = {}
  for (const a of anomalies) {
    typeStatsMap[a.type] = (typeStatsMap[a.type] || 0) + 1
  }
  const typePieData = Object.entries(typeStatsMap).map(([key, value]) => ({
    name: TYPE_LABELS[key] || key,
    value,
  }))

  const summaryItems = [
    { label: '异常总数', value: total, color: 'text-gray-900' },
    { label: '待处理', value: pending, color: 'text-red-500' },
    { label: '已确认', value: confirmed, color: 'text-amber-500' },
    { label: '已闭环', value: closed, color: 'text-green-600' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryItems.map(item => (
          <div key={item.label} className="bg-white rounded-xl shadow-sm p-5 text-center">
            <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-sm text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">异常类型分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={typePieData}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {typePieData.map((_, index) => (
                  <Cell key={index} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => <span className="text-sm text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">闭环率趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={closureRateTrend}>
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v: number) => `${v}%`} />
              <Tooltip formatter={(value: number) => [`${value}%`, '闭环率']} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: '#f97316' }}
                activeDot={{ r: 6 }}
                fill="url(#rateGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">品类异常排名</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryStats} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" width={72} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#6b7280', fontSize: 12 }}>
                {categoryStats.map((_, index) => (
                  <Cell key={index} fill="#f97316" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
