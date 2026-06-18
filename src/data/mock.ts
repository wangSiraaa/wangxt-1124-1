import type { Product, PriceTag, Inspection, Anomaly, AnomalyAction, UserInfo } from '@/types'

export const users: UserInfo[] = [
  { id: 'u1', name: '张丽华', role: 'operator' },
  { id: 'u2', name: '王建国', role: 'cashier' },
  { id: 'u3', name: '李明远', role: 'manager' },
]

export const categories = ['生鲜果蔬', '乳品饮料', '粮油副食', '日化清洁', '休闲零食', '酒水冲调', '冷冻食品', '家居百货']

export const products: Product[] = [
  { id: 'p01', name: '红富士苹果', code: 'SF001', category: '生鲜果蔬', retailPrice: 8.90, promoPrice: 5.90, promoStartTime: '2026-06-20T00:00:00', promoEndTime: '2026-06-26T23:59:59', promoActive: false, unit: '斤' },
  { id: 'p02', name: '有机西兰花', code: 'SF002', category: '生鲜果蔬', retailPrice: 6.50, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '颗' },
  { id: 'p03', name: '进口香蕉', code: 'SF003', category: '生鲜果蔬', retailPrice: 4.90, promoPrice: 3.50, promoStartTime: '2026-06-20T08:00:00', promoEndTime: '2026-06-22T22:00:00', promoActive: false, unit: '斤' },
  { id: 'p04', name: '紫甘蓝', code: 'SF004', category: '生鲜果蔬', retailPrice: 5.80, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '颗' },
  { id: 'p05', name: '金典纯牛奶', code: 'RP001', category: '乳品饮料', retailPrice: 69.90, promoPrice: 49.90, promoStartTime: '2026-06-19T00:00:00', promoEndTime: '2026-06-25T23:59:59', promoActive: true, unit: '箱' },
  { id: 'p06', name: '伊利酸奶', code: 'RP002', category: '乳品饮料', retailPrice: 59.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '箱' },
  { id: 'p07', name: '可口可乐330ml', code: 'RP003', category: '乳品饮料', retailPrice: 2.50, promoPrice: 1.90, promoStartTime: '2026-06-21T00:00:00', promoEndTime: '2026-06-28T23:59:59', promoActive: false, unit: '罐' },
  { id: 'p08', name: '农夫山泉550ml', code: 'RP004', category: '乳品饮料', retailPrice: 2.00, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '瓶' },
  { id: 'p09', name: '金龙鱼菜籽油5L', code: 'LY001', category: '粮油副食', retailPrice: 59.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '桶' },
  { id: 'p10', name: '福临门大米10kg', code: 'LY002', category: '粮油副食', retailPrice: 49.90, promoPrice: 39.90, promoStartTime: '2026-06-22T00:00:00', promoEndTime: '2026-06-28T23:59:59', promoActive: false, unit: '袋' },
  { id: 'p11', name: '海天生抽1.9L', code: 'LY003', category: '粮油副食', retailPrice: 16.80, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '瓶' },
  { id: 'p12', name: '老干妈辣酱280g', code: 'LY004', category: '粮油副食', retailPrice: 9.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '瓶' },
  { id: 'p13', name: '蓝月亮洗衣液3kg', code: 'RH001', category: '日化清洁', retailPrice: 39.90, promoPrice: 29.90, promoStartTime: '2026-06-18T10:00:00', promoEndTime: '2026-06-20T22:00:00', promoActive: true, unit: '瓶' },
  { id: 'p14', name: '维达抽纸24包', code: 'RH002', category: '日化清洁', retailPrice: 49.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '提' },
  { id: 'p15', name: '舒肤佳香皂115g', code: 'RH003', category: '日化清洁', retailPrice: 6.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '块' },
  { id: 'p16', name: '黑人牙膏140g', code: 'RH004', category: '日化清洁', retailPrice: 12.90, promoPrice: 9.90, promoStartTime: '2026-06-25T00:00:00', promoEndTime: '2026-06-30T23:59:59', promoActive: false, unit: '支' },
  { id: 'p17', name: '三只松鼠坚果礼盒', code: 'XL001', category: '休闲零食', retailPrice: 89.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '盒' },
  { id: 'p18', name: '乐事薯片104g', code: 'XL002', category: '休闲零食', retailPrice: 9.90, promoPrice: 7.90, promoStartTime: '2026-06-19T00:00:00', promoEndTime: '2026-06-25T23:59:59', promoActive: true, unit: '袋' },
  { id: 'p19', name: '奥利奥饼干97g', code: 'XL003', category: '休闲零食', retailPrice: 6.50, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '包' },
  { id: 'p20', name: '德芙巧克力43g', code: 'XL004', category: '休闲零食', retailPrice: 5.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '条' },
  { id: 'p21', name: '青岛啤酒500ml', code: 'JS001', category: '酒水冲调', retailPrice: 4.50, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '罐' },
  { id: 'p22', name: '五粮液52度500ml', code: 'JS002', category: '酒水冲调', retailPrice: 1099.00, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '瓶' },
  { id: 'p23', name: '雀巢速溶咖啡200g', code: 'JS003', category: '酒水冲调', retailPrice: 39.90, promoPrice: 29.90, promoStartTime: '2026-06-23T00:00:00', promoEndTime: '2026-06-29T23:59:59', promoActive: false, unit: '瓶' },
  { id: 'p24', name: '安井速冻水饺1kg', code: 'LD001', category: '冷冻食品', retailPrice: 19.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '袋' },
  { id: 'p25', name: '必品阁王饺子420g', code: 'LD002', category: '冷冻食品', retailPrice: 24.90, promoPrice: 19.90, promoStartTime: '2026-06-20T00:00:00', promoEndTime: '2026-06-26T23:59:59', promoActive: false, unit: '袋' },
  { id: 'p26', name: '三全汤圆400g', code: 'LD003', category: '冷冻食品', retailPrice: 12.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '袋' },
  { id: 'p27', name: '不锈钢保温杯500ml', code: 'JJ001', category: '家居百货', retailPrice: 49.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '个' },
  { id: 'p28', name: '竹纤维毛巾', code: 'JJ002', category: '家居百货', retailPrice: 15.90, promoPrice: 12.90, promoStartTime: '2026-06-24T00:00:00', promoEndTime: '2026-06-30T23:59:59', promoActive: false, unit: '条' },
  { id: 'p29', name: '保鲜盒三件套', code: 'JJ003', category: '家居百货', retailPrice: 29.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '套' },
  { id: 'p30', name: '蓝漂洗衣粉1.5kg', code: 'RH005', category: '日化清洁', retailPrice: 15.90, promoPrice: null, promoStartTime: null, promoEndTime: null, promoActive: false, unit: '袋' },
]

const statusMap: Record<string, PriceTag['status']> = {}
const mismatchProducts = ['p02', 'p04', 'p06', 'p09', 'p12', 'p14', 'p17', 'p20', 'p21', 'p27']
const promoPendingProducts = ['p01', 'p03', 'p07', 'p10', 'p16', 'p23', 'p25', 'p28']

mismatchProducts.forEach(id => { statusMap[id] = 'mismatch' })
promoPendingProducts.forEach(id => {
  if (!statusMap[id]) statusMap[id] = 'promo_pending'
})

export const priceTags: PriceTag[] = products.map(p => {
  const isMismatch = mismatchProducts.includes(p.id)
  const isPromoPending = promoPendingProducts.includes(p.id) && !p.promoActive
  const shelfPrice = isMismatch ? p.retailPrice * (Math.random() > 0.5 ? 1.1 : 0.9) : p.retailPrice
  const scanPrice = isMismatch ? p.retailPrice : p.retailPrice
  const syncBlocked = isPromoPending && !!p.promoPrice
  let status: PriceTag['status'] = 'normal'
  if (isMismatch) status = 'mismatch'
  else if (isPromoPending && !!p.promoPrice) status = 'promo_pending'
  else if (p.promoActive) status = 'pending_sync'

  return {
    id: `pt-${p.id}`,
    productId: p.id,
    shelfPrice: Math.round(shelfPrice * 100) / 100,
    scanPrice: Math.round(scanPrice * 100) / 100,
    status,
    lastSyncTime: '2026-06-18T09:30:00',
    syncBlocked,
    syncBlockReason: syncBlocked ? `促销价 ¥${p.promoPrice} 将于 ${p.promoStartTime?.slice(0, 10)} 生效，禁止提前同步` : null,
  }
})

export const inspections: Inspection[] = [
  { id: 'ins01', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p01', priceTagId: 'pt-p01', inspectionTime: '2026-06-18T08:15:00', result: 'normal', photoUrl: null, notes: '价签显示正常' },
  { id: 'ins02', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p02', priceTagId: 'pt-p02', inspectionTime: '2026-06-18T08:22:00', result: 'anomaly', photoUrl: '/screenshots/ins02.jpg', notes: '货架价签显示7.15，扫码价为6.50' },
  { id: 'ins03', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p05', priceTagId: 'pt-p05', inspectionTime: '2026-06-18T08:30:00', result: 'normal', photoUrl: null, notes: '促销价已生效，价签同步正常' },
  { id: 'ins04', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p09', priceTagId: 'pt-p09', inspectionTime: '2026-06-18T08:45:00', result: 'anomaly', photoUrl: '/screenshots/ins04.jpg', notes: '货架价签显示65.89，实际零售价59.90' },
  { id: 'ins05', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p13', priceTagId: 'pt-p13', inspectionTime: '2026-06-18T09:00:00', result: 'normal', photoUrl: null, notes: '促销标签正确' },
  { id: 'ins06', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p17', priceTagId: 'pt-p17', inspectionTime: '2026-06-18T09:10:00', result: 'anomaly', photoUrl: '/screenshots/ins06.jpg', notes: '价签显示99.00，实际89.90' },
  { id: 'ins07', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p18', priceTagId: 'pt-p18', inspectionTime: '2026-06-18T09:20:00', result: 'normal', photoUrl: null, notes: '促销价签正确' },
  { id: 'ins08', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p06', priceTagId: 'pt-p06', inspectionTime: '2026-06-18T09:35:00', result: 'anomaly', photoUrl: '/screenshots/ins08.jpg', notes: '货架显示65.89，应为59.90' },
  { id: 'ins09', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p14', priceTagId: 'pt-p14', inspectionTime: '2026-06-18T09:50:00', result: 'anomaly', photoUrl: '/screenshots/ins09.jpg', notes: '价签显示54.90，应为49.90' },
  { id: 'ins10', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p21', priceTagId: 'pt-p21', inspectionTime: '2026-06-18T10:05:00', result: 'anomaly', photoUrl: '/screenshots/ins10.jpg', notes: '货架价5.40，扫码价4.50' },
  { id: 'ins11', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p04', priceTagId: 'pt-p04', inspectionTime: '2026-06-18T10:15:00', result: 'anomaly', photoUrl: '/screenshots/ins11.jpg', notes: '价签显示6.38，实际5.80' },
  { id: 'ins12', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p27', priceTagId: 'pt-p27', inspectionTime: '2026-06-18T10:25:00', result: 'anomaly', photoUrl: '/screenshots/ins12.jpg', notes: '价签显示54.89，应为49.90' },
  { id: 'ins13', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p03', priceTagId: 'pt-p03', inspectionTime: '2026-06-18T10:35:00', result: 'normal', photoUrl: null, notes: '促销价未生效，价签显示零售价正确' },
  { id: 'ins14', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p20', priceTagId: 'pt-p20', inspectionTime: '2026-06-18T10:45:00', result: 'anomaly', photoUrl: '/screenshots/ins14.jpg', notes: '价签显示6.49，应为5.90' },
  { id: 'ins15', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p12', priceTagId: 'pt-p12', inspectionTime: '2026-06-18T11:00:00', result: 'anomaly', photoUrl: '/screenshots/ins15.jpg', notes: '货架价10.89，扫码价9.90' },
  { id: 'ins16', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p07', priceTagId: 'pt-p07', inspectionTime: '2026-06-18T11:15:00', result: 'normal', photoUrl: null, notes: '促销未生效，价签显示零售价' },
  { id: 'ins17', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p10', priceTagId: 'pt-p10', inspectionTime: '2026-06-18T11:25:00', result: 'normal', photoUrl: null, notes: '正常' },
  { id: 'ins18', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p16', priceTagId: 'pt-p16', inspectionTime: '2026-06-18T11:35:00', result: 'normal', photoUrl: null, notes: '促销未生效，正常显示零售价' },
  { id: 'ins19', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p23', priceTagId: 'pt-p23', inspectionTime: '2026-06-18T11:45:00', result: 'normal', photoUrl: null, notes: '促销未生效，正常' },
  { id: 'ins20', inspectorId: 'u1', inspectorName: '张丽华', productId: 'p25', priceTagId: 'pt-p25', inspectionTime: '2026-06-18T11:55:00', result: 'normal', photoUrl: null, notes: '促销未生效，正常' },
]

const anomalyInspections = inspections.filter(i => i.result === 'anomaly')
const anomalyTypes: Anomaly['type'][] = ['price_mismatch', 'price_mismatch', 'price_mismatch', 'promo_violation', 'price_mismatch', 'price_mismatch', 'price_mismatch', 'sync_failure', 'price_mismatch', 'label_damage']

export const anomalies: Anomaly[] = anomalyInspections.map((ins, idx) => {
  const product = products.find(p => p.id === ins.productId)!
  const tag = priceTags.find(t => t.productId === ins.productId)!
  let status: Anomaly['status'] = 'pending'
  if (idx < 4) status = 'closed'
  else if (idx < 7) status = 'confirmed'

  return {
    id: `anm-${String(idx + 1).padStart(3, '0')}`,
    productId: ins.productId,
    priceTagId: ins.priceTagId,
    inspectionId: ins.id,
    type: anomalyTypes[idx] || 'price_mismatch',
    description: ins.notes,
    status,
    reportedBy: ins.inspectorName,
    reportedAt: ins.inspectionTime,
    confirmedBy: status !== 'pending' ? '王建国' : null,
    confirmedPrice: status !== 'pending' ? product.retailPrice : null,
    confirmedAt: status !== 'pending' ? '2026-06-18T14:00:00' : null,
    closedBy: status === 'closed' ? '李明远' : null,
    closedAt: status === 'closed' ? '2026-06-18T16:30:00' : null,
    screenshotLocked: status === 'closed',
    screenshotUrl: ins.photoUrl,
  }
})

export const anomalyActions: AnomalyAction[] = [
  ...anomalies.map((a, idx) => ({
    id: `act-${idx * 3 + 1}`,
    anomalyId: a.id,
    action: '上报异常',
    operatorId: 'u1',
    operatorName: '张丽华',
    operatorRole: 'operator' as const,
    timestamp: a.reportedAt,
    remark: a.description,
  })),
  ...anomalies.filter(a => a.status !== 'pending').map((a, idx) => ({
    id: `act-${idx * 3 + 2}`,
    anomalyId: a.id,
    action: '确认价格',
    operatorId: 'u2',
    operatorName: '王建国',
    operatorRole: 'cashier' as const,
    timestamp: a.confirmedAt!,
    remark: `确认实际价格为 ¥${a.confirmedPrice}`,
  })),
  ...anomalies.filter(a => a.status === 'closed').map((a, idx) => ({
    id: `act-${idx * 3 + 3}`,
    anomalyId: a.id,
    action: '闭环确认',
    operatorId: 'u3',
    operatorName: '李明远',
    operatorRole: 'manager' as const,
    timestamp: a.closedAt!,
    remark: '异常已处理，价签已更正',
  })),
]

export const trendData = [
  { date: '06-12', count: 5, closed: 4 },
  { date: '06-13', count: 3, closed: 3 },
  { date: '06-14', count: 7, closed: 5 },
  { date: '06-15', count: 4, closed: 4 },
  { date: '06-16', count: 6, closed: 4 },
  { date: '06-17', count: 8, closed: 6 },
  { date: '06-18', count: 10, closed: 4 },
]

export const categoryStats = [
  { name: '生鲜果蔬', value: 3 },
  { name: '乳品饮料', value: 2 },
  { name: '粮油副食', value: 2 },
  { name: '日化清洁', value: 1 },
  { name: '休闲零食', value: 1 },
  { name: '酒水冲调', value: 1 },
]

export const closureRateTrend = [
  { date: '05-20', rate: 75 },
  { date: '05-27', rate: 80 },
  { date: '06-03', rate: 72 },
  { date: '06-10', rate: 85 },
  { date: '06-17', rate: 78 },
  { date: '06-18', rate: 40 },
]
