'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp,
  Search,
  Send,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Store,
  Shield,
  Check
} from 'lucide-react';
import { Button, Input, Textarea, Select } from '@/components/ui';

type FAQCategory = 'orders' | 'payments' | 'shipping' | 'returns' | 'vendors' | 'account';

const FAQ_CATEGORIES = [
  { id: 'orders' as const, label: 'Orders', icon: Package },
  { id: 'payments' as const, label: 'Payments', icon: CreditCard },
  { id: 'shipping' as const, label: 'Shipping', icon: Truck },
  { id: 'returns' as const, label: 'Returns', icon: RotateCcw },
  { id: 'vendors' as const, label: 'Vendors', icon: Store },
  { id: 'account' as const, label: 'Account', icon: Shield },
];

const FAQS: Record<FAQCategory, { question: string; answer: string }[]> = {
  orders: [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by going to "My Orders" in your account. Click on the order you want to track and you\'ll see the current status and tracking information if available. You\'ll also receive email updates as your order progresses.',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order if it hasn\'t been shipped yet. Go to "My Orders", find the order you want to cancel, and click "Cancel Order". If the order has already shipped, you\'ll need to wait to receive it and then request a return.',
    },
    {
      question: 'What if I receive a damaged item?',
      answer: 'If you receive a damaged item, please contact our support team within 48 hours of delivery with photos of the damage. We\'ll arrange a replacement or refund for you. Make sure to keep the original packaging until the issue is resolved.',
    },
    {
      question: 'Can I change my order after placing it?',
      answer: 'Orders can only be modified within 1 hour of placement. After that, you\'ll need to cancel and place a new order. Contact our support team immediately if you need to make changes to a recent order.',
    },
  ],
  payments: [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including credit/debit cards (Visa, Mastercard), bank transfers, mobile money (M-Pesa, MTN Mobile Money), and Paystack. The available options may vary based on your location.',
    },
    {
      question: 'Is it safe to pay on ShopThings?',
      answer: 'Absolutely! We use industry-standard encryption to protect your payment information. All transactions are processed through secure payment gateways like Paystack and Flutterwave. We never store your full card details on our servers.',
    },
    {
      question: 'Why was my payment declined?',
      answer: 'Payments can be declined for various reasons including insufficient funds, incorrect card details, bank restrictions, or security flags. Please verify your card details and contact your bank if the issue persists. You can also try an alternative payment method.',
    },
    {
      question: 'When will I be charged for my order?',
      answer: 'Your payment is processed immediately when you place an order. For card payments, you\'ll see the charge right away. For bank transfers, your order is confirmed once we receive the payment.',
    },
  ],
  shipping: [
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by location and seller. Domestic orders typically arrive within 3-7 business days. International orders may take 10-21 business days. Each product page shows estimated delivery times specific to that item.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to most countries worldwide. International shipping rates and delivery times vary by destination. You can see the shipping cost at checkout before completing your order.',
    },
    {
      question: 'How much does shipping cost?',
      answer: 'Shipping costs depend on the item weight, size, and destination. Many vendors offer free shipping on orders above a certain amount. The exact shipping cost is calculated at checkout.',
    },
    {
      question: 'Can I get express shipping?',
      answer: 'Express shipping is available for select items and locations. If available, you\'ll see the express shipping option at checkout. Express orders typically arrive 2-3 business days faster than standard shipping.',
    },
  ],
  returns: [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be unused, in original packaging, and with all tags attached. Some items like custom-made products, perishables, and intimates may not be eligible for returns.',
    },
    {
      question: 'How do I start a return?',
      answer: 'To start a return, go to "My Orders", find the order with the item you want to return, and click "Return Item". Follow the prompts to select the reason and get your return shipping label. Pack the item securely and drop it off at the designated carrier.',
    },
    {
      question: 'When will I receive my refund?',
      answer: 'Once we receive and inspect your return, refunds are processed within 5-7 business days. The refund will be credited to your original payment method. Bank processing times may add a few extra days.',
    },
    {
      question: 'Do I have to pay for return shipping?',
      answer: 'Return shipping is free for defective or incorrect items. For change-of-mind returns, a shipping fee may be deducted from your refund. The exact policy varies by vendor and is shown during the return process.',
    },
  ],
  vendors: [
    {
      question: 'How do I become a vendor?',
      answer: 'To become a vendor, click "Sell on ShopThings" and complete the registration form. You\'ll need to provide business information, bank details for payments, and agree to our seller terms. Our team reviews applications within 2-3 business days.',
    },
    {
      question: 'What fees do vendors pay?',
      answer: 'We charge a commission on each sale, which varies by category (typically 5-15%). There are no monthly fees or listing fees. Payment processing fees are included in the commission. You receive your earnings minus the commission.',
    },
    {
      question: 'How do I get verified as a vendor?',
      answer: 'Verified vendor status is granted to sellers who meet our quality standards, including positive reviews, timely shipping, and responsive customer service. Apply for verification in your vendor dashboard after 3 months of selling.',
    },
    {
      question: 'How do I contact a vendor?',
      answer: 'You can contact vendors through the "Chat with Seller" button on product pages or their store page. Some vendors also offer WhatsApp support. Look for the green WhatsApp button on their profile.',
    },
  ],
  account: [
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a link to create a new password. The link expires after 1 hour for security. If you don\'t receive the email, check your spam folder.',
    },
    {
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Account Settings > Security > Two-Factor Authentication. You can set up 2FA using an authenticator app, SMS, or email. We recommend using an authenticator app for the best security.',
    },
    {
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account from Account Settings. This action is permanent and cannot be undone. Any pending orders must be completed or cancelled first. Your data will be deleted according to our privacy policy.',
    },
    {
      question: 'How do I update my email address?',
      answer: 'Go to Account Settings > Profile to update your email. You\'ll need to verify the new email address before the change takes effect. A verification link will be sent to both your old and new email addresses.',
    },
  ],
};

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('orders');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    order_number: '',
    message: '',
  });

  const filteredFaqs = searchQuery.trim()
    ? Object.entries(FAQS).flatMap(([category, faqs]) =>
        faqs
          .filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(faq => ({ ...faq, category: category as FAQCategory }))
      )
    : null;

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowContactForm(false);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        order_number: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            How can we help you?
          </h1>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-foreground bg-white border-0 focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Results */}
        {filteredFaqs && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
            </h2>
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <span className="text-xs text-secondary font-medium uppercase">
                          {faq.category}
                        </span>
                        <p className="font-medium mt-1">{faq.question}</p>
                      </div>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4 text-muted-foreground">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-border">
                <p className="text-muted-foreground mb-4">No results found. Try a different search or contact us.</p>
                <Button variant="primary" onClick={() => setShowContactForm(true)}>
                  Contact Support
                </Button>
              </div>
            )}
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sm text-secondary hover:underline"
            >
              Clear search and view all FAQs
            </button>
          </div>
        )}

        {/* FAQ Categories */}
        {!filteredFaqs && (
          <>
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {FAQ_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenFaq(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-secondary text-white'
                      : 'bg-white border border-border hover:border-secondary/50'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3 mb-12">
              {FAQS[activeCategory].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contact Section */}
        <div className="bg-white rounded-2xl border border-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
            <p className="text-muted-foreground">
              Our support team is here to assist you
            </p>
          </div>

          {!showContactForm ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowContactForm(true)}
                className="flex flex-col items-center gap-3 p-6 border border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-colors"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">Get help via email</p>
                </div>
              </button>

              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 border border-border rounded-xl hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors"
              >
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div className="text-center">
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Chat with us</p>
                </div>
              </a>

              <a
                href="tel:+2348012345678"
                className="flex flex-col items-center gap-3 p-6 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+234 801 234 5678</p>
                </div>
              </a>
            </div>
          ) : formSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitContact} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <Input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    options={[
                      { value: '', label: 'Select a topic' },
                      { value: 'order', label: 'Order Issue' },
                      { value: 'payment', label: 'Payment Problem' },
                      { value: 'refund', label: 'Refund Request' },
                      { value: 'shipping', label: 'Shipping Question' },
                      { value: 'vendor', label: 'Vendor Inquiry' },
                      { value: 'other', label: 'Other' },
                    ]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Order Number <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <Input
                    type="text"
                    value={contactForm.order_number}
                    onChange={(e) => setContactForm({ ...contactForm, order_number: e.target.value })}
                    placeholder="ORD-123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Business Hours */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            <strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM WAT
          </p>
          <p className="mt-1">
            Average response time: 2-4 hours during business hours
          </p>
        </div>
      </div>
    </div>
  );
}
