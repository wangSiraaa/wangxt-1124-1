import { useState, useMemo } from 'react'
import { AlertTriangle, Lock, Camera, CheckCircle, Clock, User } from 'lucide-react'
import { useAppStore } from '@/store'
import type { Anomaly, AnomalyStatus, AnomalyType } from '@/types'

const typeConfig: Record<AnomalyType, { label: string; color: string; bg: string }> = {
  price_mismatch: { label: '价格不一致', color: 'text-red-700', bg: 'bg-red-100' },
  promo_violation: { label: '促销违规', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  sync_failure: { label: '同步失败', color: 'text-blue-700', bg: 'bg-blue-100' },
  label_damage: { label: '标签损坏', color: 'text-purple-700', bg: 'bg-purple-100' },
}

const statusTabs: { key: AnomalyStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'confirmed', label: '已确认' },
  { key: 'closed', label: '已闭环' },
]

const steps = ['上报', '确认', '闭环'] as const

function StepIndicator({ status }: { status: AnomalyStatus }) {
  const stepIndex = status === 'pending' ? 0 : status === 'confirmed' ? 1 : 2
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${
                i <= stepIndex
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}
            >
              {i < stepIndex ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs mt-1 ${i <= stepIndex ? 'text-orange-600 font-medium' : 'text-slate-400'}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-10 h-0.5 mx-0.5 mb-4 ${
                i < stepIndex ? 'bg-orange-500' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function ScreenshotArea({ anomaly }: { anomaly: Anomaly }) {
  const isLocked = anomaly.status === 'closed'
  const hasScreenshot = !!anomaly.screenshotUrl

  if (isLocked) {
    return (
      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/60 to-slate-600/70 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-2">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-sm font-medium">截图已锁定</span>
          <span className="text-white/70 text-xs mt-0.5">闭环后不可修改原始凭证</span>
        </div>
        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
          <Camera className="w-12 h-12 text-slate-300" />
        </div>
      </div>
    )
  }

  if (hasScreenshot) {
    return (
      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
          <Camera className="w-10 h-10 text-slate-300" />
        </div>
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded px-2 py-0.5 text-xs text-slate-500">
          现场照片
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center">
      <Camera className="w-8 h-8 text-slate-300 mb-1" />
      <span className="text-xs text-slate-400">暂无现场截图</span>
    </div>
  )
}

function ConfirmPriceModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (price: number) => void
  onCancel: () => void
}) {
  const [price, setPrice] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-80 p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-4">确认价格</h3>
        <label className="block text-sm text-slate-600 mb-1">确认实际价格（元）</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="请输入确认后的实际价格"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => price && onConfirm(Number(price))}
            disabled={!price || Number(price) <= 0}
            className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionTimeline({ anomalyId }: { anomalyId: string }) {
  const anomalyActions = useAppStore(s => s.anomalyActions)
  const actions = useMemo(
    () => anomalyActions.filter(a => a.anomalyId === anomalyId),
    [anomalyActions, anomalyId]
  )
  if (actions.length === 0) return null

  const roleLabels: Record<string, string> = {
    operator: '营运员',
    cashier: '收银主管',
    manager: '门店经理',
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-xs font-medium text-slate-500 mb-3">操作记录</p>
      <div className="space-y-0">
        {actions.map((action, i) => (
          <div key={action.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                  i === actions.length - 1 ? 'bg-orange-500' : 'bg-slate-300'
                }`}
              />
              {i < actions.length - 1 && <div className="w-px flex-1 bg-slate-200 my-0.5" />}
            </div>
            <div className="pb-4 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-700">{action.action}</span>
                <span className="text-xs text-slate-400">
                  {action.operatorName}（{roleLabels[action.operatorRole] || action.operatorRole}）
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{action.remark}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(action.timestamp).toLocaleString('zh-CN')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Anomalies() {
  const { anomalies, currentUser, confirmAnomaly, closeAnomaly } = useAppStore()
  const [activeTab, setActiveTab] = useState<AnomalyStatus | 'all'>('all')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const filtered = activeTab === 'all' ? anomalies : anomalies.filter(a => a.status === activeTab)

  const counts = {
    all: anomalies.length,
    pending: anomalies.filter(a => a.status === 'pending').length,
    confirmed: anomalies.filter(a => a.status === 'confirmed').length,
    closed: anomalies.filter(a => a.status === 'closed').length,
  }

  const findProduct = (productId: string) => useAppStore.getState().products.find(p => p.id === productId)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {confirmingId && (
        <ConfirmPriceModal
          onConfirm={price => {
            confirmAnomaly(confirmingId, price)
            setConfirmingId(null)
          }}
          onCancel={() => setConfirmingId(null)}
        />
      )}

      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h1 className="text-xl font-bold text-slate-800">异常闭环</h1>
        <span className="text-xs text-slate-400 ml-2">当前角色：{currentUser.role === 'operator' ? '营运员' : currentUser.role === 'cashier' ? '收银主管' : '门店经理'}</span>
      </div>

      <div className="flex gap-2 mb-6">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>暂无异常记录</p>
          </div>
        )}

        {filtered.map(anomaly => {
          const product = findProduct(anomaly.productId)
          const tc = typeConfig[anomaly.type]

          return (
            <div key={anomaly.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-slate-400">{anomaly.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.bg} ${tc.color}`}>
                      {tc.label}
                    </span>
                  </div>
                  {product && (
                    <p className="text-sm font-semibold text-slate-800">
                      {product.name}
                      <span className="text-slate-400 font-normal ml-2">{product.code}</span>
                    </p>
                  )}
                  <p className="text-sm text-slate-500 mt-1">{anomaly.description}</p>
                </div>
                <div className="shrink-0">
                  <StepIndicator status={anomaly.status} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  上报人：{anomaly.reportedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(anomaly.reportedAt).toLocaleString('zh-CN')}
                </span>
              </div>

              {anomaly.status !== 'pending' && anomaly.confirmedPrice != null && (
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                  <span>确认价格：<span className="text-orange-600 font-medium">¥{anomaly.confirmedPrice}</span></span>
                  <span>确认人：{anomaly.confirmedBy}</span>
                  {anomaly.confirmedAt && (
                    <span>{new Date(anomaly.confirmedAt).toLocaleString('zh-CN')}</span>
                  )}
                </div>
              )}

              {anomaly.status === 'closed' && (
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                  <span>闭环人：{anomaly.closedBy}</span>
                  {anomaly.closedAt && (
                    <span>{new Date(anomaly.closedAt).toLocaleString('zh-CN')}</span>
                  )}
                </div>
              )}

              <div className="mt-3">
                <ScreenshotArea anomaly={anomaly} />
              </div>

              {currentUser.role === 'cashier' && anomaly.status === 'pending' && (
                <div className="mt-4">
                  <button
                    onClick={() => setConfirmingId(anomaly.id)}
                    className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium"
                  >
                    确认价格
                  </button>
                </div>
              )}

              {currentUser.role === 'manager' && anomaly.status === 'confirmed' && (
                <div className="mt-4">
                  <button
                    onClick={() => closeAnomaly(anomaly.id)}
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
                  >
                    闭环确认
                  </button>
                </div>
              )}

              <ActionTimeline anomalyId={anomaly.id} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
