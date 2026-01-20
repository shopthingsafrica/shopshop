import { Metadata } from 'next';
import Image from 'next/image';
import { Heart, Globe, Shield, Users, Award, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - ShopThings',
  description: 'Learn about ShopThings - the premier African marketplace connecting authentic vendors with customers worldwide.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text