export type Role = 'operator' | 'cashier' | 'manager'

export type PriceSource = 'scan' | 'shelf' | 'member'
export type Floor = 'F1' | 'F2' | 'F3' | 'B1'
export type Team = '生鲜组' | '日化组' | '食品组' | '饮料组' | '粮油组' | '家居组'

export interface Product {
  id: string
  name: string
  code: string
  category: string
  retailPrice: number
  memberPrice: number | null
  promoPrice: number | null
  promoStartTime: string | null
  promoEndTime: string | null
  promoActive: boolean
  unit: string
  floor: Floor
  team: Team
}

export type PriceTagStatus = 'normal' | 'mismatch' | 'pending_sync' | 'promo_pending'

export interface PriceTag {
  id: string
  productId: string
  shelfPrice: number
  scanPrice: number
  memberPrice: number | null
  status: PriceTagStatus
  lastSyncTime: string
  syncBlocked: boolean
  syncBlockReason: string | null
  anomalySources: PriceSource[]
}

export type SyncTaskStatus = 'queued' | 'ready' | 'executed'

export interface SyncTask {
  id: string
  productId: string
  priceTagId: string
  targetScanPrice: number
  targetShelfPrice: number
  targetMemberPrice: number | null
  reason: string
  status: SyncTaskStatus
  createdAt: string
  executeAt: string | null
  executedAt: string | null
  createdBy: string
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
  observedScanPrice?: number | null
  observedShelfPrice?: number | null
  observedMemberPrice?: number | null
  anomalySources?: PriceSource[]
  category?: string
  floor?: Floor
  team?: Team
}

export type AnomalyType = 'price_mismatch' | 'promo_violation' | 'sync_failure' | 'label_damage'
export type AnomalyStatus = 'pending' | 'confirmed' | 'closed'

export interface ReviewPhoto {
  id: string
  url: string
  uploadedBy: string
  uploadedAt: string
}

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
  anomalySources: PriceSource[]
  category: string
  floor: Floor
  team: Team
  reviewPhotos: ReviewPhoto[]
  reviewNotes: string | null
  reviewBy: string | null
  reviewAt: string | null
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
