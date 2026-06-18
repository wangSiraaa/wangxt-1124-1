import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useAppStore } from '@/store'
import { trendData } from '@/data/mock'

const roleLabels: Record<string, string> = {
  operator: '营运员',
  cashier: '收银主管',
  manager: '门店经理',
}

const quickActions: Record<string, { label: string; path: string }[]> = {
  operator: [
    { label: '开始巡检', path: '/inspections' },
    { label: '上报异常', path: '/anomalies' },
  ],
  cashier: [
    { label: '确认价格', path: '/anomalies' },
    { label: '查看价签', path: '/price-tags' },
  ],
  manager: [
    { label: '查看异常', path: '/anomalies' },
    { label: '查看统计', path: '/statistics' },
  ],
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { currentUser, inspections, anomalies } = useAppStore()

  const normalCount = inspections.filter(i => i.result === 'normal').length
  const pendingCount = anomalies.filter(a => a.status === 'pending').length
  const confirmedCount = anomalies.filter(a => a.status === 'confirmed').length
  const closedCount = anomalies.filter(a => a.status === 'closed').length

  const stats = [
    { label: '待巡检', value: normalCount, icon: ClipboardCheck, border: 'border-l-orange-500', iconColor: 'text-orange-500' },
    { label: '异常待确认', value: pendingCount, icon: AlertTriangle, border: 'border-l-red-500', iconColor: 'text-red-500' },
    { label: '已确认待闭环', value: confirmedCount, icon: Clock, border: 'border-l-yellow-500', iconColor: 'text-yellow-500' },
    { label: '今日已闭环', value: closedCount, icon: CheckCircle, border: 'border-l-green-500', iconColor: 'text-green-500' },
  ]

  const actions = quickActions[currentUser.role] || []

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-slate-800">{currentUser.name}</p>
          <p className="text-sm text-slate-500">{roleLabels[currentUser.role]}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map(s => (
          <div
            key={s.label}
            className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${s.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{s.value}</p>
              </div>
              <s.icon className={`w-8 h-8 ${s.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-medium text-slate-800 mb-4">异常趋势（近7天）</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="异常数" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="closed" name="已闭环" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-medium text-slate-800 mb-4">快捷操作</h3>
        <div className="flex gap-3">
          {actions.map(a => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
