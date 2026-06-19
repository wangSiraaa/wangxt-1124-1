import { useState } from 'react'
import { ClipboardCheck, Camera, Plus, X, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/store'
import type { Inspection, Anomaly, InspectionResult, PriceSource, Floor, Team } from '@/types'
import { categories, floors, teams } from '@/data/mock'

type FilterKey = 'all' | 'normal' | 'anomaly'

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'normal', label: '正常' },
  { key: 'anomaly', label: '异常' },
]

const sourceConfig: Record<PriceSource, { label: string; color: string; bg: string; borderColor: string }> = {
  scan: { label: '扫码价', color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-red-200' },
  shelf: { label: '货架价', color: 'text-orange-600', bg: 'bg-orange-50', borderColor: 'border-orange-200' },
  member: { label: '会员价', color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'border-purple-200' },
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function SourceBadgeList({ sources }: { sources: PriceSource[] }) {
  if (sources.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1">
      {sources.map(s => {
        const cfg = sourceConfig[s]
        return (
          <span
            key={s}
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${cfg.bg} ${cfg.color} ${cfg.borderColor}`}
          >
            {cfg.label}
          </span>
        )
      })}
    </div>
  )
}

function ObservedPrices({ inspection }: { inspection: Inspection }) {
  if (!inspection.observedScanPrice && !inspection.observedShelfPrice && !inspection.observedMemberPrice) {
    return null
  }

  const hasScan = inspection.observedScanPrice != null
  const hasShelf = inspection.observedShelfPrice != null
  const hasMember = inspection.observedMemberPrice != null

  const colCount = [hasScan, hasShelf, hasMember].filter(Boolean).length
  if (colCount === 0) return null

  return (
    <div className="grid gap-2 mt-2" style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}>
      {hasScan && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-2">
          <div className="text-[10px] text-red-500 mb-0.5">扫码价</div>
          <div className="text-sm font-mono font-bold text-red-700">¥{inspection.observedScanPrice!.toFixed(2)}</div>
        </div>
      )}
      {hasShelf && (
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-2">
          <div className="text-[10px] text-orange-500 mb-0.5">货架价</div>
          <div className="text-sm font-mono font-bold text-orange-700">¥{inspection.observedShelfPrice!.toFixed(2)}</div>
        </div>
      )}
      {hasMember && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-2">
          <div className="text-[10px] text-purple-500 mb-0.5">会员价</div>
          <div className="text-sm font-mono font-bold text-purple-700">¥{inspection.observedMemberPrice!.toFixed(2)}</div>
        </div>
      )}
    </div>
  )
}

export default function Inspections() {
  const { inspections, products, currentUser, addInspection, addAnomaly, priceTags } = useAppStore()
  const isOperator = currentUser.role === 'operator'

  const [filter, setFilter] = useState<FilterKey>('all')
  const [showModal, setShowModal] = useState(false)
  const [formProduct, setFormProduct] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [formResult, setFormResult] = useState<InspectionResult>('normal')
  const [formReportAnomaly, setFormReportAnomaly] = useState(true)
  const [anomalySources, setAnomalySources] = useState<PriceSource[]>(['scan', 'shelf'])
  const [observedScanPrice, setObservedScanPrice] = useState('')
  const [observedShelfPrice, setObservedShelfPrice] = useState('')
  const [observedMemberPrice, setObservedMemberPrice] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formFloor, setFormFloor] = useState<Floor | ''>('')
  const [formTeam, setFormTeam] = useState<Team | ''>('')

  const filtered = filter === 'all'
    ? inspections
    : inspections.filter(i => i.result === filter)

  const resetForm = () => {
    setFormProduct('')
    setFormNotes('')
    setFormResult('normal')
    setFormReportAnomaly(true)
    setAnomalySources(['scan', 'shelf'])
    setObservedScanPrice('')
    setObservedShelfPrice('')
    setObservedMemberPrice('')
    setFormCategory('')
    setFormFloor('')
    setFormTeam('')
  }

  const handleOpenModal = () => {
    resetForm()
    setShowModal(true)
  }

  const toggleSource = (source: PriceSource) => {
    setAnomalySources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    )
  }

  const handleSave = () => {
    if (!formProduct) return

    const product = products.find(p => p.id === formProduct)
    if (!product) return

    const now = new Date().toISOString()
    const priceTag = priceTags.find(t => t.productId === formProduct)

    const newInspection: Inspection = {
      id: `ins-${Date.now()}`,
      inspectorId: currentUser.id,
      inspectorName: currentUser.name,
      productId: product.id,
      priceTagId: priceTag?.id || `pt-${product.id}`,
      inspectionTime: now,
      result: formResult,
      photoUrl: null,
      notes: formNotes,
      observedScanPrice: observedScanPrice ? Number(observedScanPrice) : undefined,
      observedShelfPrice: observedShelfPrice ? Number(observedShelfPrice) : undefined,
      observedMemberPrice: observedMemberPrice ? Number(observedMemberPrice) : undefined,
      anomalySources: formResult === 'anomaly' ? anomalySources : [],
      category: formCategory || product.category,
      floor: formFloor || 'F1',
      team: formTeam || '生鲜组',
    }
    addInspection(newInspection)

    if (formResult === 'anomaly' && formReportAnomaly && anomalySources.length > 0) {
      const newAnomaly: Anomaly = {
        id: `anm-${Date.now()}`,
        productId: product.id,
        priceTagId: priceTag?.id || `pt-${product.id}`,
        inspectionId: newInspection.id,
        type: 'price_mismatch',
        description: formNotes || `${product.name}巡检发现${anomalySources.length}处价格异常`,
        status: 'pending',
        reportedBy: currentUser.name,
        reportedAt: now,
        confirmedBy: null,
        confirmedPrice: null,
        confirmedAt: null,
        closedBy: null,
        closedAt: null,
        screenshotLocked: false,
        screenshotUrl: null,
        anomalySources: anomalySources,
        category: formCategory || product.category,
        floor: formFloor || 'F1',
        team: formTeam || '生鲜组',
        reviewPhotos: [],
        reviewNotes: '',
        reviewBy: null,
        reviewAt: null,
      }
      addAnomaly(newAnomaly)
    }

    setShowModal(false)
    resetForm()
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-orange-500" />
          <h1 className="text-xl font-bold text-slate-800">巡检记录</h1>
        </div>
        {isOperator && (
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            新建巡检
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {filterOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(ins => {
          const product = products.find(p => p.id === ins.productId)
          const isAnomaly = ins.result === 'anomaly'

          return (
            <div
              key={ins.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${
                isAnomaly ? 'border-l-red-500' : 'border-l-green-500'
              } p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    {ins.inspectorName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatTime(ins.inspectionTime)}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isAnomaly
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600'
                  }`}
                >
                  {isAnomaly ? '异常' : '正常'}
                </span>
              </div>

              <p className="text-sm text-slate-800 mb-1 font-medium">
                {product?.name ?? ins.productId}
                <span className="text-slate-400 font-normal ml-2 text-xs">{product?.code}</span>
              </p>

              {isAnomaly && ins.anomalySources && ins.anomalySources.length > 0 && (
                <div className="mb-2">
                  <SourceBadgeList sources={ins.anomalySources} />
                </div>
              )}

              {isAnomaly && (
                <ObservedPrices inspection={ins} />
              )}

              {ins.notes && (
                <p className="text-xs text-slate-500 mt-2">{ins.notes}</p>
              )}

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5" />
                    <span className={ins.photoUrl ? 'text-green-600' : 'text-slate-400'}>
                      {ins.photoUrl ? '已拍照' : '未拍照'}
                    </span>
                  </div>
                  {ins.floor && <span>{ins.floor}</span>}
                  {ins.team && <span>{ins.team}</span>}
                </div>
                {ins.category && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                    {ins.category}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">暂无巡检记录</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">新建巡检</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  商品
                </label>
                <select
                  value={formProduct}
                  onChange={e => {
                    setFormProduct(e.target.value)
                    const p = products.find(pr => pr.id === e.target.value)
                    if (p) {
                      setFormCategory(p.category)
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                >
                  <option value="">请选择商品</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.code}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    分类
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">选择分类</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    楼层
                  </label>
                  <select
                    value={formFloor}
                    onChange={e => setFormFloor(e.target.value as Floor | '')}
                    className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">选择楼层</option>
                    {floors.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    班组
                  </label>
                  <select
                    value={formTeam}
                    onChange={e => setFormTeam(e.target.value as Team | '')}
                    className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">选择班组</option>
                    {teams.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  备注
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="请输入备注信息"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  巡检结果
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormResult('normal')}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                      formResult === 'normal'
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    正常
                  </button>
                  <button
                    onClick={() => setFormResult('anomaly')}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                      formResult === 'anomaly'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    异常
                  </button>
                </div>
              </div>

              {formResult === 'anomaly' && (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-slate-700">异常来源</span>
                      <span className="text-xs text-slate-400">（选择哪些价格有异常）</span>
                    </div>
                    <div className="flex gap-2">
                      {(['scan', 'shelf', 'member'] as PriceSource[]).map(source => {
                        const cfg = sourceConfig[source]
                        const selected = anomalySources.includes(source)
                        return (
                          <button
                            key={source}
                            onClick={() => toggleSource(source)}
                            className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors border ${
                              selected
                                ? `${cfg.bg} ${cfg.color} ${cfg.borderColor} border-2`
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            {cfg.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      观察到的价格（元）
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-red-600 mb-1 block">扫码价</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={observedScanPrice}
                          onChange={e => setObservedScanPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-sm font-mono focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-orange-600 mb-1 block">货架价</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={observedShelfPrice}
                          onChange={e => setObservedShelfPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-lg border border-orange-200 bg-orange-50 px-2 py-1.5 text-sm font-mono focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-purple-600 mb-1 block">会员价</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={observedMemberPrice}
                          onChange={e => setObservedMemberPrice(e.target.value)}
                          placeholder="可选"
                          className="w-full rounded-lg border border-purple-200 bg-purple-50 px-2 py-1.5 text-sm font-mono focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={formReportAnomaly}
                      onChange={e => setFormReportAnomaly(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-slate-700">上报异常到异常工单</span>
                  </label>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!formProduct}
                className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
