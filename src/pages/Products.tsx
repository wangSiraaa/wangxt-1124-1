import { useState, Fragment } from 'react'
import { useAppStore } from '@/store'
import { categories } from '@/data/mock'
import type { PriceTagStatus } from '@/types'

const statusConfig: Record<PriceTagStatus, { label: string; className: string }> = {
  normal: { label: '正常', className: 'bg-green-100 text-green-700' },
  mismatch: { label: '不一致', className: 'bg-red-100 text-red-700 animate-pulse' },
  pending_sync: { label: '待同步', className: 'bg-blue-100 text-blue-700' },
  promo_pending: { label: '促销待生效', className: 'bg-yellow-100 text-yellow-700' },
}

function formatPrice(value: number) {
  return `¥${value.toFixed(2)}`
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export default function Products() {
  const { products, priceTags } = useAppStore()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === '全部' || p.category === activeCategory
    const keyword = search.toLowerCase()
    const matchSearch =
      !keyword ||
      p.name.toLowerCase().includes(keyword) ||
      p.code.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    return matchCategory && matchSearch
  })

  const getTag = (productId: string) => priceTags.find((t) => t.productId === productId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">商品列表</h1>
        <span className="text-sm text-gray-500">共 {filtered.length} 件商品</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="搜索商品名称、编码或分类…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {['全部', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">商品编码</th>
                <th className="px-4 py-3 font-medium">商品名称</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium text-right">零售价</th>
                <th className="px-4 py-3 font-medium text-right">促销价</th>
                <th className="px-4 py-3 font-medium">价签状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const tag = getTag(p.id)
                const status = tag?.status ?? 'normal'
                const cfg = statusConfig[status]
                const showPromoWarning = p.promoPrice !== null && !p.promoActive

                return (
                  <Fragment key={p.id}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-gray-600">{p.code}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.category}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">
                        {formatPrice(p.retailPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {p.promoPrice !== null ? (
                          <span className="text-orange-600">{formatPrice(p.promoPrice)}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                    {showPromoWarning && (
                      <tr className="border-b border-yellow-100 bg-yellow-50/60">
                        <td colSpan={6} className="px-4 py-2 text-xs text-yellow-700">
                          ⚠ 促销价{' '}
                          <span className="font-mono font-semibold">
                            {formatPrice(p.promoPrice!)}
                          </span>{' '}
                          将于 {formatDate(p.promoStartTime)} 生效，禁止提前同步
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    暂无匹配商品
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
