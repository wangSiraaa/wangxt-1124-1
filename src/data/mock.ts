import type { Product, PriceTag, Inspection, Anomaly, AnomalyAction, UserInfo, SyncTask, Floor, Team, PriceSource, ReviewPhoto } from '@/types'

export const users: UserInfo[] = [
  { id: 'u1', name: '张丽华', role: 'operator' },
  { id: 'u2', name: '王建国', role: 'cashier' },
  { id: 'u3', name: '李明远', role: 'manager' },
]

export const floors: Floor[] = ['F1', 'F2', 'F3', 'B1']
export const teams: Team[] = ['生鲜组', '日化组', '食品组', '饮料组', '粮油组', '家居组']
export const categories = ['生鲜果蔬', '乳品饮料', '粮油副食', '日化清洁', '休闲零食', '酒水冲调', '冷冻食品', '家居百货']

const floorTeamMap: Record<string, { floor: Floor; team: Team }> = {
  '生鲜果蔬': { floor: 'F1', team: '生鲜组' },
  '乳品饮料': { floor: 'F2', team: '饮料组' },
  '粮油副食': { floor: 'B1', team: '粮油组' },
  '日化清洁': { floor: 'F3', team: '日化组' },
  '休闲零食': { floor: 'F2', team: '食品组' },
  '酒水冲调': { floor: 'F2', team: '饮料组' },
  '冷冻食品': { floor: 'B1', team: '食品组' },
  '家居百货': { floor: 'F3', team: '家居组' },
}

function getFloorTeam(category: string): { floor: Floor; team: Team } {
  return floorTeamMap[category] || { floor: 'F1', team: '食品组' }
}

function getMemberPrice(retail: number, category: string): number | null {
  if (['生鲜果蔬', '粮油副食'].includes(category)) {
    return Math.round(retail * 0.95 * 100) / 100
  }
  if (['乳品饮料', '日化清洁'].includes(category)) {
    return Math.round(retail * 0.92 * 100) / 100
  }
  return null
}

export const products: Product[] = [
  { id: 'p01', name: '红富士苹果', code: 'SF001', category: '生鲜果蔬', retailPrice: 8.90, memberPrice: getMemberPrice(8.90, '生鲜果蔬'), promoPrice: 5.90, promoStartTime: '2026-06-20T00:00:00', promoEndTime: '2026-06-26T23:59:59', promoActive: false, unit: '斤', ...getFloorTeam('生鲜果蔬') },
  { id: 'p02', name: '有机西兰花', code: 'SF002', category: '生鲜果蔬', retailPrice: 6.50, memberPrice: getMemberPrice(6.50, '生鲜果蔬'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '颗', ...getFloorTeam('生鲜果蔬') },
  { id: 'p03', name: '进口香蕉', code: 'SF003', category: '生鲜果蔬', retailPrice: 4.90, memberPrice: getMemberPrice(4.90, '生鲜果蔬'), promoPrice: 3.50, promoStartTime: '2026-06-20T08:00:00', promoEndTime: '2026-06-22T22:00:00', promoActive: false, unit: '斤', ...getFloorTeam('生鲜果蔬') },
  { id: 'p04', name: '紫甘蓝', code: 'SF004', category: '生鲜果蔬', retailPrice: 5.80, memberPrice: getMemberPrice(5.80, '生鲜果蔬'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '颗', ...getFloorTeam('生鲜果蔬') },
  { id: 'p05', name: '金典纯牛奶', code: 'RP001', category: '乳品饮料', retailPrice: 69.90, memberPrice: getMemberPrice(69.90, '乳品饮料'), promoPrice: 49.90, promoStartTime: '2026-06-19T00:00:00', promoEndTime: '2026-06-25T23:59:59', promoActive: true, unit: '箱', ...getFloorTeam('乳品饮料') },
  { id: 'p06', name: '伊利酸奶', code: 'RP002', category: '乳品饮料', retailPrice: 59.90, memberPrice: getMemberPrice(59.90, '乳品饮料'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '箱', ...getFloorTeam('乳品饮料') },
  { id: 'p07', name: '可口可乐330ml', code: 'RP003', category: '乳品饮料', retailPrice: 2.50, memberPrice: getMemberPrice(2.50, '乳品饮料'), promoPrice: 1.90, promoStartTime: '2026-06-21T00:00:00', promoEndTime: '2026-06-28T23:59:59', promoActive: false, unit: '罐', ...getFloorTeam('乳品饮料') },
  { id: 'p08', name: '农夫山泉550ml', code: 'RP004', category: '乳品饮料', retailPrice: 2.00, memberPrice: getMemberPrice(2.00, '乳品饮料'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '瓶', ...getFloorTeam('乳品饮料') },
  { id: 'p09', name: '金龙鱼菜籽油5L', code: 'LY001', category: '粮油副食', retailPrice: 59.90, memberPrice: getMemberPrice(59.90, '粮油副食'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '桶', ...getFloorTeam('粮油副食') },
  { id: 'p10', name: '福临门大米10kg', code: 'LY002', category: '粮油副食', retailPrice: 49.90, memberPrice: getMemberPrice(49.90, '粮油副食'), promoPrice: 39.90, promoStartTime: '2026-06-22T00:00:00', promoEndTime: '2026-06-28T23:59:59', promoActive: false, unit: '袋', ...getFloorTeam('粮油副食') },
  { id: 'p11', name: '海天生抽1.9L', code: 'LY003', category: '粮油副食', retailPrice: 16.80, memberPrice: getMemberPrice(16.80, '粮油副食'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '瓶', ...getFloorTeam('粮油副食') },
  { id: 'p12', name: '老干妈辣酱280g', code: 'LY004', category: '粮油副食', retailPrice: 9.90, memberPrice: getMemberPrice(9.90, '粮油副食'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '瓶', ...getFloorTeam('粮油副食') },
  { id: 'p13', name: '蓝月亮洗衣液3kg', code: 'RH001', category: '日化清洁', retailPrice: 39.90, memberPrice: getMemberPrice(39.90, '日化清洁'), promoPrice: 29.90, promoStartTime: '2026-06-18T10:00:00', promoEndTime: '2026-06-20T22:00:00', promoActive: true, unit: '瓶', ...getFloorTeam('日化清洁') },
  { id: 'p14', name: '维达抽纸24包', code: 'RH002', category: '日化清洁', retailPrice: 49.90, memberPrice: getMemberPrice(49.90, '日化清洁'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '提', ...getFloorTeam('日化清洁') },
  { id: 'p15', name: '舒肤佳香皂115g', code: 'RH003', category: '日化清洁', retailPrice: 6.90, memberPrice: getMemberPrice(6.90, '日化清洁'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '块', ...getFloorTeam('日化清洁') },
  { id: 'p16', name: '黑人牙膏140g', code: 'RH004', category: '日化清洁', retailPrice: 12.90, memberPrice: getMemberPrice(12.90, '日化清洁'), promoPrice: 9.90, promoStartTime: '2026-06-25T00:00:00', promoEndTime: '2026-06-30T23:59:59', promoActive: false, unit: '支', ...getFloorTeam('日化清洁') },
  { id: 'p17', name: '三只松鼠坚果礼盒', code: 'XL001', category: '休闲零食', retailPrice: 89.90, memberPrice: getMemberPrice(89.90, '休闲零食'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '盒', ...getFloorTeam('休闲零食') },
  { id: 'p18', name: '乐事薯片104g', code: 'XL002', category: '休闲零食', retailPrice: 9.90, memberPrice: getMemberPrice(9.90, '休闲零食'), promoPrice: 7.90, promoStartTime: '2026-06-19T00:00:00', promoEndTime: '2026-06-25T23:59:59', promoActive: true, unit: '袋', ...getFloorTeam('休闲零食') },
  { id: 'p19', name: '奥利奥饼干97g', code: 'XL003', category: '休闲零食', retailPrice: 6.50, memberPrice: getMemberPrice(6.50, '休闲零食'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '包', ...getFloorTeam('休闲零食') },
  { id: 'p20', name: '德芙巧克力43g', code: 'XL004', category: '休闲零食', retailPrice: 5.90, memberPrice: getMemberPrice(5.90, '休闲零食'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '条', ...getFloorTeam('休闲零食') },
  { id: 'p21', name: '青岛啤酒500ml', code: 'JS001', category: '酒水冲调', retailPrice: 4.50, memberPrice: getMemberPrice(4.50, '酒水冲调'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '罐', ...getFloorTeam('酒水冲调') },
  { id: 'p22', name: '五粮液52度500ml', code: 'JS002', category: '酒水冲调', retailPrice: 1099.00, memberPrice: getMemberPrice(1099.00, '酒水冲调'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '瓶', ...getFloorTeam('酒水冲调') },
  { id: 'p23', name: '雀巢速溶咖啡200g', code: 'JS003', category: '酒水冲调', retailPrice: 39.90, memberPrice: getMemberPrice(39.90, '酒水冲调'), promoPrice: 29.90, promoStartTime: '2026-06-23T00:00:00', promoEndTime: '2026-06-29T23:59:59', promoActive: false, unit: '瓶', ...getFloorTeam('酒水冲调') },
  { id: 'p24', name: '安井速冻水饺1kg', code: 'LD001', category: '冷冻食品', retailPrice: 19.90, memberPrice: getMemberPrice(19.90, '冷冻食品'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '袋', ...getFloorTeam('冷冻食品') },
  { id: 'p25', name: '必品阁王饺子420g', code: 'LD002', category: '冷冻食品', retailPrice: 24.90, memberPrice: getMemberPrice(24.90, '冷冻食品'), promoPrice: 19.90, promoStartTime: '2026-06-20T00:00:00', promoEndTime: '2026-06-26T23:59:59', promoActive: false, unit: '袋', ...getFloorTeam('冷冻食品') },
  { id: 'p26', name: '三全汤圆400g', code: 'LD003', category: '冷冻食品', retailPrice: 12.90, memberPrice: getMemberPrice(12.90, '冷冻食品'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '袋', ...getFloorTeam('冷冻食品') },
  { id: 'p27', name: '不锈钢保温杯500ml', code: 'JJ001', category: '家居百货', retailPrice: 49.90, memberPrice: getMemberPrice(49.90, '家居百货'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '个', ...getFloorTeam('家居百货') },
  { id: 'p28', name: '竹纤维毛巾', code: 'JJ002', category: '家居百货', retailPrice: 15.90, memberPrice: getMemberPrice(15.90, '家居百货'), promoPrice: 12.90, promoStartTime: '2026-06-24T00:00:00', promoEndTime: '2026-06-30T23:59:59', promoActive: false, unit: '条', ...getFloorTeam('家居百货') },
  { id: 'p29', name: '保鲜盒三件套', code: 'JJ003', category: '家居百货', retailPrice: 29.90, memberPrice: getMemberPrice(29.90, '家居百货'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '套', ...getFloorTeam('家居百货') },
  { id: 'p30', name: '蓝漂洗衣粉1.5kg', code: 'RH005', category: '日化清洁', retailPrice: 15.90, memberPrice: getMemberPrice(15.90, '日化清洁'), promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '袋', ...getFloorTeam('日化清洁') },
]

const mismatchProducts = ['p02', 'p04', 'p06', 'p09', 'p12', 'p14', 'p17', 'p20', 'p21', 'p27']
const promoPendingProducts = ['p01', 'p03', 'p07', 'p10', 'p16', 'p23', 'p25', 'p28']
const memberMismatchProducts = ['p02', 'p06', 'p12', 'p17']

function getAnomalySources(pid: string, hasMemberMismatch: boolean, isMismatch: boolean): PriceSource[] {
  const sources: PriceSource[] = []
  if (isMismatch) {
    sources.push('scan', 'shelf')
  }
  if (hasMemberMismatch) {
    sources.push('member')
  }
  return sources
}

export const priceTags: PriceTag[] = products.map(p => {
  const isMismatch = mismatchProducts.includes(p.id)
  const isPromoPending = promoPendingProducts.includes(p.id) && !p.promoActive
  const hasMemberMismatch = memberMismatchProducts.includes(p.id) && !!p.memberPrice
  const shelfPrice = isMismatch ? Math.round(p.retailPrice * (p.id.charCodeAt(2) % 2 === 0 ? 1.1 : 0.9) * 100) / 100 : p.retailPrice
  const scanPrice = p.retailPrice
  const memberPrice = hasMemberMismatch && p.memberPrice ? Math.round(p.memberPrice * 1.1 * 100) / 100 : p.memberPrice
  const syncBlocked = isPromoPending && !!p.promoPrice
  let status: PriceTag['status'] = 'normal'
  if (isMismatch || hasMemberMismatch) status = 'mismatch'
  else if (isPromoPending && !!p.promoPrice) status = 'promo_pending'
  else if (p.promoActive) status = 'pending_sync'

  return {
    id: `pt-${p.id}`,
    productId: p.id,
    shelfPrice,
    scanPrice,
    memberPrice,
    status,
    lastSyncTime: '2026-06-18T09:30:00',
    syncBlocked,
    syncBlockReason: syncBlocked ? `促销价 ¥${p.promoPrice} 将于 ${p.promoStartTime?.slice(0, 10)} 生效，禁止提前同步` : null,
    anomalySources: getAnomalySources(p.id, hasMemberMismatch, isMismatch),
  }
})

export const syncTasks: SyncTask[] = promoPendingProducts
  .filter(pid => {
    const p = products.find(x => x.id === pid)
    return p && !p.promoActive
  })
  .map((pid, idx) => {
    const p = products.find(x => x.id === pid)!
    const pt = priceTags.find(t => t.productId === pid)!
    return {
      id: `task-${String(idx + 1).padStart(3, '0')}`,
      productId: pid,
      priceTagId: pt.id,
      targetScanPrice: p.promoPrice!,
      targetShelfPrice: p.promoPrice!,
      targetMemberPrice: p.memberPrice,
      reason: `促销切换：¥${p.retailPrice} → ¥${p.promoPrice}，生效时间 ${p.promoStartTime?.slice(0, 10)}`,
      status: 'queued' as const,
      createdAt: '2026-06-18T08:00:00',
      executeAt: p.promoStartTime!,
      executedAt: null,
      createdBy: '系统',
    }
  })

export const inspections: Inspection[] = [
  { id: 'ins01', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p01', priceTagId: 'pt-p01', inspectionTime: '2026-06-18T08:15:00', result: 'normal', photoUrl: null, notes: '价签显示正常', observedScanPrice: 8.90, observedShelfPrice: 8.90, observedMemberPrice: 8.46 },
  { id: 'ins02', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p02', priceTagId: 'pt-p02', inspectionTime: '2026-06-18T08:22:00', result: 'anomaly', photoUrl: '/screenshots/ins02.jpg', notes: '货架价签显示7.15，扫码价为6.50，会员价6.18显示不一致', observedScanPrice: 6.50, observedShelfPrice: 7.15, observedMemberPrice: 6.18 },
  { id: 'ins03', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p05', priceTagId: 'pt-p05', inspectionTime: '2026-06-18T08:30:00', result: 'normal', photoUrl: null, notes: '促销价已生效，价签同步正常', observedScanPrice: 49.90, observedShelfPrice: 49.90, observedMemberPrice: 45.91 },
  { id: 'ins04', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p09', priceTagId: 'pt-p09', inspectionTime: '2026-06-18T08:45:00', result: 'anomaly', photoUrl: '/screenshots/ins04.jpg', notes: '货架价签显示65.89，实际零售价59.90，会员价也不正确', observedScanPrice: 59.90, observedShelfPrice: 65.89, observedMemberPrice: 56.91 },
  { id: 'ins05', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p13', priceTagId: 'pt-p13', inspectionTime: '2026-06-18T09:00:00', result: 'normal', photoUrl: null, notes: '促销进行中，价签正确', observedScanPrice: 29.90, observedShelfPrice: 29.90, observedMemberPrice: 27.51 },
  { id: 'ins06', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p17', priceTagId: 'pt-p17', inspectionTime: '2026-06-18T09:15:00', result: 'anomaly', photoUrl: '/screenshots/ins06.jpg', notes: '货架价签99元，扫码价89.90', observedScanPrice: 89.90, observedShelfPrice: 99.00, observedMemberPrice: null },
  { id: 'ins07', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p18', priceTagId: 'pt-p18', inspectionTime: '2026-06-18T09:30:00', result: 'normal', photoUrl: null, notes: '促销价7.90显示正确', observedScanPrice: 7.90, observedShelfPrice: 7.90, observedMemberPrice: 7.27 },
  { id: 'ins08', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p06', priceTagId: 'pt-p06', inspectionTime: '2026-06-18T09:45:00', result: 'anomaly', photoUrl: '/screenshots/ins08.jpg', notes: '货架价65.89，扫码价59.90，会员价56.91均不一致', observedScanPrice: 59.90, observedShelfPrice: 65.89, observedMemberPrice: 56.91 },
  { id: 'ins09', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p10', priceTagId: 'pt-p10', inspectionTime: '2026-06-18T10:00:00', result: 'anomaly', photoUrl: '/screenshots/ins09.jpg', notes: '促销价39.90元，但系统显示49.90，待生效中', observedScanPrice: 49.90, observedShelfPrice: 54.90, observedMemberPrice: 45.91 },
  { id: 'ins10', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p21', priceTagId: 'pt-p21', inspectionTime: '2026-06-18T10:15:00', result: 'anomaly', photoUrl: '/screenshots/ins10.jpg', notes: '货架价5.40，扫码价4.50', observedScanPrice: 4.50, observedShelfPrice: 5.40, observedMemberPrice: null },
  { id: 'ins11', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p04', priceTagId: 'pt-p04', inspectionTime: '2026-06-18T10:30:00', result: 'anomaly', photoUrl: '/screenshots/ins11.jpg', notes: '紫甘蓝货架价6.38，扫码价5.80，会员价5.51', observedScanPrice: 5.80, observedShelfPrice: 6.38, observedMemberPrice: 5.51 },
  { id: 'ins12', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p14', priceTagId: 'pt-p14', inspectionTime: '2026-06-18T10:45:00', result: 'anomaly', photoUrl: '/screenshots/ins12.jpg', notes: '维达抽纸货架价54.89，扫码价49.90', observedScanPrice: 49.90, observedShelfPrice: 54.89, observedMemberPrice: null },
  { id: 'ins13', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p08', priceTagId: 'pt-p08', inspectionTime: '2026-06-18T11:00:00', result: 'normal', photoUrl: null, notes: '农夫山泉价格正确', observedScanPrice: 2.00, observedShelfPrice: 2.00, observedMemberPrice: null },
  { id: 'ins14', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p20', priceTagId: 'pt-p20', inspectionTime: '2026-06-18T11:15:00', result: 'anomaly', photoUrl: '/screenshots/ins14.jpg', notes: '德芙巧克力货架价6.49，扫码价5.90', observedScanPrice: 5.90, observedShelfPrice: 6.49, observedMemberPrice: null },
  { id: 'ins15', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p12', priceTagId: 'pt-p12', inspectionTime: '2026-06-18T11:30:00', result: 'anomaly', photoUrl: '/screenshots/ins15.jpg', notes: '老干妈货架价10.89，扫码价9.90，会员价9.41不一致', observedScanPrice: 9.90, observedShelfPrice: 10.89, observedMemberPrice: 9.41 },
]

function getReviewPhotos(anomalyId: string): ReviewPhoto[] {
  if (anomalyId === 'anm-001') {
    return [
      { id: 'rp001', url: '/screenshots/review001.jpg', uploadedBy: '李明远', uploadedAt: '2026-06-18T16:30:00' },
      { id: 'rp002', url: '/screenshots/review002.jpg', uploadedBy: '李明远', uploadedAt: '2026-06-18T16:32:00' },
    ]
  }
  if (anomalyId === 'anm-003') {
    return [
      { id: 'rp003', url: '/screenshots/review003.jpg', uploadedBy: '李明远', uploadedAt: '2026-06-18T15:00:00' },
    ]
  }
  return []
}

export const anomalies: Anomaly[] = [
  {
    id: 'anm-001',
    productId: 'p02',
    priceTagId: 'pt-p02',
    inspectionId: 'ins02',
    type: 'price_mismatch',
    description: '有机西兰花花架价签显示7.15元，扫码价为6.50元，会员价显示6.18元，三方价格不一致',
    status: 'closed',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T08:22:00',
    confirmedBy: '王建国',
    confirmedPrice: 6.50,
    confirmedAt: '2026-06-18T10:00:00',
    closedBy: '李明远',
    closedAt: '2026-06-18T16:30:00',
    screenshotLocked: true,
    screenshotUrl: '/screenshots/ins02.jpg',
    anomalySources: ['scan', 'shelf', 'member'],
    category: '生鲜果蔬',
    floor: 'F1',
    team: '生鲜组',
    reviewPhotos: getReviewPhotos('anm-001'),
    reviewNotes: '已更换价签，会员价系统已同步更正。生鲜组需加强早班巡检，每日开业前核对重点商品价签。',
    reviewBy: '李明远',
    reviewAt: '2026-06-18T16:35:00',
  },
  {
    id: 'anm-002',
    productId: 'p09',
    priceTagId: 'pt-p09',
    inspectionId: 'ins04',
    type: 'price_mismatch',
    description: '金龙鱼菜籽油货架价签显示65.89元，实际零售价59.90元，会员价56.91元显示不正确',
    status: 'confirmed',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T08:45:00',
    confirmedBy: '王建国',
    confirmedPrice: 59.90,
    confirmedAt: '2026-06-18T10:15:00',
    closedBy: null,
    closedAt: null,
    screenshotLocked: false,
    screenshotUrl: '/screenshots/ins04.jpg',
    anomalySources: ['scan', 'shelf', 'member'],
    category: '粮油副食',
    floor: 'B1',
    team: '粮油组',
    reviewPhotos: [],
    reviewNotes: null,
    reviewBy: null,
    reviewAt: null,
  },
  {
    id: 'anm-003',
    productId: 'p17',
    priceTagId: 'pt-p17',
    inspectionId: 'ins06',
    type: 'price_mismatch',
    description: '三只松鼠坚果礼盒货架价签99.00元，扫码价89.90元，价格不一致',
    status: 'closed',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T09:15:00',
    confirmedBy: '王建国',
    confirmedPrice: 89.90,
    confirmedAt: '2026-06-18T10:30:00',
    closedBy: '李明远',
    closedAt: '2026-06-18T15:00:00',
    screenshotLocked: true,
    screenshotUrl: '/screenshots/ins06.jpg',
    anomalySources: ['scan', 'shelf'],
    category: '休闲零食',
    floor: 'F2',
    team: '食品组',
    reviewPhotos: getReviewPhotos('anm-003'),
    reviewNotes: '价签已更正，系供应商上货时贴错标签。已通知食品组全员注意核对。',
    reviewBy: '李明远',
    reviewAt: '2026-06-18T15:10:00',
  },
  {
    id: 'anm-004',
    productId: 'p06',
    priceTagId: 'pt-p06',
    inspectionId: 'ins08',
    type: 'price_mismatch',
    description: '伊利酸奶货架价65.89元，扫码价59.90元，会员价56.91元，三方价格均不一致',
    status: 'pending',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T09:45:00',
    confirmedBy: null,
    confirmedPrice: null,
    confirmedAt: null,
    closedBy: null,
    closedAt: null,
    screenshotLocked: false,
    screenshotUrl: '/screenshots/ins08.jpg',
    anomalySources: ['scan', 'shelf', 'member'],
    category: '乳品饮料',
    floor: 'F2',
    team: '饮料组',
    reviewPhotos: [],
    reviewNotes: null,
    reviewBy: null,
    reviewAt: null,
  },
  {
    id: 'anm-005',
    productId: 'p10',
    priceTagId: 'pt-p10',
    inspectionId: 'ins09',
    type: 'promo_violation',
    description: '福临门大米促销价39.90元，但系统显示49.90元，促销待生效中，禁止提前改价',
    status: 'pending',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T10:00:00',
    confirmedBy: null,
    confirmedPrice: null,
    confirmedAt: null,
    closedBy: null,
    closedAt: null,
    screenshotLocked: false,
    screenshotUrl: '/screenshots/ins09.jpg',
    anomalySources: ['scan', 'shelf'],
    category: '粮油副食',
    floor: 'B1',
    team: '粮油组',
    reviewPhotos: [],
    reviewNotes: null,
    reviewBy: null,
    reviewAt: null,
  },
  {
    id: 'anm-006',
    productId: 'p21',
    priceTagId: 'pt-p21',
    inspectionId: 'ins10',
    type: 'price_mismatch',
    description: '青岛啤酒货架价5.40元，扫码价4.50元',
    status: 'confirmed',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T10:15:00',
    confirmedBy: '王建国',
    confirmedPrice: 4.50,
    confirmedAt: '2026-06-18T11:00:00',
    closedBy: null,
    closedAt: null,
    screenshotLocked: false,
    screenshotUrl: '/screenshots/ins10.jpg',
    anomalySources: ['scan', 'shelf'],
    category: '酒水冲调',
    floor: 'F2',
    team: '饮料组',
    reviewPhotos: [],
    reviewNotes: null,
    reviewBy: null,
    reviewAt: null,
  },
  {
    id: 'anm-007',
    productId: 'p04',
    priceTagId: 'pt-p04',
    inspectionId: 'ins11',
    type: 'price_mismatch',
    description: '紫甘蓝货架价6.38元，扫码价5.80元，会员价5.51元不一致',
    status: 'pending',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T10:30:00',
    confirmedBy: null,
    confirmedPrice: null,
    confirmedAt: null,
    closedBy: null,
    closedAt: null,
    screenshotLocked: false,
    screenshotUrl: '/screenshots/ins11.jpg',
    anomalySources: ['scan', 'shelf', 'member'],
    category: '生鲜果蔬',
    floor: 'F1',
    team: '生鲜组',
    reviewPhotos: [],
    reviewNotes: null,
    reviewBy: null,
    reviewAt: null,
  },
  {
    id: 'anm-008',
    productId: 'p14',
    priceTagId: 'pt-p14',
    inspectionId: 'ins12',
    type: 'price_mismatch',
    description: '维达抽纸货架价54.89元，扫码价49.90元',
    status: 'pending',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T10:45:00',
    confirmedBy: null,
    confirmedPrice: null,
    confirmedAt: null,
    closedBy: null,
    closedAt: null,
    screenshotLocked: false,
    screenshotUrl: '/screenshots/ins12.jpg',
    anomalySources: ['scan', 'shelf'],
    category: '日化清洁',
    floor: 'F3',
    team: '日化组',
    reviewPhotos: [],
    reviewNotes: null,
    reviewBy: null,
    reviewAt: null,
  },
  {
    id: 'anm-009',
    productId: 'p20',
    priceTagId: 'pt-p20',
    inspectionId: 'ins14',
    type: 'price_mismatch',
    description: '德芙巧克力货架价6.49元，扫码价5.90元',
    status: 'pending',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T11:15:00',
    confirmedBy: null,
    confirmedPrice: null,
    confirmedAt: null,
    closedBy: null,
    closedAt: null,
    screenshotLocked: false,
    screenshotUrl: '/screenshots/ins14.jpg',
    anomalySources: ['scan', 'shelf'],
    category: '休闲零食',
    floor: 'F2',
    team: '食品组',
    reviewPhotos: [],
    reviewNotes: null,
    reviewBy: null,
    reviewAt: null,
  },
  {
    id: 'anm-010',
    productId: 'p12',
    priceTagId: 'pt-p12',
    inspectionId: 'ins15',
    type: 'price_mismatch',
    description: '老干妈辣酱货架价10.89元，扫码价9.90元，会员价9.41元不一致',
    status: 'confirmed',
    reportedBy: '张丽华',
    reportedAt: '2026-06-18T11:30:00',
    confirmedBy: '王建国',
    confirmedPrice: 9.90,
    confirmedAt: '2026-06-18T13:00:00',
    closedBy: null,
    closedAt: null,
    screenshotLocked: false,
    screenshotUrl: '/screenshots/ins15.jpg',
    anomalySources: ['scan', 'shelf', 'member'],
    category: '粮油副食',
    floor: 'B1',
    team: '粮油组',
    reviewPhotos: [],
    reviewNotes: null,
    reviewBy: null,
    reviewAt: null,
  },
]

export const anomalyActions: AnomalyAction[] = [
  { id: 'act-001', anomalyId: 'anm-001', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T08:22:00', remark: '巡检发现价格不一致，拍照上报' },
  { id: 'act-002', anomalyId: 'anm-001', action: '确认价格', operatorId: 'u2', operatorName: '王建国', operatorRole: 'cashier', timestamp: '2026-06-18T10:00:00', remark: '确认实际价格为 ¥6.50，货架价签错误' },
  { id: 'act-003', anomalyId: 'anm-001', action: '闭环确认', operatorId: 'u3', operatorName: '李明远', operatorRole: 'manager', timestamp: '2026-06-18T16:30:00', remark: '价签已更换，会员价系统已同步' },
  { id: 'act-004', anomalyId: 'anm-001', action: '追加复查照片', operatorId: 'u3', operatorName: '李明远', operatorRole: 'manager', timestamp: '2026-06-18T16:32:00', remark: '上传更正后价签照片2张' },
  { id: 'act-005', anomalyId: 'anm-001', action: '填写复盘说明', operatorId: 'u3', operatorName: '李明远', operatorRole: 'manager', timestamp: '2026-06-18T16:35:00', remark: '已更换价签，会员价系统已同步更正。生鲜组需加强早班巡检。' },
  { id: 'act-006', anomalyId: 'anm-002', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T08:45:00', remark: '巡检发现价格不一致' },
  { id: 'act-007', anomalyId: 'anm-002', action: '确认价格', operatorId: 'u2', operatorName: '王建国', operatorRole: 'cashier', timestamp: '2026-06-18T10:15:00', remark: '确认实际价格为 ¥59.90' },
  { id: 'act-008', anomalyId: 'anm-003', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T09:15:00', remark: '货架价签与扫码价不一致' },
  { id: 'act-009', anomalyId: 'anm-003', action: '确认价格', operatorId: 'u2', operatorName: '王建国', operatorRole: 'cashier', timestamp: '2026-06-18T10:30:00', remark: '确认扫码价正确，货架价签贴错' },
  { id: 'act-010', anomalyId: 'anm-003', action: '闭环确认', operatorId: 'u3', operatorName: '李明远', operatorRole: 'manager', timestamp: '2026-06-18T15:00:00', remark: '价签已更正' },
  { id: 'act-011', anomalyId: 'anm-004', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T09:45:00', remark: '三方价格均不一致' },
  { id: 'act-012', anomalyId: 'anm-005', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T10:00:00', remark: '促销待生效，价签未同步' },
  { id: 'act-013', anomalyId: 'anm-006', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T10:15:00', remark: '扫码价与货架价不一致' },
  { id: 'act-014', anomalyId: 'anm-006', action: '确认价格', operatorId: 'u2', operatorName: '王建国', operatorRole: 'cashier', timestamp: '2026-06-18T11:00:00', remark: '确认实际价格为 ¥4.50' },
  { id: 'act-015', anomalyId: 'anm-007', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T10:30:00', remark: '三方价格不一致' },
  { id: 'act-016', anomalyId: 'anm-008', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T10:45:00', remark: '扫码价与货架价不一致' },
  { id: 'act-017', anomalyId: 'anm-009', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T11:15:00', remark: '扫码价与货架价不一致' },
  { id: 'act-018', anomalyId: 'anm-010', action: '上报异常', operatorId: 'u1', operatorName: '张丽华', operatorRole: 'operator', timestamp: '2026-06-18T11:30:00', remark: '三方价格不一致' },
  { id: 'act-019', anomalyId: 'anm-010', action: '确认价格', operatorId: 'u2', operatorName: '王建国', operatorRole: 'cashier', timestamp: '2026-06-18T13:00:00', remark: '确认实际价格为 ¥9.90' },
]

export const trendData = [
  { date: '06-12', count: 8, closed: 6 },
  { date: '06-13', count: 12, closed: 10 },
  { date: '06-14', count: 6, closed: 6 },
  { date: '06-15', count: 10, closed: 8 },
  { date: '06-16', count: 15, closed: 12 },
  { date: '06-17', count: 9, closed: 9 },
  { date: '06-18', count: 10, closed: 3 },
]
