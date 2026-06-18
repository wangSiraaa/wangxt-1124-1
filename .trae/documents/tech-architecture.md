## 1. 架构设计

```mermaid
graph TB
    subgraph "前端层"
        A["React SPA 工作台"]
        A1["商品列表页"]
        A2["价签状态页"]
        A3["巡检记录页"]
        A4["异常闭环页"]
        A5["异常统计页"]
    end
    subgraph "状态管理层"
        B["Zustand Store"]
        B1["商品Store"]
        B2["巡检Store"]
        B3["异常Store"]
        B4["用户角色Store"]
    end
    subgraph "数据层"
        C["本地Mock数据"]
        C1["商品数据"]
        C2["价签数据"]
        C3["巡检记录"]
        C4["异常工单"]
    end
    A --> A1 & A2 & A3 & A4 & A5
    A1 & A2 & A3 & A4 & A5 --> B
    B1 & B2 & B3 & B4 --> B
    B --> C
    C1 & C2 & C3 & C4 --> C
```

## 2. 技术说明

- 前端：React@18 + TypeScript + Vite + Tailwind CSS@3
- 状态管理：Zustand
- 路由：react-router-dom@6
- 图表：recharts
- 图标：lucide-react
- 后端：无（纯前端，本地数据支撑）
- 数据：Mock数据存储在前端，通过Zustand管理

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 工作台首页，角色切换+待办统计+趋势图 |
| /products | 商品列表页，搜索筛选+价签状态标识 |
| /price-tags | 价签状态页，扫码价与货架价对比 |
| /inspections | 巡检记录页，营运员巡检任务管理 |
| /anomalies | 异常闭环页，工单流转与闭环管理 |
| /statistics | 异常统计页，图表展示异常数据 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    PRODUCT ||--o{ PRICE_TAG : "has"
    PRODUCT ||--o{ INSPECTION : "inspected"
    PRICE_TAG ||--o{ ANOMALY : "triggers"
    INSPECTION ||--o{ ANOMALY : "reports"
    ANOMALY ||--o{ ANOMALY_ACTION : "tracks"

    PRODUCT {
        string id PK
        string name
        string code
        string category
        number retailPrice
        number promoPrice
        string promoStartTime
        string promoEndTime
        boolean promoActive
    }

    PRICE_TAG {
        string id PK
        string productId FK
        string shelfPrice
        string scanPrice
        string status
        string lastSyncTime
        boolean syncBlocked
        string syncBlockReason
    }

    INSPECTION {
        string id PK
        string inspectorId
        string inspectorName
        string productId FK
        string priceTagId FK
        string inspectionTime
        string result
        string photoUrl
        string notes
    }

    ANOMALY {
        string id PK
        string productId FK
        string priceTagId FK
        string inspectionId FK
        string type
        string description
        string status
        string reportedBy
        string reportedAt
        string confirmedBy
        string confirmedPrice
        string confirmedAt
        string closedBy
        string closedAt
        string screenshotLocked
        string screenshotUrl
    }

    ANOMALY_ACTION {
        string id PK
        string anomalyId FK
        string action
        string operatorId
        string operatorName
        string operatorRole
        string timestamp
        string remark
    }
```

### 4.2 数据定义

- 商品数据：30+条模拟商品，涵盖生鲜、日化、食品、饮料等分类，部分含促销价
- 价签数据：每个商品对应一条价签记录，约30%存在不一致
- 巡检记录：20+条历史巡检记录，含正常和异常
- 异常工单：10+条异常工单，覆盖待确认/已确认/已闭环各状态
