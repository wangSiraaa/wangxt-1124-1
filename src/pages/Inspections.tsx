import { useState } from 'react'
import { ClipboardCheck, Camera, Plus, X } from 'lucide-react'
import { useAppStore } from '@/store'
import type { Inspection, Anomaly, InspectionResult } from '@/types'

type FilterKey = 'all' | 'normal' | 'anomaly'

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'normal', label: '正常' },
  { key: 'anomaly', label: '异常' },
]

function formatTime(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Inspections() {
  const { inspections, products, currentUser, addInspection, addAnomaly } = useAppStore()
  const isOperator = currentUser.role === 'operator'

  const [filter, setFilter] = useState<FilterKey>('all')
  const [showModal, setShowModal] = useState(false)
  const [formProduct, setFormProduct] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [formResult, setFormResult] = useState<InspectionResult>('normal')
  const [formReportAnomaly, setFormReportAnomaly] = useState(true)

  const filtered = filter === 'all'
    ? inspections
    : inspections.filter(i => i.result === filter)

  const resetForm = () => {
    setFormProduct('')
    setFormNotes('')
    setFormResult('normal')
    setFormReportAnomaly(true)
  }

  const handleOpenModal = () => {
    resetForm()
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formProduct) return

    const product = products.find(p => p.id === formProduct)
    if (!product) return

    const now = new Date().toISOString()
    const newInspection: Inspection = {
      id: `ins-${Date.now()}`,
      inspectorId: currentUser.id,
      inspectorName: currentUser.name,
      productId: product.id,
      priceTagId: `pt-${product.id}`,
      inspectionTime: now,
      result: formResult,
      photoUrl: null,
      notes: formNotes,
    }
    addInspection(newInspection)

    if (formResult === 'anomaly' && formReportAnomaly) {
      const newAnomaly: Anomaly = {
        id: `anm-${Date.now()}`,
        productId: product.id,
        priceTagId: `pt-${product.id}`,
        inspectionId: newInspection.id,
        type: 'price_mismatch',
        description: formNotes || `${product.name}巡检发现异常`,
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
      }
      addAnomaly(newAnomaly)
    }

    setShowModal(false)
    resetForm()
  }

  return (
    <div className="p-6">
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

              <p className="text-sm text-slate-800 mb-1">
                {product?.name ?? ins.productId}
              </p>

              {ins.notes && (
                <p className="text-xs text-slate-500 mb-2">{ins.notes}</p>
              )}

              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Camera className="h-3.5 w-3.5" />
                <span className={ins.photoUrl ? 'text-green-600' : 'text-slate-400'}>
                  {ins.photoUrl ? '已拍照' : '未拍照'}
                </span>
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
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
                  onChange={e => setFormProduct(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                >
                  <option value="">请选择商品</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formReportAnomaly}
                    onChange={e => setFormReportAnomaly(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-slate-700">上报异常</span>
                </label>
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
