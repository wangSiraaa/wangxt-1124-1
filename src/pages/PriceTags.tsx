import { useState, useMemo } from 'react'
import { useAppStore } from '@/store'
import type { PriceTagStatus, Product, PriceTag, PriceSource } from '@/types'
import { Tag, Clock, Zap, CheckCircle, AlertTriangle, ShoppingBag, Play, Square } from 'lucide-react'

const statusConfig: Record<PriceTagStatus, { label: string; className: string }> = {
  normal: { label: '正常', className: 'bg-green-100 text-green-700' },
  mismatch: { label: '不一致', className: 'bg-red-100 text-red-700' },
  pending_sync: { label: '待同步', className: 'bg-blue-100 text-blue-700' },
  promo_pending: { label: '促销待生效', className: 'bg-yellow-100 text-yellow-700' },
}

const sourceConfig: Record<PriceSource, { label: string; color: string; bg: string }> = {
  scan: { label: '扫码', color: 'text-red-600', bg: 'bg-red-50' },
  shelf: { label: '货架', color: 'text-orange-600', bg: 'bg-orange-50' },
  member: { label: '会员', color: 'text-purple-600', bg: 'bg-purple-50' },
}

function formatPrice(value: number | null | undefined) {
  if (value == null) return '—'
  return `¥${value.toFixed(2)}`
}

function formatSyncTime(iso: string) {
  const d = new Date(iso)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${min}`
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('zh-CN')
}

function SummaryCard({
  label,
  value,
  color,
  bg,
  icon: Icon,
}: {
  label: string
  value: number
  color: string
  bg: string
  icon?: any
}) {
  return (
    <div className={`rounded-xl p-4 ${bg}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-5 h-5 ${color}`} />}
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      </div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  )
}

function AnomalySourceBadge({ sources }: { sources: PriceSource[] }) {
  if (sources.length === 0) return null
  return (
    <div className="flex gap-1">
      {sources.map(s => {
        const cfg = sourceConfig[s]
        return (
          <span
            key={s}
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cfg.bg} ${cfg.color}`}
          >
            {cfg.label}
          </span>
        )
      })}
    </div>
  )
}

function PromoTag({ product }: { product: Product }) {
  if (!product.promoPrice || !product.promoStartTime || !product.promoEndTime) return null

  const now = new Date()
  const start = new Date(product.promoStartTime)
  const end = new Date(product.promoEndTime)
  const isActive = now >= start && now <= end
  const isUpcoming = now < start

  return (
    <div className="flex items-center gap-1 mt-1">
      {isActive && (
        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
          <Zap className="w-3 h-3" /> 促销中
        </span>
      )}
      {isUpcoming && (
        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
          <Clock className="w-3 h-3" /> 待生效
        </span>
      )}
    </div>
  )
}

function BatchPromoModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[420px] p-6 mx-4">
        <h3 className="text-base font-semibold text-slate-800 mb-3">批量促销切换</h3>
        <p className="text-sm text-slate-600 mb-4">
          系统将为所有有促销价的商品生成待同步任务。
          促销开始时间之前不会修改价签状态，避免促销价提前泄露。
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-yellow-800 font-medium">注意事项</p>
              <p className="text-xs text-yellow-700 mt-1">
                1. 促销生效前仅生成排队任务，不会修改实际价签<br />
                2. 任务将在促销开始时间自动执行同步<br />
                3. 可在「同步任务」页面查看所有待执行任务
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium"
          >
            确认生成
          </button>
        </div>
      </div>
    </div>
  )
}

function SyncTasksPanel({ onExecute }: { onExecute: (taskId: string) => void }) {
  const syncTasks = useAppStore(s => s.syncTasks)
  const products = useAppStore(s => s.products)
  const currentUser = useAppStore(s => s.currentUser)

  const canExecute = currentUser.role === 'manager' || currentUser.role === 'cashier'

  const getProduct = (productId: string) => products.find(p => p.id === productId)

  const queuedTasks = syncTasks.filter(t => t.status === 'queued')
  const executedTasks = syncTasks.filter(t => t.status === 'executed')

  if (syncTasks.length === 0) return null

  return (
    <div className="rounded-xl bg-white shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-blue-600" />
        <h2 className="text-base font-semibold text-slate-800">同步任务</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          {queuedTasks.length} 个排队中
        </span>
      </div>

      {queuedTasks.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2 font-medium">排队中 · 促销生效后自动执行</p>
          <div className="space-y-2">
            {queuedTasks.slice(0, 5).map(task => {
              const p = getProduct(task.productId)
              const isBlocked = new Date(task.executeAt) > new Date()
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {p?.name || '未知商品'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {task.reason}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      计划执行：{formatDateTime(task.executeAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {isBlocked ? (
                      <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        促销未开始
                      </span>
                    ) : canExecute ? (
                      <button
                        onClick={() => onExecute(task.id)}
                        className="text-[11px] bg-green-600 text-white px-2.5 py-1 rounded font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        立即执行
                      </button>
                    ) : null}
                  </div>
                </div>
              )
            })}
            {queuedTasks.length > 5 && (
              <p className="text-xs text-slate-400 text-center">
                还有 {queuedTasks.length - 5} 个任务...
              </p>
            )}
          </div>
        </div>
      )}

      {executedTasks.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">已执行</p>
          <div className="space-y-2">
            {executedTasks.slice(0, 3).map(task => {
              const p = getProduct(task.productId)
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg border border-green-100"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {p?.name || '未知商品'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {task.reason}
                    </p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium flex items-center gap-1 shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    已执行
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PriceTags() {
  const { products, priceTags, currentUser, batchCreatePromoTasks, executeSyncTask } = useAppStore()
  const [showBatchModal, setShowBatchModal] = useState(false)

  const canBatchPromo = currentUser.role === 'manager' || currentUser.role === 'cashier'

  const total = priceTags.length
  const normalCount = priceTags.filter(t => t.status === 'normal').length
  const mismatchCount = priceTags.filter(t => t.status === 'mismatch').length
  const promoPendingCount = priceTags.filter(t => t.status === 'promo_pending').length

  const promoProducts = useMemo(
    () => products.filter(p => p.promoPrice && p.promoStartTime && p.promoEndTime),
    [products]
  )

  const getProduct = (productId: string) => products.find(p => p.id === productId)!

  const handleBatchPromo = () => {
    const ids = promoProducts.map(p => p.id)
    batchCreatePromoTasks(ids)
    setShowBatchModal(false)
  }

  return (
    <div className="space-y-4 p-6 max-w-5xl mx-auto">
      {showBatchModal && (
        <BatchPromoModal
          onClose={() => setShowBatchModal(false)}
          onConfirm={handleBatchPromo}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-500" />
          <h1 className="text-xl font-bold text-slate-800">价签状态对比</h1>
        </div>
        {canBatchPromo && (
          <button
            onClick={() => setShowBatchModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            批量促销切换
            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
              {promoProducts.length}个商品
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="总价签数" value={total} color="text-slate-900" bg="bg-slate-50" icon={Tag} />
        <SummaryCard label="正常数" value={normalCount} color="text-green-600" bg="bg-green-50" icon={CheckCircle} />
        <SummaryCard label="不一致数" value={mismatchCount} color="text-red-600" bg="bg-red-50" icon={AlertTriangle} />
        <SummaryCard label="促销待生效" value={promoPendingCount} color="text-yellow-600" bg="bg-yellow-50" icon={Clock} />
      </div>

      <SyncTasksPanel onExecute={executeSyncTask} />

      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500 bg-slate-50/50">
                <th className="px-4 py-3 font-medium">商品名称</th>
                <th className="px-4 py-3 font-medium">编码</th>
                <th className="px-4 py-3 font-medium text-right">扫码价</th>
                <th className="px-4 py-3 font-medium text-right">货架价</th>
                <th className="px-4 py-3 font-medium text-right">会员价</th>
                <th className="px-4 py-3 font-medium">异常来源</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">上次同步</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {priceTags.map(tag => {
                const product = getProduct(tag.productId)
                const cfg = statusConfig[tag.status]
                const hasAnomaly = tag.anomalySources.length > 0
                const scanMismatch = tag.anomalySources.includes('scan')
                const shelfMismatch = tag.anomalySources.includes('shelf')
                const memberMismatch = tag.anomalySources.includes('member')

                return (
                  <tr
                    key={tag.id}
                    className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                      hasAnomaly ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span className={`font-medium ${hasAnomaly ? 'text-red-700' : 'text-slate-900'}`}>
                          {product.name}
                        </span>
                        <PromoTag product={product} />
                      </div>
                    </td>
                    <td className={`px-4 py-3 font-mono ${hasAnomaly ? 'text-red-600' : 'text-slate-600'}`}>
                      {product.code}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      <span className={scanMismatch ? 'font-bold text-red-600' : 'text-slate-700'}>
                        {formatPrice(tag.scanPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      <span className={shelfMismatch ? 'font-bold text-orange-600' : 'text-slate-700'}>
                        {formatPrice(tag.shelfPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      <span className={memberMismatch ? 'font-bold text-purple-600' : 'text-slate-500'}>
                        {formatPrice(tag.memberPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AnomalySourceBadge sources={tag.anomalySources} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-xs ${hasAnomaly ? 'text-red-500' : 'text-slate-500'}`}>
                      {formatSyncTime(tag.lastSyncTime)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {tag.syncBlocked ? (
                          <div className="group relative">
                            <button
                              disabled
                              className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400"
                            >
                              <Square className="w-3 h-3" />
                              已暂停
                            </button>
                            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                              {tag.syncBlockReason}
                              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                            </div>
                          </div>
                        ) : (
                          <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-600">
                            同步价签
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
