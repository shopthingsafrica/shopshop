import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ShopThings',
  description: 'Privacy policy for ShopThings African marketplace - how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-heading font-bold text-primary mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-8">
            <strong>Last updated:</strong> January 20, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">1. Introduction</h2>
            <p className="mb-4">
              ShopThings ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform.
            </p>
            <p>
              By using ShopThings, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
            <p className="mb-4">We may collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name and contact information (email, phone, address)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (processed securely by our payment partners)</li>
              <li>Profile information and preferences</li>
              <li>Communication history with us</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Business Information (Vendors)</h3>
            <p className="mb-4">For vendor accounts, we also collect:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Business name and registration details</li>
              <li>Tax identification numbers</li>
              <li>Bank account information for payments</li>
              <li>Business verification documents</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Usage Information</h3>
            <p className="mb-4">We automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage patterns and preferences</li>
              <li>Log files and analytics data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our marketplace platform</li>
              <li>Process transactions and payments</li>
              <li>Verify vendor accounts and prevent fraud</li>
              <li>Send important notifications and updates</li>
              <li>Provide customer support</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">4. Information Sharing</h2>
            <p className="mb-4">We may share your information with:</p>
            
            <h3 className="text-xl font-semibold mb-3">4.1 Other Users</h3>
            <p className="mb-4">
              When you make a purchase or sell a product, certain information (like shipping address for buyers, store information for vendors) is shared to facilitate the transaction.
            </p>

            <h3 className="text-xl font-semibold mb-3">4.2 Service Providers</h3>
            <p className="mb-4">We work with trusted third-party service providers for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Payment processing</li>
              <li>Email delivery</li>
              <li>Analytics and monitoring</li>
              <li>Customer support</li>
              <li>Cloud hosting and storage</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, court order, or to protect our rights, property, or safety, or that of our users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="mb-4">Security measures include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing</li>
              <li>Regular software updates and patches</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
              <li><strong>Erasure:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">7. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
            <p className="mb-4">Types of cookies we use:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing cookies:</strong> Deliver relevant advertisements (with consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">8. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
            <p>
              Account information is typically retained for the duration of your account plus a reasonable period afterward for legal and business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">9. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">10. Children's Privacy</h2>
            <p>
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-primary mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@shopthings.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@shopthings.com</p>
              <p><strong>Address:</strong> ShopThings Privacy Team</p>
              <p>123 Marketplace Street</p>
              <p>Lagos, Nigeria</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}