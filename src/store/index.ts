import { create } from 'zustand'
import type { Role, UserInfo, Product, PriceTag, Inspection, Anomaly, AnomalyAction, SyncTask, ReviewPhoto, Floor, Team } from '@/types'
import { users, products, priceTags, inspections, anomalies, anomalyActions, syncTasks } from '@/data/mock'

interface AppState {
  currentUser: UserInfo
  products: Product[]
  priceTags: PriceTag[]
  inspections: Inspection[]
  anomalies: Anomaly[]
  anomalyActions: AnomalyAction[]
  syncTasks: SyncTask[]

  switchRole: (role: Role) => void
  confirmAnomaly: (anomalyId: string, confirmedPrice: number) => void
  closeAnomaly: (anomalyId: string) => void
  addInspection: (inspection: Inspection) => void
  addAnomaly: (anomaly: Anomaly) => void
  getProductsByCategory: (category: string) => Product[]
  getPriceTagByProductId: (productId: string) => PriceTag | undefined
  getAnomaliesByStatus: (status: Anomaly['status']) => Anomaly[]
  getActionsByAnomalyId: (anomalyId: string) => AnomalyAction[]

  addReviewPhoto: (anomalyId: string, photo: ReviewPhoto) => void
  updateReviewNotes: (anomalyId: string, notes: string) => void
  getUnclosedAnomalies: (filters?: { category?: string; floor?: Floor; team?: Team }) => Anomaly[]
  batchCreatePromoTasks: (productIds: string[]) => void
  executeSyncTask: (taskId: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: users[0],
  products: [...products],
  priceTags: [...priceTags],
  inspections: [...inspections],
  anomalies: [...anomalies],
  anomalyActions: [...anomalyActions],
  syncTasks: [...syncTasks],

  switchRole: (role: Role) => {
    const user = users.find(u => u.role === role)!
    set({ currentUser: user })
  },

  confirmAnomaly: (anomalyId: string, confirmedPrice: number) => {
    const user = get().currentUser
    set(state => ({
      anomalies: state.anomalies.map(a =>
        a.id === anomalyId
          ? {
              ...a,
              status: 'confirmed' as const,
              confirmedBy: user.name,
              confirmedPrice,
              confirmedAt: new Date().toISOString(),
            }
          : a
      ),
      anomalyActions: [
        ...state.anomalyActions,
        {
          id: `act-${Date.now()}`,
          anomalyId,
          action: '确认价格',
          operatorId: user.id,
          operatorName: user.name,
          operatorRole: user.role,
          timestamp: new Date().toISOString(),
          remark: `确认实际价格为 ¥${confirmedPrice}`,
        },
      ],
    }))
  },

  closeAnomaly: (anomalyId: string) => {
    const user = get().currentUser
    set(state => ({
      anomalies: state.anomalies.map(a =>
        a.id === anomalyId
          ? {
              ...a,
              status: 'closed' as const,
              closedBy: user.name,
              closedAt: new Date().toISOString(),
              screenshotLocked: true,
            }
          : a
      ),
      anomalyActions: [
        ...state.anomalyActions,
        {
          id: `act-${Date.now()}`,
          anomalyId,
          action: '闭环确认',
          operatorId: user.id,
          operatorName: user.name,
          operatorRole: user.role,
          timestamp: new Date().toISOString(),
          remark: '异常已处理，价签已更正',
        },
      ],
    }))
  },

  addInspection: (inspection: Inspection) => {
    set(state => ({ inspections: [inspection, ...state.inspections] }))
  },

  addAnomaly: (anomaly: Anomaly) => {
    set(state => ({ anomalies: [anomaly, ...state.anomalies] }))
  },

  getProductsByCategory: (category: string) => {
    return get().products.filter(p => p.category === category)
  },

  getPriceTagByProductId: (productId: string) => {
    return get().priceTags.find(t => t.productId === productId)
  },

  getAnomaliesByStatus: (status: Anomaly['status']) => {
    return get().anomalies.filter(a => a.status === status)
  },

  getActionsByAnomalyId: (anomalyId: string) => {
    return get().anomalyActions.filter(a => a.anomalyId === anomalyId)
  },

  addReviewPhoto: (anomalyId: string, photo: ReviewPhoto) => {
    const user = get().currentUser
    set(state => ({
      anomalies: state.anomalies.map(a =>
        a.id === anomalyId
          ? { ...a, reviewPhotos: [...a.reviewPhotos, photo] }
          : a
      ),
      anomalyActions: [
        ...state.anomalyActions,
        {
          id: `act-${Date.now()}`,
          anomalyId,
          action: '追加复查照片',
          operatorId: user.id,
          operatorName: user.name,
          operatorRole: user.role,
          timestamp: new Date().toISOString(),
          remark: '追加复查照片1张',
        },
      ],
    }))
  },

  updateReviewNotes: (anomalyId: string, notes: string) => {
    const user = get().currentUser
    const now = new Date().toISOString()
    set(state => ({
      anomalies: state.anomalies.map(a =>
        a.id === anomalyId
          ? { ...a, reviewNotes: notes, reviewBy: user.name, reviewAt: now }
          : a
      ),
      anomalyActions: [
        ...state.anomalyActions,
        {
          id: `act-${Date.now() + 1}`,
          anomalyId,
          action: '填写复盘说明',
          operatorId: user.id,
          operatorName: user.name,
          operatorRole: user.role,
          timestamp: now,
          remark: notes,
        },
      ],
    }))
  },

  getUnclosedAnomalies: (filters?: { category?: string; floor?: Floor; team?: Team }) => {
    const all = get().anomalies.filter(a => a.status !== 'closed')
    if (!filters) return all
    return all.filter(a => {
      if (filters.category && a.category !== filters.category) return false
      if (filters.floor && a.floor !== filters.floor) return false
      if (filters.team && a.team !== filters.team) return false
      return true
    })
  },

  batchCreatePromoTasks: (productIds: string[]) => {
    const user = get().currentUser
    const now = new Date().toISOString()
    const newTasks: SyncTask[] = productIds.map((pid, idx) => {
      const p = get().products.find(x => x.id === pid)!
      const pt = get().priceTags.find(t => t.productId === pid)!
      return {
        id: `task-batch-${Date.now()}-${idx}`,
        productId: pid,
        priceTagId: pt.id,
        targetScanPrice: p.promoPrice!,
        targetShelfPrice: p.promoPrice!,
        targetMemberPrice: p.memberPrice,
        reason: `批量促销切换：¥${p.retailPrice} → ¥${p.promoPrice}`,
        status: 'queued' as const,
        createdAt: now,
        executeAt: p.promoStartTime!,
        executedAt: null,
        createdBy: user.name,
      }
    })
    set(state => ({ syncTasks: [...newTasks, ...state.syncTasks] }))
  },

  executeSyncTask: (taskId: string) => {
    const now = new Date().toISOString()
    set(state => {
      const task = state.syncTasks.find(t => t.id === taskId)
      if (!task) return state
      return {
        syncTasks: state.syncTasks.map(t =>
          t.id === taskId ? { ...t, status: 'executed' as const, executedAt: now } : t
        ),
        priceTags: state.priceTags.map(pt =>
          pt.id === task.priceTagId
            ? {
                ...pt,
                scanPrice: task.targetScanPrice,
                shelfPrice: task.targetShelfPrice,
                memberPrice: task.targetMemberPrice,
                status: 'normal' as const,
                lastSyncTime: now,
                syncBlocked: false,
                syncBlockReason: null,
                anomalySources: [],
              }
            : pt
        ),
      }
    })
  },
}))
