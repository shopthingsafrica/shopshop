'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function TestUploadPage() {
  const [productImages, setProductImages] = useState<string[]>([]);
  const [vendorLogo, setVendorLogo] = useState<string>('');

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Image Upload Test</h1>
      
      {/* Product Images Upload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Product Images (Multiple)</h2>
        <ImageUpload
          bucket="products"
          multiple={true}
          maxFiles={5}
          value={productImages}
          onChange={(urls) => setProductImages(Array.isArray(urls) ? urls : [urls])}
          className="max-w-2xl"
        />
        {productImages.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Uploaded URLs:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {productImages.map((url, index) => (
                <li key={index} className="break-all">{url}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Vendor Logo Upload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Vendor Logo (Single)</h2>
        <ImageUpload
          bucket="vendors"
          multiple={false}
          value={vendorLogo}
          onChange={(url) => setVendorLogo(Array.isArray(url) ? url[0] : url)}
          className="max-w-md"
        />
        {vendorLogo && (
          <div>
            <h3 className="font-medium mb-2">Uploaded URL:</h3>
            <p className="text-sm text-gray-600 break-all">{vendorLogo}</p>
          </div>
        )}
      </div>
    </div>
  );
}