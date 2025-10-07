'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faTruck, 
  faCheckCircle, 
  faClock,
  faDownload,
  faPrint,
  faMapMarkerAlt,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  description: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  tax: number
  shipping: number
  items: OrderItem[]
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: {
    type: string
    last4: string
    brand: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  trackingHistory?: Array<{
    date: string
    status: string
    location: string
  }>
}

function OrderDetailContent() {
  const params = useParams()
  const { state: authState } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock order data
      const mockOrder: Order = {
        id: params.id as string,
        orderNumber: 'GGG-123456',
        date: '2024-01-15',
        status: 'delivered',
        total: 89.97,
        subtotal: 79.97,
        tax: 6.40,
        shipping: 0,
        items: [
          {
            id: '1',
            name: 'Gold Standard CBD Oil - 1000mg',
            price: 49.99,
            quantity: 1,
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6150e371c9-cf959decb319ba5f18c3.png',
            description: 'Premium full-spectrum CBD oil with 1000mg of CBD per bottle'
          },
          {
            id: '2',
            name: 'Emerald Soothe Balm - 500mg',
            price: 39.98,
            quantity: 2,
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/efac7e243f-ef87256518694e833470.png',
            description: 'Topical CBD balm for targeted relief and soothing comfort'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa'
        },
        trackingNumber: '1Z999AA1234567890',
        estimatedDelivery: '2024-01-18',
        trackingHistory: [
          {
            date: '2024-01-15T10:00:00Z',
            status: 'Order Placed',
            location: 'Garden Gold Green Warehouse'
          },
          {
            date: '2024-01-16T14:30:00Z',
            status: 'Processing',
            location: 'Garden Gold Green Warehouse'
          },
          {
            date: '2024-01-17T09:15:00Z',
            status: 'Shipped',
            location: 'UPS Distribution Center'
          },
          {
            date: '2024-01-18T16:45:00Z',
            status: 'Delivered',
            location: '123 Main Street, New York, NY 10001'
          }
        ]
      }
      
      setOrder(mockOrder)
      setIsLoading(false)
    }

    loadOrder()
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'processing':
        return 'text-blue-400 bg-blue-400/20'
      case 'shipped':
        return 'text-purple-400 bg-purple-400/20'
      case 'delivered':
        return 'text-green-400 bg-green-400/20'
      case 'cancelled':
        return 'text-red-400 bg-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return faClock
      case 'processing':
        return faClock
      case 'shipped':
        return faTruck
      case 'delivered':
        return faCheckCircle
      case 'cancelled':
        return faClock
      default:
        return faClock
    }
  }

  if (isLoading) {
    return (
      <div className="bg-brand-black min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-brand-black min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-gray-400 mb-8">The order you're looking for doesn't exist.</p>
          <Link
            href="/orders"
            className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/orders"
            className="text-gray-400 hover:text-brand-gold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Orders
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-400">
              Placed on {new Date(order.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-2" />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gold-text-gradient">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gold-text-gradient">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking History */}
            {order.trackingHistory && (
              <div className="card-bg rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tracking History</h2>
                <div className="space-y-4">
                  {order.trackingHistory.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        index === order.trackingHistory!.length - 1 
                          ? 'bg-brand-green' 
                          : 'bg-gray-600'
                      }`}>
                        <FontAwesomeIcon 
                          icon={getStatusIcon(event.status.toLowerCase())} 
                          className="text-white text-sm" 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{event.status}</h4>
                        <p className="text-gray-400 text-sm">{event.location}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(event.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className={order.shipping === 0 ? 'text-brand-green' : 'text-white'}>
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold gold-text-gradient">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
              <div className="space-y-2">
                <p className="text-white">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-400">{order.shippingAddress.address}</p>
                <p className="text-gray-400">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-400">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-gold rounded flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-black text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {order.paymentMethod.brand} •••• {order.paymentMethod.last4}
                  </p>
                  <p className="text-gray-400 text-sm">Payment completed</p>
                </div>
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="card-bg rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tracking Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Tracking Number</p>
                    <p className="text-white font-mono text-lg">{order.trackingNumber}</p>
                  </div>
                  {order.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-gray-400">Estimated Delivery</p>
                      <p className="text-white">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <a
                    href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold text-black font-semibold py-2 px-4 rounded-full shadow-gold-glow inline-flex items-center gap-2 w-full justify-center"
                  >
                    <FontAwesomeIcon icon={faTruck} />
                    Track Package
                  </a>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faDownload} />
                  Download Invoice
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faPrint} />
                  Print Order
                </button>
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  )
}

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faTruck, 
  faCheckCircle, 
  faClock,
  faDownload,
  faPrint,
  faMapMarkerAlt,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  description: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  tax: number
  shipping: number
  items: OrderItem[]
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: {
    type: string
    last4: string
    brand: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  trackingHistory?: Array<{
    date: string
    status: string
    location: string
  }>
}

function OrderDetailContent() {
  const params = useParams()
  const { state: authState } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock order data
      const mockOrder: Order = {
        id: params.id as string,
        orderNumber: 'GGG-123456',
        date: '2024-01-15',
        status: 'delivered',
        total: 89.97,
        subtotal: 79.97,
        tax: 6.40,
        shipping: 0,
        items: [
          {
            id: '1',
            name: 'Gold Standard CBD Oil - 1000mg',
            price: 49.99,
            quantity: 1,
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6150e371c9-cf959decb319ba5f18c3.png',
            description: 'Premium full-spectrum CBD oil with 1000mg of CBD per bottle'
          },
          {
            id: '2',
            name: 'Emerald Soothe Balm - 500mg',
            price: 39.98,
            quantity: 2,
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/efac7e243f-ef87256518694e833470.png',
            description: 'Topical CBD balm for targeted relief and soothing comfort'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa'
        },
        trackingNumber: '1Z999AA1234567890',
        estimatedDelivery: '2024-01-18',
        trackingHistory: [
          {
            date: '2024-01-15T10:00:00Z',
            status: 'Order Placed',
            location: 'Garden Gold Green Warehouse'
          },
          {
            date: '2024-01-16T14:30:00Z',
            status: 'Processing',
            location: 'Garden Gold Green Warehouse'
          },
          {
            date: '2024-01-17T09:15:00Z',
            status: 'Shipped',
            location: 'UPS Distribution Center'
          },
          {
            date: '2024-01-18T16:45:00Z',
            status: 'Delivered',
            location: '123 Main Street, New York, NY 10001'
          }
        ]
      }
      
      setOrder(mockOrder)
      setIsLoading(false)
    }

    loadOrder()
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'processing':
        return 'text-blue-400 bg-blue-400/20'
      case 'shipped':
        return 'text-purple-400 bg-purple-400/20'
      case 'delivered':
        return 'text-green-400 bg-green-400/20'
      case 'cancelled':
        return 'text-red-400 bg-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return faClock
      case 'processing':
        return faClock
      case 'shipped':
        return faTruck
      case 'delivered':
        return faCheckCircle
      case 'cancelled':
        return faClock
      default:
        return faClock
    }
  }

  if (isLoading) {
    return (
      <div className="bg-brand-black min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-brand-black min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-gray-400 mb-8">The order you're looking for doesn't exist.</p>
          <Link
            href="/orders"
            className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/orders"
            className="text-gray-400 hover:text-brand-gold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Orders
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-400">
              Placed on {new Date(order.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-2" />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gold-text-gradient">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gold-text-gradient">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking History */}
            {order.trackingHistory && (
              <div className="card-bg rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tracking History</h2>
                <div className="space-y-4">
                  {order.trackingHistory.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        index === order.trackingHistory!.length - 1 
                          ? 'bg-brand-green' 
                          : 'bg-gray-600'
                      }`}>
                        <FontAwesomeIcon 
                          icon={getStatusIcon(event.status.toLowerCase())} 
                          className="text-white text-sm" 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{event.status}</h4>
                        <p className="text-gray-400 text-sm">{event.location}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(event.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className={order.shipping === 0 ? 'text-brand-green' : 'text-white'}>
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold gold-text-gradient">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
              <div className="space-y-2">
                <p className="text-white">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-400">{order.shippingAddress.address}</p>
                <p className="text-gray-400">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-400">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-gold rounded flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-black text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {order.paymentMethod.brand} •••• {order.paymentMethod.last4}
                  </p>
                  <p className="text-gray-400 text-sm">Payment completed</p>
                </div>
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="card-bg rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tracking Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Tracking Number</p>
                    <p className="text-white font-mono text-lg">{order.trackingNumber}</p>
                  </div>
                  {order.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-gray-400">Estimated Delivery</p>
                      <p className="text-white">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <a
                    href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold text-black font-semibold py-2 px-4 rounded-full shadow-gold-glow inline-flex items-center gap-2 w-full justify-center"
                  >
                    <FontAwesomeIcon icon={faTruck} />
                    Track Package
                  </a>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="card-bg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faDownload} />
                  Download Invoice
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faPrint} />
                  Print Order
                </button>
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  )
}
