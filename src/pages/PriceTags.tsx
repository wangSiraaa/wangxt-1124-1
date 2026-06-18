import { useAppStore } from '@/store'
import type { PriceTagStatus, Product, PriceTag } from '@/types'

const statusConfig: Record<PriceTagStatus, { label: string; className: string }> = {
  normal: { label: '正常', className: 'bg-green-100 text-green-700' },
  mismatch: { label: '不一致', className: 'bg-red-100 text-red-700 animate-pulse' },
  pending_sync: { label: '待同步', className: 'bg-blue-100 text-blue-700' },
  promo_pending: { label: '促销待生效', className: 'bg-yellow-100 text-yellow-700' },
}

function formatPrice(value: number) {
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

interface SummaryCardProps {
  label: string
  value: number
  color: string
  bg: string
}

function SummaryCard({ label, value, color, bg }: SummaryCardProps) {
  return (
    <div className={`rounded-xl p-4 ${bg}`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-sm text-gray-600">{label}</div>
    </div>
  )
}

interface RowProps {
  product: Product
  tag: PriceTag
}

function TagRow({ product, tag }: RowProps) {
  const isMismatch = tag.shelfPrice !== tag.scanPrice
  const cfg = statusConfig[tag.status]

  return (
    <tr
      className={`border-b border-gray-50 ${
        isMismatch
          ? 'border-l-4 border-l-red-500 bg-red-50 text-red-700'
          : 'hover:bg-gray-50/50'
      }`}
    >
      <td className={`px-4 py-3 font-medium ${isMismatch ? 'text-red-700' : 'text-gray-900'}`}>
        {product.name}
      </td>
      <td className={`px-4 py-3 font-mono ${isMismatch ? 'text-red-700' : 'text-gray-600'}`}>
        {product.code}
      </td>
      <td className="px-4 py-3 text-right font-mono">
        {isMismatch ? (
          <span className="font-bold text-red-600">{formatPrice(tag.scanPrice)}</span>
        ) : (
          <span className="text-gray-900">{formatPrice(tag.scanPrice)}</span>
        )}
      </td>
      <td className="px-4 py-3 text-right font-mono">
        {isMismatch ? (
          <span className="font-bold text-red-600">{formatPrice(tag.shelfPrice)}</span>
        ) : (
          <span className="text-gray-900">{formatPrice(tag.shelfPrice)}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
        >
          {cfg.label}
        </span>
      </td>
      <td className={`px-4 py-3 text-xs ${isMismatch ? 'text-red-500' : 'text-gray-500'}`}>
        {formatSyncTime(tag.lastSyncTime)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {tag.syncBlocked ? (
            <div className="group relative">
              <button
                disabled
                className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400"
              >
                🚫 同步价签
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {tag.syncBlockReason}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
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
}

export default function PriceTags() {
  const { products, priceTags } = useAppStore()

  const total = priceTags.length
  const normalCount = priceTags.filter((t) => t.status === 'normal').length
  const mismatchCount = priceTags.filter((t) => t.status === 'mismatch').length
  const promoPendingCount = priceTags.filter((t) => t.status === 'promo_pending').length

  const getProduct = (productId: string) => products.find((p) => p.id === productId)!

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">价签状态对比</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="总价签数" value={total} color="text-gray-900" bg="bg-gray-50" />
        <SummaryCard label="正常数" value={normalCount} color="text-green-600" bg="bg-green-50" />
        <SummaryCard
          label="不一致数"
          value={mismatchCount}
          color="text-red-600"
          bg="bg-red-50"
        />
        <SummaryCard
          label="促销待生效数"
          value={promoPendingCount}
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">商品名称</th>
                <th className="px-4 py-3 font-medium">编码</th>
                <th className="px-4 py-3 font-medium text-right">扫码价</th>
                <th className="px-4 py-3 font-medium text-right">货架价</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">上次同步</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {priceTags.map((tag) => (
                <TagRow key={tag.id} product={getProduct(tag.productId)} tag={tag} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
