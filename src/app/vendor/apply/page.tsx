'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  Info,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { submitVendorApplication } from './actions';

interface FormData {
  storeName: string;
  storeDescription: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  businessEmail: string;
  businessType: string;
  productCategories: string[];
  agreedToTerms: boolean;
}

const PRODUCT_CATEGORIES = [
  'Fashion & Apparel',
  'Art & Sculptures',
  'Home Decor',
  'Jewelry & Accessories',
  'Food & Beverages',
  'Beauty & Skincare',
  'Textiles & Fabrics',
  'Handcrafted Goods',
  'Musical Instruments',
  'Books & Stationery',
];

const BUSINESS_TYPES = [
  'Individual/Sole Proprietor',
  'Registered Business',
  'Cooperative/Artisan Group',
  'Non-Profit Organization',
];

export default function VendorApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    storeName: '',
    storeDescription: '',
    businessAddress: '',
    city: '',
    state: '',
    country: 'Nigeria',
    phoneNumber: '',
    businessEmail: '',
    businessType: '',
    productCategories: [],
    agreedToTerms: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter((c) => c !== category)
        : [...prev.productCategories, category],
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.storeName.trim().length >= 3 && 
               formData.storeDescription.trim().length >= 20;
      case 2:
        return formData.businessAddress.trim() !== '' &&
               formData.city.trim() !== '' &&
               formData.state.trim() !== '' &&
               formData.phoneNumber.trim() !== '';
      case 3:
        return formData.businessType !== '' && 
               formData.productCategories.length > 0;
      case 4:
        return formData.agreedToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await submitVendorApplication({
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        businessAddress: formData.businessAddress,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        businessEmail: formData.businessEmail || undefined,
        businessType: formData.businessType,
        productCategories: formData.productCategories,
      });
      
      if (result.error) {
        setError(result.error);
      } else {
        // Redirect to pending page
        router.push('/vendor/pending');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Store Info', icon: Store },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Business', icon: Building2 },
    { number: 4, title: 'Review', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-muted py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Become a Seller
              </h1>
              <p className="text-muted-foreground mt-0.5">
                Complete your seller application to start selling on ShopThings
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-border/50 shadow-sm">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-br from-secondary to-secondary/80 border-secondary text-white shadow-lg shadow-secondary/20'
                        : 'border-border/70 text-muted-foreground bg-muted/30'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium hidden sm:block transition-colors duration-200 ${
                      currentStep >= step.number
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-3 rounded-full transition-colors duration-300 ${
                      currentStep > step.number ? 'bg-secondary' : 'bg-border/50'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error/20 text-error rounded-xl p-4 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm">
          {/* Step 1: Store Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
                  Tell us about your store
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  This information will be displayed on your store page
                </p>
                <div className="space-y-5">
                  <Input
                    label="Store Name"
                    name="storeName"
                    placeholder="e.g., Accra Textiles & Crafts"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Store Description
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <textarea
                      name="storeDescription"
                      placeholder="Describe your store, what you sell, and what makes your products special..."
                      value={formData.storeDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background 
                        focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary 
                        transition-all duration-200 resize-none placeholder:text-muted-foreground/60"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Minimum 20 characters ({formData.storeDescription.length}/20)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Where are you located?
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Business Address"
                    name="businessAddress"
                    placeholder="Street address"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      placeholder="e.g., Lagos"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="State/Region"
                      name="state"
                      placeholder="e.g., Lagos State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Senegal">Senegal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Business Email (Optional)"
                    name="businessEmail"
                    type="email"
                    placeholder="business@example.com"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Business Type */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Business Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Business Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BUSINESS_TYPES.map((type) => (
                        <label
                          key={type}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.businessType === type
                              ? 'border-secondary bg-secondary/5'
                              : 'border-border hover:border-secondary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="businessType"
                            value={type}
                            checked={formData.businessType === type}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              formData.businessType === type
                                ? 'border-secondary'
                                : 'border-border'
                            }`}
                          >
                            {formData.businessType === type && (
                              <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                            )}
                          </div>
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Categories (select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRODUCT_CATEGORIES.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategoryToggle(category)}
                          className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                            formData.productCategories.includes(category)
                              ? 'bg-secondary text-white border-secondary'
                              : 'border-border hover:border-secondary/50'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected: {formData.productCategories.length} categories
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Review Your Application
                </h2>

                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Store Information</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Name:</span> {formData.storeName}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Description:</span> {formData.storeDescription}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.businessAddress}, {formData.city}, {formData.state}, {formData.country}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Phone:</span> {formData.phoneNumber}
                    </p>
                    {formData.businessEmail && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Email:</span> {formData.businessEmail}
                      </p>
                    )}
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Business Details</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Type:</span> {formData.businessType}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Categories:</span> {formData.productCategories.join(', ')}
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <span className="text-sm text-muted-foreground">
                        I agree to the{' '}
                        <Link href="/help/seller-terms" className="text-secondary hover:underline">
                          Seller Terms & Conditions
                        </Link>{' '}
                        and{' '}
                        <Link href="/help/privacy" className="text-secondary hover:underline">
                          Privacy Policy
                        </Link>
                        . I understand that my application will be reviewed and I will be notified via email.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Your application will be reviewed within 1-3 business days. We&apos;ll notify you via email once your store is approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!validateStep(4) || isLoading}
                isLoading={isLoading}
              >
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
