'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAuth0Context } from '@/contexts/Auth0Context'
import { AdminGuard } from '@/components/AdminGuard'
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
  faDownload,
  faUserShield,
  faCrown,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

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

interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin' | 'owner'
  orderCount: number
  totalSpent: number
  createdAt: string
}

function AdminContent() {
  const { state: authState } = useAuth()
  const { state: auth0State, isOwner } = useAuth0Context()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyRevenue: 0,
    monthlyOrders: 0,
    monthlyCustomers: 0
  })
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [periodFilter, setPeriodFilter] = useState('30days') // 7days, 30days, 3months, year, all
  const [chartData, setChartData] = useState<any[]>([])
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    name: '',
    role: 'customer',
    password: '',
  })
  
  const isOwnerUser = auth0State.user ? isOwner() : false

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                         order.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
                         order.email.toLowerCase().includes(orderSearch.toLowerCase())
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsCreatingUser(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUserForm,
          email: newUserForm.email.trim(),
          name: newUserForm.name.trim() || undefined,
          password: newUserForm.password || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Création impossible')
      }

      setUsers((prev) => [
        {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          orderCount: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])

      setShowCreateUserModal(false)
      setNewUserForm({
        email: '',
        name: '',
        role: 'customer',
        password: '',
      })
      alert('Utilisateur créé et synchronisé avec Auth0 ✅')
    } catch (error: any) {
      console.error('Erreur création utilisateur:', error)
      alert(`Erreur lors de la création: ${error.message || error}`)
    } finally {
      setIsCreatingUser(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      try {
        // Charger les statistiques selon la période
        const statsResponse = await fetch(`/api/admin/statistics?period=${periodFilter}`)
        const statsData = await statsResponse.json()
        if (statsData.success) {
          setStats({
            totalRevenue: (statsData.statistics.revenue / 100) || 0,
            totalOrders: statsData.statistics.orders || 0,
            totalCustomers: statsData.statistics.customers || 0,
            totalProducts: statsData.statistics.products || 0,
            monthlyRevenue: (statsData.statistics.revenue / 100) || 0,
            monthlyOrders: statsData.statistics.orders || 0,
            monthlyCustomers: statsData.statistics.customers || 0
          })
          
          // Préparer les données pour les graphiques
          if (statsData.statistics.chartData) {
            setChartData(statsData.statistics.chartData)
          }
        }

        // Charger les commandes
        const ordersResponse = await fetch('/api/orders/admin?limit=50')
        const ordersData = await ordersResponse.json()
        if (ordersData.success && ordersData.orders) {
          const formattedOrders = ordersData.orders.map((order: any) => ({
            id: order.id,
            orderNumber: order.id.slice(0, 10).toUpperCase(),
            customer: order.customerName || order.user?.name || 'Client',
            email: order.customerEmail || order.user?.email || '',
            date: new Date(order.createdAt).toLocaleDateString(),
            status: order.status,
            total: (order.totalCents / 100),
            items: order.items?.map((item: any) => ({
              id: item.id,
              name: item.name || item.product?.title || 'Produit',
              quantity: item.quantity,
              price: (item.priceCents / 100)
            })) || []
          }))
          setOrders(formattedOrders)
        }

        // Charger les produits
        const productsResponse = await fetch('/api/admin/products?limit=50')
        const productsData = await productsResponse.json()
        if (productsData.success && productsData.products) {
          const formattedProducts = productsData.products.map((product: any) => {
            const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
            return {
              id: product.id,
              name: product.title,
              price: (product.priceCents / 100),
              stock: product.stock || 0,
              category: product.categories?.[0]?.name || 'Non catégorisé',
              image: Array.isArray(images) && images.length > 0 ? images[0] : '/products/default.svg',
              status: product.published ? 'active' : 'inactive',
              sales: product.sales || 0
            }
          })
          setProducts(formattedProducts)
        }
      
        // Charger les utilisateurs si owner
        if (isOwnerUser) {
          setIsLoadingUsers(true)
          const usersResponse = await fetch('/api/admin/users?limit=100')
          const usersData = await usersResponse.json()
          if (usersData.success) {
            setUsers(usersData.users)
          }
          setIsLoadingUsers(false)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isOwnerUser, periodFilter])

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
          <p className="text-gray-400">Welcome back, {authState.user?.firstName || 'Admin'}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="card-bg rounded-xl p-2 mb-8">
          <div className="flex space-x-1 flex-wrap">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: faChartLine },
              { id: 'orders', name: 'Orders', icon: faShoppingBag },
              { id: 'products', name: 'Products', icon: faBox },
              { id: 'customers', name: 'Customers', icon: faUsers },
              ...(isOwnerUser ? [{ id: 'users', name: 'Gestion Utilisateurs', icon: faUserShield, ownerOnly: true }] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-gold text-black font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                } ${(tab as any).ownerOnly ? 'border border-brand-gold/50' : ''}`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.name}
                {(tab as any).ownerOnly && (
                  <FontAwesomeIcon icon={faCrown} className="text-yellow-400 ml-1" title="Owner uniquement" />
                )}
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
                    <p className="text-gray-400 text-sm">Revenus totaux</p>
                    <p className="text-3xl font-bold text-white">{stats.totalRevenue.toFixed(2)} €</p>
                    <p className="text-gray-400 text-sm">Toutes périodes</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faDollarSign} className="text-brand-gold text-xl" />
                  </div>
                </div>
              </div>

              <div className="card-bg rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Commandes totales</p>
                    <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                    <p className="text-gray-400 text-sm">Toutes périodes</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-brand-gold text-xl" />
                  </div>
                </div>
              </div>

              <div className="card-bg rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Clients totaux</p>
                    <p className="text-3xl font-bold text-white">{stats.totalCustomers}</p>
                    <p className="text-gray-400 text-sm">Comptes créés</p>
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

            {/* Filtre de période */}
            <div className="flex items-center justify-between card-bg rounded-xl p-4">
              <h3 className="text-white font-semibold">Période d'analyse</h3>
              <div className="flex gap-2">
                {[
                  { value: '7days', label: '7 jours' },
                  { value: '30days', label: '30 jours' },
                  { value: '3months', label: '3 mois' },
                  { value: 'year', label: '1 an' },
                  { value: 'all', label: 'Tout' }
                ].map(period => (
                  <button
                    key={period.value}
                    onClick={() => setPeriodFilter(period.value)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      periodFilter === period.value
                        ? 'bg-brand-gold text-black font-semibold'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique des revenus */}
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Évolution des revenus</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#D4AF37" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)"
                      name="Revenus (€)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique des commandes */}
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Nombre de commandes</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="orders" fill="#10B981" name="Commandes" />
                  </BarChart>
                </ResponsiveContainer>
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
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="btn-gold text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Nouvel utilisateur
                </button>
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
                <select 
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
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
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          Aucune commande trouvée
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
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
                            <button 
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowOrderModal(true)
                              }}
                              className="text-gray-400 hover:text-brand-gold transition-colors"
                              title="Voir détails"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowOrderModal(true)
                              }}
                              className="text-gray-400 hover:text-brand-gold transition-colors"
                              title="Modifier"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
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

        {/* Users Management Tab - Owner Only */}
        {activeTab === 'users' && isOwnerUser && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserShield} className="text-brand-gold" />
                  Gestion des Utilisateurs
                  <FontAwesomeIcon icon={faCrown} className="text-yellow-400 text-xl" title="Owner uniquement" />
                </h2>
                <p className="text-gray-400 mt-2">Gérer les rôles et permissions des utilisateurs</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="text"
                    id="user-search"
                    placeholder="Rechercher un utilisateur (email ou nom)..."
                    className="bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    onKeyPress={async (e) => {
                      if (e.key === 'Enter') {
                        setIsLoadingUsers(true)
                        const search = (e.target as HTMLInputElement).value
                        try {
                          const response = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`)
                          const data = await response.json()
                          if (data.success) {
                            setUsers(data.users)
                          } else {
                            alert('Erreur lors de la recherche: ' + (data.error || 'Erreur inconnue'))
                          }
                        } catch (error) {
                          console.error('Erreur lors de la recherche:', error)
                          alert('Erreur lors de la recherche. Vérifiez votre connexion.')
                        } finally {
                          setIsLoadingUsers(false)
                        }
                      }
                    }}
                  />
                  <button
                    onClick={async () => {
                      const input = document.getElementById('user-search') as HTMLInputElement
                      if (!input?.value.trim()) {
                        // Charger tous les utilisateurs si le champ est vide
                        setIsLoadingUsers(true)
                        try {
                          const response = await fetch('/api/admin/users?limit=100')
                          const data = await response.json()
                          if (data.success) {
                            setUsers(data.users)
                          }
                        } catch (error) {
                          console.error('Erreur:', error)
                          alert('Erreur lors du chargement des utilisateurs')
                        } finally {
                          setIsLoadingUsers(false)
                        }
                      } else {
                        // Déclencher la recherche
                        const event = new KeyboardEvent('keypress', { key: 'Enter' })
                        input.dispatchEvent(event)
                      }
                    }}
                    className="btn-gold text-black font-semibold py-2 px-4 rounded-lg ml-2"
                  >
                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                    Rechercher
                  </button>
                  <button
                    onClick={async () => {
                      setIsLoadingUsers(true)
                      try {
                        const response = await fetch('/api/admin/users?limit=100')
                        const data = await response.json()
                        if (data.success) {
                          setUsers(data.users)
                        }
                      } catch (error) {
                        console.error('Erreur:', error)
                        alert('Erreur lors du chargement')
                      } finally {
                        setIsLoadingUsers(false)
                      }
                    }}
                    className="text-gray-400 hover:text-white px-4 py-2 rounded-lg border border-white/20 hover:border-brand-gold transition-colors"
                  >
                    Afficher tous
                  </button>
                </div>
              </div>
            </div>

            {/* Info Box pour Owner */}
            <div className="card-bg rounded-xl p-6 border-l-4 border-brand-gold">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCrown} className="text-yellow-400 text-xl mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Permissions Owner</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>✅ Créer de nouveaux admins</li>
                    <li>✅ Modifier les rôles de tous les utilisateurs</li>
                    <li>✅ Supprimer des admins (sauf le dernier s'il n'y a pas d'owner)</li>
                    <li>✅ Créer d'autres owners</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="card-bg rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Email</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Nom</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Rôle</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Commandes</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Total dépensé</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          <div className="spinner mx-auto"></div>
                          <p className="mt-2">Chargement...</p>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          <p>Utilisez la recherche pour trouver des utilisateurs</p>
                        </td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user.id} className="border-t border-white/10">
                          <td className="px-6 py-4">
                            <p className="text-white">{user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-300">{user.name || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              user.role === 'owner' ? 'bg-yellow-400/20 text-yellow-400' :
                              user.role === 'admin' ? 'bg-brand-gold/20 text-brand-gold' :
                              'bg-gray-400/20 text-gray-400'
                            }`}>
                              {user.role === 'owner' && <FontAwesomeIcon icon={faCrown} className="mr-1" />}
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{user.orderCount}</td>
                          <td className="px-6 py-4 text-white font-semibold">
                            {(user.totalSpent / 100).toFixed(2)} €
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <select
                                className="bg-white/5 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                defaultValue={user.role}
                                onChange={async (e) => {
                                  const newRole = e.target.value
                                  if (newRole !== user.role) {
                                    try {
                                      const response = await fetch(`/api/admin/users/${user.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ role: newRole })
                                      })
                                      const data = await response.json()
                                      if (data.success) {
                                        setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole as any } : u))
                                        alert(`Rôle modifié avec succès !`)
                                      } else {
                                        alert(`Erreur: ${data.error}`)
                                        e.target.value = user.role
                                      }
                                    } catch (error) {
                                      console.error('Erreur:', error)
                                      alert('Erreur lors de la modification du rôle')
                                      e.target.value = user.role
                                    }
                                  }
                                }}
                              >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                                <option value="owner">Owner</option>
                              </select>
                              <button
                                onClick={async () => {
                                  if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ?`)) {
                                    try {
                                      const response = await fetch(`/api/admin/users/${user.id}`, {
                                        method: 'DELETE'
                                      })
                                      const data = await response.json()
                                      if (data.success) {
                                        setUsers(users.filter(u => u.id !== user.id))
                                        alert('Utilisateur supprimé avec succès!')
                                      } else {
                                        alert(`Erreur: ${data.error}`)
                                      }
                                    } catch (error) {
                                      console.error('Erreur:', error)
                                      alert('Erreur lors de la suppression')
                                    }
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 transition-colors p-2"
                                title="Supprimer utilisateur"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal création utilisateur */}
        {showCreateUserModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-bg rounded-xl max-w-lg w-full">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Créer un utilisateur</h3>
                <button
                  onClick={() => !isCreatingUser && setShowCreateUserModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={isCreatingUser}
                >
                  <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    placeholder="utilisateur@exemple.com"
                    disabled={isCreatingUser}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Nom (optionnel)</label>
                  <input
                    type="text"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    placeholder="Nom complet"
                    disabled={isCreatingUser}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Mot de passe initial</label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    placeholder="Généré automatiquement si vide"
                    disabled={isCreatingUser}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L’utilisateur pourra changer son mot de passe à la première connexion.
                  </p>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Rôle</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm((prev) => ({ ...prev, role: e.target.value as 'customer' | 'admin' | 'owner' }))}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    disabled={isCreatingUser}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => !isCreatingUser && setShowCreateUserModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    disabled={isCreatingUser}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-gold text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-60"
                    disabled={isCreatingUser}
                  >
                    {isCreatingUser ? (
                      <>
                        <span className="spinner w-4 h-4 border-2 border-black/40 border-t-black"></span>
                        Création...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} />
                        Créer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de détails de commande */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-bg rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    Commande #{selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations client */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Informations client</h4>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="text-gray-400">Nom:</span> {selectedOrder.customer}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.email}</p>
                    <p><span className="text-gray-400">Date:</span> {selectedOrder.date}</p>
                  </div>
                </div>

                {/* Statut de la commande */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Statut</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value
                      try {
                        const response = await fetch('/api/orders/admin', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            orderId: selectedOrder.id, 
                            status: newStatus 
                          })
                        })
                        const data = await response.json()
                        if (data.success) {
                          setOrders(orders.map(o => 
                            o.id === selectedOrder.id ? { ...o, status: newStatus as any } : o
                          ))
                          setSelectedOrder({ ...selectedOrder, status: newStatus as any })
                          alert('Statut mis à jour avec succès!')
                        } else {
                          alert('Erreur lors de la mise à jour du statut')
                        }
                      } catch (error) {
                        console.error('Erreur:', error)
                        alert('Erreur lors de la mise à jour')
                      }
                    }}
                    className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Articles de la commande */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Articles</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">${item.price.toFixed(2)}</p>
                          <p className="text-gray-400 text-sm">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between text-xl">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-brand-gold font-bold">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    // TODO: Générer facture PDF
                    alert('Fonctionnalité de génération de facture à venir')
                  }}
                  className="flex-1 btn-gold text-black font-semibold py-2 px-4 rounded-lg"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Télécharger facture
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  )
}
