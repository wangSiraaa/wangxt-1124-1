import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Products from '@/pages/Products'
import PriceTags from '@/pages/PriceTags'
import Inspections from '@/pages/Inspections'
import Anomalies from '@/pages/Anomalies'
import Statistics from '@/pages/Statistics'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/price-tags" element={<PriceTags />} />
          <Route path="/inspections" element={<Inspections />} />
          <Route path="/anomalies" element={<Anomalies />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
