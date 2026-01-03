'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Instagram,
  MessageCircle,
  Globe,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';

const STEPS = [
  { id: 1, name: 'Account', description: 'Your login details' },
  { id: 2, name: 'Store Info', description: 'About your business' },
  { id: 3, name: 'Verification', description: 'Confirm your identity' },
];

const BUSINESS_CATEGORIES = [
  'Fashion & Apparel',
  'Beauty & Personal Care',
  'Art & Crafts',
  'Home & Living',
  'Food & Beverages',
  'Electronics',
  'Health & Wellness',
  'Jewelry & Accessories',
  'Books & Media',
  'Sports & Outdoors',
  'Other',
];

export default function VendorRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Account info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Store info
    storeName: '',
    storeDescription: '',
    businessCategory: '',
    country: '',
    city: '',
    address: '',
    // Social links
    website: '',
    instagram: '',
    whatsapp: '',
    tiktok: '',
    // Verification
    businessRegistration: '',
    idType: '',
    idNumber: '',
    agreeTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to vendor dashboard
    router.push('/vendor/dashboard?welcome=true');
  };

  const isStep1Valid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.password &&
      formData.password === formData.confirmPassword
    );
  };

  const isStep2Valid = () => {
    return (
      formData.storeName &&
      formData.storeDescription &&
      formData.businessCategory &&
      formData.country &&
      formData.city
    );
  };

  const isStep3Valid = () => {
    return formData.agreeTerms;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Store className="w-8 h-8 text-secondary" />
            <span className="text-2xl font-heading font-bold text-primary">
              Shop<span className="text-secondary">Things</span>
            </span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">
            Become a Vendor
          </h1>
          <p className="text-muted-foreground">
            Join thousands of African entrepreneurs selling on ShopThings
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1 relative">
                <div className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                      ${currentStep > step.id
                        ? 'bg-secondary text-white'
                        : currentStep === step.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step.id ? 'bg-secondary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-heading font-bold text-primary mb-4">
                  Account Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 800 000 0000"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Store Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-heading font-bold text-primary mb-4">
                  Store Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Store Name *
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      placeholder="My African Store"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Store Description *
                  </label>
                  <textarea
                    name="storeDescription"
                    value={formData.storeDescription}
                    onChange={handleInputChange}
                    placeholder="Tell customers about your store, what you sell, and what makes you unique..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Business Category *
                  </label>
                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {BUSINESS_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Country *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        required
                      >
                        <option value="">Select country</option>
                        <option value="NG">Nigeria</option>
                        <option value="GH">Ghana</option>
                        <option value="KE">Kenya</option>
                        <option value="ZA">South Africa</option>
                        <option value="EG">Egypt</option>
                        <option value="TZ">Tanzania</option>
                        <option value="UG">Uganda</option>
                        <option value="RW">Rwanda</option>
                        <option value="ET">Ethiopia</option>
                        <option value="SN">Senegal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      City *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Lagos"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Business Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your business address"
                      rows={2}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-primary mb-4">
                    Social Media Links (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Instagram
                      </label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="text"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          placeholder="@yourusername"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        WhatsApp
                      </label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="tel"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="+234 800 000 0000"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        TikTok
                      </label>
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        <Input
                          type="text"
                          name="tiktok"
                          value={formData.tiktok}
                          onChange={handleInputChange}
                          placeholder="@yourusername"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-heading font-bold text-primary mb-4">
                  Verification
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Verification helps build trust with buyers. Verified sellers get a badge 
                    and appear higher in search results.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Business Registration Number (Optional)
                  </label>
                  <Input
                    type="text"
                    name="businessRegistration"
                    value={formData.businessRegistration}
                    onChange={handleInputChange}
                    placeholder="Enter your CAC registration number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      ID Type
                    </label>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="">Select ID type</option>
                      <option value="passport">International Passport</option>
                      <option value="nin">National ID (NIN)</option>
                      <option value="drivers">Driver&apos;s License</option>
                      <option value="voters">Voter&apos;s Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      ID Number
                    </label>
                    <Input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your ID number"
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a copy of your ID document
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or PDF, max 5MB
                  </p>
                </div>

                <div className="border-t pt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                      required
                    />
                    <span className="text-sm text-foreground">
                      I agree to the{' '}
                      <Link href="/terms" className="text-secondary hover:underline">
                        Terms of Service
                      </Link>
                      ,{' '}
                      <Link href="/privacy" className="text-secondary hover:underline">
                        Privacy Policy
                      </Link>
                      , and{' '}
                      <Link href="/vendor-agreement" className="text-secondary hover:underline">
                        Vendor Agreement
                      </Link>
                      . I confirm that all information provided is accurate.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <Link href="/auth/signin">
                  <Button type="button" variant="ghost">
                    Already have an account?
                  </Button>
                </Link>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid())
                  }
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStep3Valid() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Creating Store...
                    </>
                  ) : (
                    <>
                      Create My Store
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-heading font-bold text-primary mb-2">Free to Start</h3>
            <p className="text-sm text-muted-foreground">
              No monthly fees. Only pay a small commission when you make a sale.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-primary mb-2">Reach Global Buyers</h3>
            <p className="text-sm text-muted-foreground">
              Sell to customers across Africa and worldwide from day one.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-primary mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">
              Our seller support team is always here to help you succeed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
