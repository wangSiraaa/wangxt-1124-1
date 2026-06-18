export type Role = 'operator' | 'cashier' | 'manager'

export interface Product {
  id: string
  name: string
  code: string
  category: string
  retailPrice: number
  promoPrice: number | null
  promoStartTime: string | null
  promoEndTime: string | null
  promoActive: boolean
  unit: string
}

export type PriceTagStatus = 'normal' | 'mismatch' | 'pending_sync' | 'promo_pending'

export interface PriceTag {
  id: string
  productId: string
  shelfPrice: number
  scanPrice: number
  status: PriceTagStatus
  lastSyncTime: string
  syncBlocked: boolean
  syncBlockReason: string | null
}

export type InspectionResult = 'normal' | 'anomaly'

export interface Inspection {
  id: string
  inspectorId: string
  inspectorName: string
  productId: string
  priceTagId: string
  inspectionTime: string
  result: InspectionResult
  photoUrl: string | null
  notes: string
}

export type AnomalyType = 'price_mismatch' | 'promo_violation' | 'sync_failure' | 'label_damage'
export type AnomalyStatus = 'pending' | 'confirmed' | 'closed'

export interface Anomaly {
  id: string
  productId: string
  priceTagId: string
  inspectionId: string | null
  type: AnomalyType
  description: string
  status: AnomalyStatus
  reportedBy: string
  reportedAt: string
  confirmedBy: string | null
  confirmedPrice: number | null
  confirmedAt: string | null
  closedBy: string | null
  closedAt: string | null
  screenshotLocked: boolean
  screenshotUrl: string | null
}

export interface AnomalyAction {
  id: string
  anomalyId: string
  action: string
  operatorId: string
  operatorName: string
  operatorRole: Role
  timestamp: string
  remark: string
}

export interface UserInfo {
  id: string
  name: string
  role: Role
}
