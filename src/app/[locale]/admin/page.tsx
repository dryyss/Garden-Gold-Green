'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartLine, 
  faShoppingBag, 
  faUsers, 
  faDollarSign,
  faBox,
  faEye,
  faEdit,
  faTrash,
  faPlus,
  faSearch,
  faFilter,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

interface Order {
  id: string
  orderNumber: string
  customer: string
  email: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  image: string
  status: 'active' | 'inactive'
  sales: number
}

function AdminContent() {
  const { state: authState } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      setOrders([
        {
          id: '1',
          orderNumber: 'GGG-123456',
          customer: 'John Doe',
          email: 'john@example.com',
          date: '2024-01-15',
          status: 'delivered',
          total: 89.97,
          items: [
            { id: '1', name: 'Gold Standard CBD Oil', quantity: 1, price: 49.99 },
            { id: '2', name: 'Emerald Soothe Balm', quantity: 2, price: 39.98 }
          ]
        },
        {
          id: '2',
          orderNumber: 'GGG-123457',
          customer: 'Jane Smith',
          email: 'jane@example.com',
          date: '2024-01-14',
          status: 'shipped',
          total: 129.97,
          items: [
            { id: '3', name: 'Green Serenity Gummies', quantity: 1, price: 59.99 },
            { id: '4', name: 'Silver Purity Vape', quantity: 1, price: 69.98 }
          ]
        }
      ])

      setProducts([
        {
          id: '1',
          name: 'Gold Standard CBD Oil - 1000mg',
          price: 49.99,
          stock: 45,
          category: 'Oils',
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6150e371c9-cf959decb319ba5f18c3.png',
          status: 'active',
          sales: 156
        },
        {
          id: '2',
          name: 'Emerald Soothe Balm - 500mg',
          price: 39.99,
          stock: 23,
          category: 'Topicals',
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/efac7e243f-ef87256518694e833470.png',
          status: 'active',
          sales: 89
        }
      ])
      
      setIsLoading(false)
    }

    loadData()
  }, [])

  const stats = {
    totalRevenue: 45678.90,
    totalOrders: 1234,
    totalCustomers: 567,
    totalProducts: 45,
    monthlyRevenue: 12345.67,
    monthlyOrders: 234,
    monthlyCustomers: 89
  }

  if (isLoading) {
    return (
      <div className="bg-brand-black min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.firstName || 'Admin'}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="card-bg rounded-xl p-2 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: faChartLine },
              { id: 'orders', name: 'Orders', icon: faShoppingBag },
              { id: 'products', name: 'Products', icon: faBox },
              { id: 'customers', name: 'Customers', icon: faUsers }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-gold text-black font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-bg rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-green-400 text-sm">+12.5% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faDollarSign} className="text-brand-gold text-xl" />
                  </div>
                </div>
              </div>

              <div className="card-bg rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-white">{stats.totalOrders.toLocaleString()}</p>
                    <p className="text-green-400 text-sm">+8.2% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-brand-gold text-xl" />
                  </div>
                </div>
              </div>

              <div className="card-bg rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Customers</p>
                    <p className="text-3xl font-bold text-white">{stats.totalCustomers.toLocaleString()}</p>
                    <p className="text-green-400 text-sm">+15.3% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUsers} className="text-brand-gold text-xl" />
                  </div>
                </div>
              </div>

              <div className="card-bg rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Products</p>
                    <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                    <p className="text-gray-400 text-sm">Active products</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faBox} className="text-brand-gold text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card-bg rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
                <button className="text-brand-gold hover:text-brand-gold/80 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-white font-medium">#{order.orderNumber}</p>
                        <p className="text-gray-400 text-sm">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${order.total.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">{order.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'delivered' ? 'bg-green-400/20 text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-400/20 text-blue-400' :
                      order.status === 'processing' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-gray-400/20 text-gray-400'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Orders</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
                <select className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
                <button className="btn-gold text-black font-semibold py-2 px-4 rounded-lg">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Export
                </button>
              </div>
            </div>

            <div className="card-bg rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Order</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Customer</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Date</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Status</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Total</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-t border-white/10">
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">#{order.orderNumber}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white">{order.customer}</p>
                            <p className="text-gray-400 text-sm">{order.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{order.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'delivered' ? 'bg-green-400/20 text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-400/20 text-blue-400' :
                            order.status === 'processing' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-gray-400/20 text-gray-400'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white font-semibold">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-400 hover:text-brand-gold transition-colors">
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button className="text-gray-400 hover:text-brand-gold transition-colors">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Products</h2>
              <button className="btn-gold text-black font-semibold py-2 px-4 rounded-lg">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="card-bg rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold line-clamp-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white font-semibold">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Stock:</span>
                      <span className={`font-semibold ${
                        product.stock > 10 ? 'text-green-400' : 
                        product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {product.stock} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sales:</span>
                      <span className="text-white font-semibold">{product.sales}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 text-gray-400 hover:text-brand-gold transition-colors p-2">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="flex-1 text-gray-400 hover:text-red-400 transition-colors p-2">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="flex-1 text-gray-400 hover:text-brand-gold transition-colors p-2">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Customers</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
                <button className="btn-gold text-black font-semibold py-2 px-4 rounded-lg">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Export
                </button>
              </div>
            </div>

            <div className="card-bg rounded-xl p-6">
              <p className="text-gray-400 text-center py-8">
                Customer management features coming soon...
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  )
}
