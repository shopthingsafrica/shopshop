'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  Home, 
  Building, 
  X,
  ChevronLeft
} from 'lucide-react';
import { Button, Input, Select, Checkbox } from '@/components/ui';

type Address = {
  id: string;
  label: string;
  type: 'home' | 'office' | 'other';
  first_name: string;
  last_name: string;
  phone: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    label: 'Home',
    type: 'home',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+234 801 234 5678',
    street_address: '15 Victoria Island Road',
    apartment: 'Apt 4B',
    city: 'Lagos',
    state: 'Lagos State',
    postal_code: '101001',
    country: 'Nigeria',
    is_default: true,
  },
  {
    id: '2',
    label: 'Office',
    type: 'office',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+234 802 345 6789',
    street_address: '25 Broad Street',
    apartment: 'Floor 3, Suite 301',
    city: 'Lagos',
    state: 'Lagos State',
    postal_code: '101002',
    country: 'Nigeria',
    is_default: false,
  },
];

const COUNTRIES = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Uganda', label: 'Uganda' },
];

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
].map(s => ({ value: `${s} State`, label: `${s} State` }));

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const emptyForm: Omit<Address, 'id'> = {
    label: '',
    type: 'home',
    first_name: '',
    last_name: '',
    phone: '',
    street_address: '',
    apartment: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nigeria',
    is_default: false,
  };

  const [formData, setFormData] = useState<Omit<Address, 'id'>>(emptyForm);

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label,
      type: address.type,
      first_name: address.first_name,
      last_name: address.last_name,
      phone: address.phone,
      street_address: address.street_address,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      // Update existing
      setAddresses(prev => prev.map(addr => {
        if (addr.id === editingId) {
          return { ...formData, id: editingId };
        }
        // If setting new default, unset others
        if (formData.is_default && addr.id !== editingId) {
          return { ...addr, is_default: false };
        }
        return addr;
      }));
    } else {
      // Add new
      const newAddress: Address = {
        ...formData,
        id: `addr-${Date.now()}`,
      };
      setAddresses(prev => {
        // If setting new default, unset others
        if (formData.is_default) {
          return [...prev.map(a => ({ ...a, is_default: false })), newAddress];
        }
        return [...prev, newAddress];
      });
    }

    // Reset form
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      is_default: addr.id === id,
    })));
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const getTypeIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return Home;
      case 'office':
        return Building;
      default:
        return MapPin;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/account/profile" 
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary">My Addresses</h1>
              <p className="text-muted-foreground mt-1">Manage your delivery addresses</p>
            </div>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Address Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button 
                onClick={handleCancel}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Label */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Label</label>
                <Input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Home, Office, Mom's House"
                />
              </div>

              {/* Address Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Type</label>
                <div className="flex gap-4">
                  {(['home', 'office', 'other'] as const).map((type) => {
                    const Icon = getTypeIcon(type);
                    return (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, type })}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                          formData.type === type
                            ? 'border-secondary bg-secondary/10 text-secondary'
                            : 'border-border hover:border-secondary/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <Input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <Input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Doe"
                />
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 801 234 5678"
                />
              </div>

              {/* Street Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Street Address</label>
                <Input
                  type="text"
                  value={formData.street_address}
                  onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                  placeholder="15 Victoria Island Road"
                />
              </div>

              {/* Apartment */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Apartment, Suite, etc. <span className="text-muted-foreground">(Optional)</span>
                </label>
                <Input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  placeholder="Apt 4B, Floor 2"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Lagos"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  options={[{ value: '', label: 'Select State' }, ...NIGERIAN_STATES]}
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <Input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  placeholder="101001"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <Select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  options={COUNTRIES}
                />
              </div>

              {/* Default Address */}
              <div className="md:col-span-2">
                <Checkbox
                  label="Set as default address"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {editingId ? 'Save Changes' : 'Add Address'}
              </Button>
            </div>
          </div>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No addresses yet</h2>
            <p className="text-muted-foreground mb-6">Add your first delivery address to get started</p>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => {
              const Icon = getTypeIcon(address.type);
              return (
                <div 
                  key={address.id} 
                  className={`bg-white rounded-xl border p-6 relative ${
                    address.is_default ? 'border-secondary' : 'border-border'
                  }`}
                >
                  {/* Default Badge */}
                  {address.is_default && (
                    <span className="absolute top-4 right-4 text-xs bg-secondary text-white px-2 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Default
                    </span>
                  )}

                  {/* Address Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{address.label || address.type}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{address.type}</p>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{address.first_name} {address.last_name}</p>
                    <p className="text-muted-foreground">{address.street_address}</p>
                    {address.apartment && (
                      <p className="text-muted-foreground">{address.apartment}</p>
                    )}
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p className="text-muted-foreground">{address.country}</p>
                    <p className="text-muted-foreground">{address.phone}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {!address.is_default && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(address.id)}
                      className="ml-auto p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === address.id && (
                    <div className="absolute inset-0 bg-white/95 rounded-xl flex items-center justify-center p-6">
                      <div className="text-center">
                        <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
                        <p className="font-medium mb-2">Delete this address?</p>
                        <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="bg-error hover:bg-error/90"
                            onClick={() => handleDelete(address.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
