import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  Tag,
  LayoutDashboard,
  Package,
  ClipboardCheck,
  AlertTriangle,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useAppStore } from '@/store'
import type { Role } from '@/types'

const navItems = [
  { to: '/', label: '工作台', icon: LayoutDashboard },
  { to: '/products', label: '商品列表', icon: Package },
  { to: '/price-tags', label: '价签状态', icon: Tag },
  { to: '/inspections', label: '巡检记录', icon: ClipboardCheck },
  { to: '/anomalies', label: '异常闭环', icon: AlertTriangle },
  { to: '/statistics', label: '异常统计', icon: BarChart3 },
]

const roles: { key: Role; label: string }[] = [
  { key: 'operator', label: '营运员' },
  { key: 'cashier', label: '收银主管' },
  { key: 'manager', label: '门店经理' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const { currentUser, switchRole } = useAppStore()

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-700">
          <Tag className="h-6 w-6 shrink-0 text-orange-500" />
          {!collapsed && (
            <span className="text-lg font-bold text-white whitespace-nowrap">
              价签纠错工作台
            </span>
          )}
        </div>

        <nav className="flex-1 py-2 space-y-0.5 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white font-medium'
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={`border-t border-slate-700 p-2 ${collapsed ? 'space-y-1' : ''}`}>
          {!collapsed && (
            <p className="text-xs text-slate-500 px-2 mb-2">角色切换</p>
          )}
          {roles.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchRole(key)}
              className={`w-full rounded-md px-2 py-1.5 text-xs transition-colors ${
                currentUser.role === key
                  ? 'bg-orange-500 text-white font-medium'
                  : 'hover:bg-slate-700 text-slate-400'
              } ${collapsed ? 'text-center' : ''}`}
              title={collapsed ? label : undefined}
            >
              {collapsed ? label[0] : label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCollapsed(v => !v)}
          className="flex items-center justify-center py-3 border-t border-slate-700 hover:bg-slate-800 transition-colors"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  )
}
