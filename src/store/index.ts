import { create } from 'zustand'
import type { Role, UserInfo, Product, PriceTag, Inspection, Anomaly, AnomalyAction } from '@/types'
import { users, products, priceTags, inspections, anomalies, anomalyActions } from '@/data/mock'

interface AppState {
  currentUser: UserInfo
  products: Product[]
  priceTags: PriceTag[]
  inspections: Inspection[]
  anomalies: Anomaly[]
  anomalyActions: AnomalyAction[]

  switchRole: (role: Role) => void
  confirmAnomaly: (anomalyId: string, confirmedPrice: number) => void
  closeAnomaly: (anomalyId: string) => void
  addInspection: (inspection: Inspection) => void
  addAnomaly: (anomaly: Anomaly) => void
  getProductsByCategory: (category: string) => Product[]
  getPriceTagByProductId: (productId: string) => PriceTag | undefined
  getAnomaliesByStatus: (status: Anomaly['status']) => Anomaly[]
  getActionsByAnomalyId: (anomalyId: string) => AnomalyAction[]
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: users[0],
  products: [...products],
  priceTags: [...priceTags],
  inspections: [...inspections],
  anomalies: [...anomalies],
  anomalyActions: [...anomalyActions],

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
}))
