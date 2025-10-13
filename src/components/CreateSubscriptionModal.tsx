'use client';

import React, { useState } from 'react';
import { 
  SubscriptionPlanWithDetails, 
  formatCurrency, 
  formatInterval,
  Address 
} from '@/types/subscription';

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SubscriptionPlanWithDetails | null;
  onConfirmSubscription: (data: {
    planId: string;
    quantity: number;
    shippingAddress: Address;
    paymentMethodId?: string;
  }) => void;
  isLoading?: boolean;
}

export default function CreateSubscriptionModal({
  isOpen,
  onClose,
  selectedPlan,
  onConfirmSubscription,
  isLoading = false
}: CreateSubscriptionModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!shippingAddress.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!shippingAddress.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!shippingAddress.address1.trim()) {
      newErrors.address1 = 'L\'adresse est requise';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    }
    if (quantity < 1 || quantity > 10) {
      newErrors.quantity = 'La quantité doit être entre 1 et 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan || !validateForm()) {
      return;
    }

    onConfirmSubscription({
      planId: selectedPlan.id,
      quantity,
      shippingAddress
    });
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen || !selectedPlan) {
    return null;
  }

  const totalPrice = selectedPlan.priceCents * quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Créer votre abonnement
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          {/* Récapitulatif du plan */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Plan sélectionné
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  {selectedPlan.name}
                </div>
                <div className="text-sm text-gray-600">
                  {formatInterval(selectedPlan.interval, selectedPlan.intervalCount)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(selectedPlan.priceCents)}
                </div>
                <div className="text-sm text-gray-600">
                  par {formatInterval(selectedPlan.interval, selectedPlan.intervalCount)}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  disabled={isLoading}
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
              {errors.quantity && (
                <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Adresse de livraison */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Adresse de livraison
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.firstName}
                    onChange={(e) => handleAddressChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) => handleAddressChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Société (optionnel)
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.company}
                    onChange={(e) => handleAddressChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address1}
                    onChange={(e) => handleAddressChange('address1', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.address1 ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.address1 && (
                    <p className="text-red-600 text-sm mt-1">{errors.address1}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse ligne 2 (optionnel)
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address2}
                    onChange={(e) => handleAddressChange('address2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.postalCode && (
                    <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  >
                    <option value="France">France</option>
                    <option value="Belgium">Belgique</option>
                    <option value="Switzerland">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Récapitulatif du prix */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Prix unitaire:</span>
                <span className="font-medium">{formatCurrency(selectedPlan.priceCents)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Quantité:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="border-t border-green-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total par {formatInterval(selectedPlan.interval, selectedPlan.intervalCount)}:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer l\'abonnement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
