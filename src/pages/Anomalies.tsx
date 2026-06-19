import { useState, useMemo } from 'react'
import { AlertTriangle, Lock, Camera, CheckCircle, Clock, User, Filter, X, Plus, FileText, Image as ImageIcon } from 'lucide-react'
import { useAppStore } from '@/store'
import type { Anomaly, AnomalyStatus, AnomalyType, PriceSource, Floor, Team } from '@/types'
import { categories, floors, teams } from '@/data/mock'

const typeConfig: Record<AnomalyType, { label: string; color: string; bg: string }> = {
  price_mismatch: { label: '价格不一致', color: 'text-red-700', bg: 'bg-red-100' },
  promo_violation: { label: '促销违规', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  sync_failure: { label: '同步失败', color: 'text-blue-700', bg: 'bg-blue-100' },
  label_damage: { label: '标签损坏', color: 'text-purple-700', bg: 'bg-purple-100' },
}

const sourceConfig: Record<PriceSource, { label: string; color: string; bg: string }> = {
  scan: { label: '扫码价', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  shelf: { label: '货架价', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  member: { label: '会员价', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
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

function SourceTags({ sources }: { sources: PriceSource[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sources.map(src => {
        const cfg = sourceConfig[src]
        return (
          <span
            key={src}
            className={`text-xs px-2 py-0.5 rounded-full font-medium border ${cfg.bg} ${cfg.color}`}
          >
            {cfg.label}异常
          </span>
        )
      })}
    </div>
  )
}

function PriceCompare({ anomaly }: { anomaly: Anomaly }) {
  const product = useAppStore(s => s.products.find(p => p.id === anomaly.productId))
  const priceTag = useAppStore(s => s.priceTags.find(t => t.id === anomaly.priceTagId))
  const inspection = useAppStore(s => s.inspections.find(i => i.id === anomaly.inspectionId))

  if (!product || !priceTag) return null

  const observedScan = inspection?.observedScanPrice ?? priceTag.scanPrice
  const observedShelf = inspection?.observedShelfPrice ?? priceTag.shelfPrice
  const observedMember = inspection?.observedMemberPrice ?? priceTag.memberPrice

  const scanMismatch = anomaly.anomalySources.includes('scan')
  const shelfMismatch = anomaly.anomalySources.includes('shelf')
  const memberMismatch = anomaly.anomalySources.includes('member')

  return (
    <div className="bg-slate-50 rounded-lg p-3 space-y-2">
      <p className="text-xs font-medium text-slate-500 mb-2">巡检观察价格</p>
      <div className="grid grid-cols-3 gap-2">
        <div className={`rounded-lg p-2 border ${scanMismatch ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className="text-xs text-slate-500 mb-1">扫码价</div>
          <div className={`text-base font-mono font-bold ${scanMismatch ? 'text-red-600' : 'text-slate-700'}`}>
            ¥{observedScan.toFixed(2)}
          </div>
          {scanMismatch && <span className="text-[10px] text-red-500">异常</span>}
        </div>
        <div className={`rounded-lg p-2 border ${shelfMismatch ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
          <div className="text-xs text-slate-500 mb-1">货架价</div>
          <div className={`text-base font-mono font-bold ${shelfMismatch ? 'text-orange-600' : 'text-slate-700'}`}>
            ¥{observedShelf.toFixed(2)}
          </div>
          {shelfMismatch && <span className="text-[10px] text-orange-500">异常</span>}
        </div>
        <div className={`rounded-lg p-2 border ${memberMismatch ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-200'}`}>
          <div className="text-xs text-slate-500 mb-1">会员价</div>
          <div className={`text-base font-mono font-bold ${memberMismatch ? 'text-purple-600' : 'text-slate-700'}`}>
            {observedMember ? `¥${observedMember.toFixed(2)}` : '—'}
          </div>
          {memberMismatch && <span className="text-[10px] text-purple-500">异常</span>}
        </div>
      </div>
    </div>
  )
}

function ScreenshotArea({ anomaly }: { anomaly: Anomaly }) {
  const isLocked = anomaly.status === 'closed'
  const hasScreenshot = !!anomaly.screenshotUrl

  if (isLocked && hasScreenshot) {
    return (
      <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
          <Camera className="w-10 h-10 text-slate-400" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/40 to-slate-600/60 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-1">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-sm font-medium">原始截图已锁定</span>
          <span className="text-white/70 text-xs mt-0.5">闭环后不可修改</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded px-2 py-0.5 text-xs text-slate-500 z-20">
          原始凭证
        </div>
      </div>
    )
  }

  if (hasScreenshot) {
    return (
      <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
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
    <div className="w-full h-36 rounded-lg overflow-hidden bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center">
      <Camera className="w-8 h-8 text-slate-300 mb-1" />
      <span className="text-xs text-slate-400">暂无现场截图</span>
    </div>
  )
}

function ReviewPhotosSection({ anomaly, onAddPhoto }: { anomaly: Anomaly; onAddPhoto: () => void }) {
  const currentUser = useAppStore(s => s.currentUser)
  const canAdd = currentUser.role === 'manager'

  if (anomaly.status !== 'closed') return null

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">复查照片</span>
          <span className="text-xs text-slate-400">({anomaly.reviewPhotos.length}张)</span>
        </div>
        {canAdd && (
          <button
            onClick={onAddPhoto}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            追加照片
          </button>
        )}
      </div>
      {anomaly.reviewPhotos.length === 0 ? (
        <p className="text-xs text-slate-400">暂无复查照片</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {anomaly.reviewPhotos.map(photo => (
            <div key={photo.id} className="relative aspect-square rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-slate-300" />
              <div className="absolute bottom-1 left-1 right-1 text-[10px] text-slate-500 truncate">
                {photo.uploadedBy}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewNotesSection({ anomaly, onEdit }: { anomaly: Anomaly; onEdit: () => void }) {
  const currentUser = useAppStore(s => s.currentUser)
  const canEdit = currentUser.role === 'manager'

  if (anomaly.status !== 'closed') return null

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">复盘说明</span>
        </div>
        {canEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {anomaly.reviewNotes ? '编辑' : '填写'}
          </button>
        )}
      </div>
      {anomaly.reviewNotes ? (
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-sm text-slate-600 leading-relaxed">{anomaly.reviewNotes}</p>
          {anomaly.reviewBy && anomaly.reviewAt && (
            <p className="text-xs text-slate-400 mt-2">
              — {anomaly.reviewBy} · {new Date(anomaly.reviewAt).toLocaleString('zh-CN')}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400">暂无复盘说明</p>
      )}
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

function ReviewNotesModal({
  initialNotes,
  onSave,
  onCancel,
}: {
  initialNotes: string
  onSave: (notes: string) => void
  onCancel: () => void
}) {
  const [notes, setNotes] = useState(initialNotes)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 mx-4">
        <h3 className="text-base font-semibold text-slate-800 mb-4">填写复盘说明</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="请输入复盘说明，包括原因分析、整改措施等"
          rows={5}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => notes.trim() && onSave(notes.trim())}
            disabled={!notes.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterPanel({
  filters,
  onChange,
  onClose,
}: {
  filters: { category?: string; floor?: Floor; team?: Team }
  onChange: (filters: { category?: string; floor?: Floor; team?: Team }) => void
  onClose: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">筛选条件</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">商品分类</label>
          <select
            value={filters.category || ''}
            onChange={e => onChange({ ...filters, category: e.target.value || undefined })}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">全部分类</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">楼层</label>
          <select
            value={filters.floor || ''}
            onChange={e => onChange({ ...filters, floor: (e.target.value as Floor) || undefined })}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">全部楼层</option>
            {floors.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">责任班组</label>
          <select
            value={filters.team || ''}
            onChange={e => onChange({ ...filters, team: (e.target.value as Team) || undefined })}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">全部班组</option>
            {teams.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <button
          onClick={() => onChange({})}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          重置筛选
        </button>
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
  const { anomalies, currentUser, confirmAnomaly, closeAnomaly, addReviewPhoto, updateReviewNotes } = useAppStore()
  const [activeTab, setActiveTab] = useState<AnomalyStatus | 'all'>('all')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<{ category?: string; floor?: Floor; team?: Team }>({})
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = anomalies
    if (activeTab !== 'all') {
      result = result.filter(a => a.status === activeTab)
    }
    if (filters.category) {
      result = result.filter(a => a.category === filters.category)
    }
    if (filters.floor) {
      result = result.filter(a => a.floor === filters.floor)
    }
    if (filters.team) {
      result = result.filter(a => a.team === filters.team)
    }
    return result
  }, [anomalies, activeTab, filters])

  const counts = {
    all: anomalies.length,
    pending: anomalies.filter(a => a.status === 'pending').length,
    confirmed: anomalies.filter(a => a.status === 'confirmed').length,
    closed: anomalies.filter(a => a.status === 'closed').length,
  }

  const unclosedCount = anomalies.filter(a => a.status !== 'closed').length

  const findProduct = (productId: string) => useAppStore.getState().products.find(p => p.id === productId)

  const handleAddReviewPhoto = (anomalyId: string) => {
    const photo = {
      id: `rp-${Date.now()}`,
      url: `/screenshots/review-${Date.now()}.jpg`,
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString(),
    }
    addReviewPhoto(anomalyId, photo)
  }

  const isManager = currentUser.role === 'manager'

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

      {editingNotesId && (
        <ReviewNotesModal
          initialNotes={anomalies.find(a => a.id === editingNotesId)?.reviewNotes || ''}
          onSave={notes => {
            updateReviewNotes(editingNotesId, notes)
            setEditingNotesId(null)
          }}
          onCancel={() => setEditingNotesId(null)}
        />
      )}

      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h1 className="text-xl font-bold text-slate-800">异常闭环</h1>
        <span className="text-xs text-slate-400 ml-2">
          当前角色：{currentUser.role === 'operator' ? '营运员' : currentUser.role === 'cashier' ? '收银主管' : '门店经理'}
        </span>
        {isManager && (
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            未闭环：{unclosedCount} 条
          </span>
        )}
      </div>

      {isManager && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showFilter || filters.category || filters.floor || filters.team
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            筛选
            {(filters.category || filters.floor || filters.team) && (
              <span className="bg-white/20 text-white text-xs px-1.5 rounded-full">
                {[filters.category && '分类', filters.floor && '楼层', filters.team && '班组'].filter(Boolean).length}
              </span>
            )}
          </button>
          {(filters.category || filters.floor || filters.team) && (
            <button
              onClick={() => setFilters({})}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              清除筛选
            </button>
          )}
        </div>
      )}

      {showFilter && isManager && (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilter(false)}
        />
      )}

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
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm font-mono text-slate-400">{anomaly.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.bg} ${tc.color}`}>
                      {tc.label}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {anomaly.category}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {anomaly.floor}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {anomaly.team}
                    </span>
                  </div>
                  {product && (
                    <p className="text-sm font-semibold text-slate-800">
                      {product.name}
                      <span className="text-slate-400 font-normal ml-2">{product.code}</span>
                    </p>
                  )}
                  <p className="text-sm text-slate-500 mt-1">{anomaly.description}</p>

                  <div className="mt-3">
                    <SourceTags sources={anomaly.anomalySources} />
                  </div>
                </div>
                <div className="shrink-0">
                  <StepIndicator status={anomaly.status} />
                </div>
              </div>

              <div className="mt-4">
                <PriceCompare anomaly={anomaly} />
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

              {anomaly.status === 'closed' && (
                <>
                  <ReviewPhotosSection anomaly={anomaly} onAddPhoto={() => handleAddReviewPhoto(anomaly.id)} />
                  <ReviewNotesSection anomaly={anomaly} onEdit={() => setEditingNotesId(anomaly.id)} />
                </>
              )}

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
