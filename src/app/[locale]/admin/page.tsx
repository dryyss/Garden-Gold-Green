'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
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
  faXmark,
  faTruck
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Breadcrumb } from '@/components/Breadcrumb'

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
  lastLogin?: string | null
  createdAt: string
}

function AdminContent() {
  const { state: authState } = useAuth()
  const { state: auth0State, isAdminOrOwner } = useAuth0Context()
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
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [newProduct, setNewProduct] = useState({
    title: '',
    slug: '',
    description: '',
    priceCents: '',
    cbdPercent: '',
    sku: '',
    stock: '',
    images: '',
    categoryIds: [] as string[],
    published: true,
    isFeatured: false
  })
  const [editingProduct, setEditingProduct] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    priceCents: '',
    cbdPercent: '',
    sku: '',
    stock: '',
    mainImage: '',
    secondaryImages: '',
    categoryIds: [] as string[],
    published: true,
    isFeatured: false,
    variants: [] as Array<{ id?: string; title: string; priceCents: string; stock: string }>
  })
  const [newProductVariants, setNewProductVariants] = useState<Array<{ title: string; priceCents: string; stock: string }>>([])
  const [periodFilter, setPeriodFilter] = useState('30days') // 7days, 30days, 3months, year, all
  const [chartData, setChartData] = useState<any[]>([])
  
  const isAdminOwnerUser = auth0State.user ? isAdminOrOwner() : false
  const isBypassMode = process.env.NEXT_PUBLIC_FORCE_ADMIN_BYPASS !== 'false'

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                         order.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
                         order.email.toLowerCase().includes(orderSearch.toLowerCase())
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter
    return matchesSearch && matchesStatus
  })

  // Fonction pour recharger les données
  const loadData = useCallback(async () => {
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

      // Charger les catégories
      const categoriesResponse = await fetch('/api/admin/categories')
      const categoriesData = await categoriesResponse.json()
      if (categoriesData.success && categoriesData.categories) {
        setCategories(categoriesData.categories)
      }
    
      // Charger les utilisateurs Auth0 (admin/owner ou mode bypass)
      if (isAdminOwnerUser || isBypassMode) {
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
  }, [isAdminOwnerUser, isBypassMode, periodFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

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
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Admin', href: '/admin' }
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {auth0State.user?.name || authState.user?.name || auth0State.user?.email || 'Admin'}
            {auth0State.user?.backofficeRole === 'owner' && (
              <span className="ml-2 text-yellow-400">
                <FontAwesomeIcon icon={faCrown} className="mr-1" />
                Owner
              </span>
            )}
            {auth0State.user?.backofficeRole === 'admin' && (
              <span className="ml-2 text-brand-gold">
                <FontAwesomeIcon icon={faUserShield} className="mr-1" />
                Admin
              </span>
            )}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="card-bg rounded-xl p-2 mb-8">
          <div className="flex space-x-1 flex-wrap items-center gap-2">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: faChartLine },
              { id: 'orders', name: 'Orders', icon: faShoppingBag },
              { id: 'products', name: 'Products', icon: faBox },
              { id: 'customers', name: 'Utilisateurs', icon: faUserShield },
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
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/20"
              title="Gestion complète des expéditions"
            >
              <FontAwesomeIcon icon={faTruck} />
              Gestion Expéditions
            </Link>
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-3xl font-bold text-white">Products</h2>
              <div className="flex items-center gap-3">
                {/* Barre de recherche */}
                <div className="relative flex-1 md:max-w-md">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
                <button 
                  onClick={() => {
                    console.log('Bouton Add Product cliqué')
                    setShowAddProductModal(true)
                  }}
                  className="btn-gold text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Liste des produits filtrés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter(product => 
                  productSearch === '' || 
                  product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                  product.category.toLowerCase().includes(productSearch.toLowerCase())
                )
                .map(product => (
                <div key={product.id} className="card-bg rounded-xl p-6 hover:border-brand-gold/50 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                      <Image
                        src={product.image || '/products/default.svg'}
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
                      <span className="text-white font-semibold">€{product.price.toFixed(2)}</span>
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

                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <button 
                      onClick={async () => {
                        // Charger les détails du produit
                        try {
                          const response = await fetch(`/api/admin/products/${product.id}`)
                          const data = await response.json()
                          if (data.success && data.product) {
                            const prod = data.product
                            const images = typeof prod.images === 'string' ? JSON.parse(prod.images) : (prod.images || [])
                            setEditingProduct({
                              id: prod.id,
                              title: prod.title || '',
                              slug: prod.slug || '',
                              description: prod.description || '',
                              priceCents: prod.priceCents ? (prod.priceCents / 100).toString() : '',
                              cbdPercent: prod.cbdPercent?.toString() || '',
                              sku: prod.sku || '',
                              stock: prod.stock?.toString() || '0',
                              mainImage: images[0] || '',
                              secondaryImages: images.slice(1).join(', '),
                              categoryIds: prod.categories?.map((c: any) => c.id) || [],
                              published: prod.published ?? true,
                              isFeatured: prod.isFeatured ?? false,
                              variants: prod.variants?.map((v: any) => ({
                                id: v.id,
                                title: v.title || '',
                                priceCents: v.priceCents ? (v.priceCents / 100).toString() : '',
                                stock: v.stock?.toString() || '0'
                              })) || []
                            })
                            setSelectedProduct(product)
                            setShowEditProductModal(true)
                          }
                        } catch (error) {
                          console.error('Erreur:', error)
                          alert('Erreur lors du chargement du produit')
                        }
                      }}
                      className="flex-1 text-gray-400 hover:text-brand-gold transition-colors p-2 rounded hover:bg-white/5"
                      title="Modifier"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
                          try {
                            const response = await fetch(`/api/admin/products/${product.id}`, {
                              method: 'DELETE'
                            })
                            const data = await response.json()
                            if (data.success) {
                              alert('Produit supprimé avec succès')
                              await loadData()
                            } else {
                              alert('Erreur: ' + (data.error || 'Erreur inconnue'))
                            }
                          } catch (error) {
                            console.error('Erreur:', error)
                            alert('Erreur lors de la suppression')
                          }
                        }
                      }}
                      className="flex-1 text-gray-400 hover:text-red-400 transition-colors p-2 rounded hover:bg-white/5"
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button 
                      onClick={() => window.open(`/products/${product.id}`, '_blank')}
                      className="flex-1 text-gray-400 hover:text-brand-gold transition-colors p-2 rounded hover:bg-white/5"
                      title="Voir"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>
              ))}
              {products.filter(product => 
                productSearch === '' || 
                product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                product.category.toLowerCase().includes(productSearch.toLowerCase())
              ).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">
                    {productSearch ? 'Aucun produit trouvé pour votre recherche' : 'Aucun produit disponible'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserShield} className="text-brand-gold" />
                  Utilisateurs Auth0
                  {(isAdminOwnerUser || isBypassMode) && (
                    <FontAwesomeIcon icon={faCrown} className="text-yellow-400 text-xl" title="Accès admin/owner" />
                  )}
                </h2>
                <p className="text-gray-400 mt-2">
                  Liste des comptes synchronisés depuis Auth0. Lecture seule pendant les tests.
                </p>
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
                      <th className="px-6 py-4 text-left text-gray-400 font-medium">Dernière connexion</th>
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
                          <td className="px-6 py-4 text-gray-300">
                            {user.lastLogin
                              ? new Date(user.lastLogin).toLocaleString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Jamais'}
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

        {/* Modal Add Product */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-bg rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Ajouter un produit</h3>
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsLoading(true)
                  try {
                    const mainImage = newProduct.images.split(',')[0]?.trim() || ''
                    const secondaryImages = newProduct.images.split(',').slice(1).map((url) => url.trim()).filter(Boolean)
                    const imagesArray = [mainImage, ...secondaryImages].filter(Boolean)

                    const response = await fetch('/api/admin/products', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        ...newProduct,
                        priceCents: Math.round(parseFloat(newProduct.priceCents) * 100),
                        stock: parseInt(newProduct.stock) || 0,
                        cbdPercent: newProduct.cbdPercent ? parseFloat(newProduct.cbdPercent) : null,
                        images: imagesArray,
                        variants: newProductVariants.filter(v => v.title && v.priceCents && v.stock),
                      }),
                    })

                    const data = await response.json()
                    if (data.success) {
                      alert('Produit créé avec succès!')
                      setShowAddProductModal(false)
                      setNewProduct({
                        title: '',
                        slug: '',
                        description: '',
                        priceCents: '',
                        cbdPercent: '',
                        sku: '',
                        stock: '',
                        images: '',
                        categoryIds: [],
                        published: true,
                        isFeatured: false
                      })
                      setNewProductVariants([])
                      // Recharger toutes les données (produits, stats, etc.)
                      await loadData()
                    } else {
                      alert('Erreur: ' + (data.error || 'Erreur inconnue'))
                    }
                  } catch (error) {
                    console.error('Erreur:', error)
                    alert('Erreur lors de la création du produit: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
                  } finally {
                    setIsLoading(false)
                  }
                }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Titre *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.title}
                      onChange={(e) => {
                        const newTitle = e.target.value
                        // Générer le slug automatiquement
                        const slug = newTitle
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                        setNewProduct((prev) => ({ ...prev, title: newTitle, slug }))
                      }}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Slug *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Prix (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.priceCents}
                      onChange={(e) => setNewProduct({ ...newProduct, priceCents: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">% CBD</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newProduct.cbdPercent}
                      onChange={(e) => setNewProduct({ ...newProduct, cbdPercent: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">SKU</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Catégories</label>
                    <select
                      multiple
                      value={newProduct.categoryIds}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                        setNewProduct({ ...newProduct, categoryIds: selected })
                      }}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs catégories</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Image principale *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.images.split(',')[0] || ''}
                    onChange={(e) => {
                      const mainImage = e.target.value
                      const otherImages = newProduct.images.split(',').slice(1).join(',')
                      setNewProduct({ ...newProduct, images: otherImages ? `${mainImage}, ${otherImages}` : mainImage })
                    }}
                    placeholder="/products/image1.jpg"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                  {newProduct.images.split(',')[0] && (
                    <div className="mt-2">
                      <Image
                        src={newProduct.images.split(',')[0]}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded-lg border border-white/10"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Images secondaires (URLs séparées par des virgules)</label>
                  <input
                    type="text"
                    value={newProduct.images.split(',').slice(1).join(', ')}
                    onChange={(e) => {
                      const mainImage = newProduct.images.split(',')[0] || ''
                      const secondaryImages = e.target.value
                      setNewProduct({ ...newProduct, images: mainImage ? `${mainImage}, ${secondaryImages}` : secondaryImages })
                    }}
                    placeholder="/products/image2.jpg, /products/image3.jpg"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>

                {/* Section Variants */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-300">Variants du produit</label>
                    <button
                      type="button"
                      onClick={() => {
                        setNewProductVariants([...newProductVariants, { title: '', priceCents: '', stock: '' }])
                      }}
                      className="text-sm btn-gold text-black font-semibold py-1 px-3 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-1" />
                      Ajouter un variant
                    </button>
                  </div>
                  
                  {newProductVariants.length > 0 && (
                    <div className="space-y-3">
                      {newProductVariants.map((variant, index) => (
                        <div key={index} className="bg-black/20 rounded-lg p-4 border border-white/10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Titre du variant *</label>
                              <input
                                type="text"
                                value={variant.title}
                                onChange={(e) => {
                                  const updated = [...newProductVariants]
                                  updated[index].title = e.target.value
                                  setNewProductVariants(updated)
                                }}
                                placeholder="Ex: 10ml, 30ml, 50ml"
                                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Prix (€) *</label>
                              <input
                                type="number"
                                step="0.01"
                                value={variant.priceCents}
                                onChange={(e) => {
                                  const updated = [...newProductVariants]
                                  updated[index].priceCents = e.target.value
                                  setNewProductVariants(updated)
                                }}
                                placeholder="29.90"
                                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-400 mb-1">Stock *</label>
                                <input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) => {
                                    const updated = [...newProductVariants]
                                    updated[index].stock = e.target.value
                                    setNewProductVariants(updated)
                                  }}
                                  placeholder="0"
                                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewProductVariants(newProductVariants.filter((_, i) => i !== index))
                                }}
                                className="text-red-400 hover:text-red-300 p-2"
                                title="Supprimer"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={newProduct.published}
                      onChange={(e) => setNewProduct({ ...newProduct, published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Publié</span>
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={newProduct.isFeatured}
                      onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Mis en vedette</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn-gold text-black font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Création...' : 'Créer le produit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Product */}
        {showEditProductModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-bg rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Modifier le produit</h3>
                  <button
                    onClick={() => setShowEditProductModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsLoading(true)
                  try {
                    const secondaryImagesArray = editingProduct.secondaryImages
                      ? editingProduct.secondaryImages.split(',').map((url) => url.trim()).filter(Boolean)
                      : []
                    const allImages = [editingProduct.mainImage, ...secondaryImagesArray].filter(Boolean)

                    const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: editingProduct.title,
                        slug: editingProduct.slug,
                        description: editingProduct.description,
                        priceCents: Math.round(parseFloat(editingProduct.priceCents) * 100),
                        stock: parseInt(editingProduct.stock) || 0,
                        cbdPercent: editingProduct.cbdPercent ? parseFloat(editingProduct.cbdPercent) : null,
                        sku: editingProduct.sku,
                        images: allImages,
                        categoryIds: editingProduct.categoryIds,
                        published: editingProduct.published,
                        isFeatured: editingProduct.isFeatured,
                        variants: editingProduct.variants.filter(v => v.title && v.priceCents && v.stock),
                      }),
                    })

                    const data = await response.json()
                    if (data.success) {
                      alert('Produit modifié avec succès!')
                      setShowEditProductModal(false)
                      await loadData()
                    } else {
                      alert('Erreur: ' + (data.error || 'Erreur inconnue'))
                    }
                  } catch (error) {
                    console.error('Erreur:', error)
                    alert('Erreur lors de la modification du produit: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
                  } finally {
                    setIsLoading(false)
                  }
                }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Titre *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.title}
                      onChange={(e) => {
                        const newTitle = e.target.value
                        const slug = newTitle
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                        setEditingProduct((prev) => ({ ...prev, title: newTitle, slug }))
                      }}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Slug *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.slug}
                      onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Prix (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingProduct.priceCents}
                      onChange={(e) => setEditingProduct({ ...editingProduct, priceCents: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Stock *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">% CBD</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingProduct.cbdPercent}
                      onChange={(e) => setEditingProduct({ ...editingProduct, cbdPercent: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">SKU</label>
                    <input
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Catégories</label>
                    <select
                      multiple
                      value={editingProduct.categoryIds}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                        setEditingProduct({ ...editingProduct, categoryIds: selected })
                      }}
                      className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs catégories</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Image principale *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.mainImage}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mainImage: e.target.value })}
                    placeholder="/products/image1.jpg"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                  {editingProduct.mainImage && (
                    <div className="mt-2">
                      <Image
                        src={editingProduct.mainImage}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded-lg border border-white/10"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Images secondaires (URLs séparées par des virgules)</label>
                  <input
                    type="text"
                    value={editingProduct.secondaryImages}
                    onChange={(e) => setEditingProduct({ ...editingProduct, secondaryImages: e.target.value })}
                    placeholder="/products/image2.jpg, /products/image3.jpg"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>

                {/* Section Variants */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-300">Variants du produit</label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          variants: [...editingProduct.variants, { title: '', priceCents: '', stock: '' }]
                        })
                      }}
                      className="text-sm btn-gold text-black font-semibold py-1 px-3 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-1" />
                      Ajouter un variant
                    </button>
                  </div>
                  
                  {editingProduct.variants.length > 0 && (
                    <div className="space-y-3">
                      {editingProduct.variants.map((variant, index) => (
                        <div key={index} className="bg-black/20 rounded-lg p-4 border border-white/10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Titre du variant *</label>
                              <input
                                type="text"
                                value={variant.title}
                                onChange={(e) => {
                                  const updated = [...editingProduct.variants]
                                  updated[index].title = e.target.value
                                  setEditingProduct({ ...editingProduct, variants: updated })
                                }}
                                placeholder="Ex: 10ml, 30ml, 50ml"
                                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Prix (€) *</label>
                              <input
                                type="number"
                                step="0.01"
                                value={variant.priceCents}
                                onChange={(e) => {
                                  const updated = [...editingProduct.variants]
                                  updated[index].priceCents = e.target.value
                                  setEditingProduct({ ...editingProduct, variants: updated })
                                }}
                                placeholder="29.90"
                                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-400 mb-1">Stock *</label>
                                <input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) => {
                                    const updated = [...editingProduct.variants]
                                    updated[index].stock = e.target.value
                                    setEditingProduct({ ...editingProduct, variants: updated })
                                  }}
                                  placeholder="0"
                                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct({
                                    ...editingProduct,
                                    variants: editingProduct.variants.filter((_, i) => i !== index)
                                  })
                                }}
                                className="text-red-400 hover:text-red-300 p-2"
                                title="Supprimer"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={editingProduct.published}
                      onChange={(e) => setEditingProduct({ ...editingProduct, published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Publié</span>
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Mis en vedette</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowEditProductModal(false)}
                    className="flex-1 bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn-gold text-black font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Modification...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
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
