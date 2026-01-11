'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserProfile, updateUserProfile } from '@/app/account/actions';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Shield, 
  Bell, 
  Lock, 
  ChevronRight,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button, Input } from '@/components/ui';

type Tab = 'profile' | 'security' | 'notifications';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    async function loadProfile() {
      const profile = await getUserProfile();
      if (profile) {
        setUserProfile(profile);
        const [first, ...rest] = (profile.full_name || '').split(' ');
        setFormData({
          first_name: first || '',
          last_name: rest.join(' ') || '',
          email: profile.email || '',
          phone: profile.phone || '',
        });
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    
    const result = await updateUserProfile({
      firstName: formData.first_name,
      lastName: formData.last_name,
      phone: formData.phone,
    });

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Update local profile state to reflect changes
      setUserProfile((prev: any) => ({
        ...prev,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        phone: formData.phone
      }));
    } else {
      console.error(result.error);
    }
  };

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [notifications, setNotifications] = useState({
    email_orders: true,
    email_promotions: false,
    email_newsletter: true,
    push_orders: true,
    push_promotions: false,
    sms_orders: false,
  });

  const handlePasswordChange = () => {
    // Mock password change for now
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    setShowPasswordForm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const TABS = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-heading font-bold text-primary">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-success" />
            <p className="text-success">Changes saved successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-secondary text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Quick Links */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/orders"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                >
                  My Orders
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                >
                  Wishlist
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                >
                  Addresses
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleSave}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                  {isLoading ? (
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-secondary to-primary flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">
                            {(formData.first_name?.[0] || '').toUpperCase()}{(formData.last_name?.[0] || '').toUpperCase()}
                          </span>
                        </div>
                        {isEditing && (
                          <button 
                            className="absolute bottom-0 right-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-colors"
                            aria-label="Change profile picture"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {formData.first_name} {formData.last_name}
                        </h3>
                        <p className="text-muted-foreground">
                          Member since {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    ) : (
                      <p className="px-4 py-2 bg-muted rounded-lg">{formData.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    ) : (
                      <p className="px-4 py-2 bg-muted rounded-lg">{formData.last_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      {isEditing ? (
                        <Input
                          type="email"
                          value={formData.email}
                          disabled={true} // Email changes require re-verification
                          className="opacity-70 cursor-not-allowed"
                          title="Contact support to change email"
                        />
                      ) : (
                        <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
                          <span>{formData.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <div className="relative">
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
                          <span>{formData.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Password Section */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                      {showPasswordForm ? 'Cancel' : 'Change Password'}
                    </Button>
                  </div>

                  {showPasswordForm && (
                    <div className="mt-6 pt-6 border-t border-border space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <Input
                          type="password"
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <Button variant="primary" onClick={handlePasswordChange}>
                        Update Password
                      </Button>
                    </div>
                  )}
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          {userProfile?.two_factor_enabled 
                            ? 'Your account is protected with 2FA' 
                            : 'Add an extra layer of security'}
                        </p>
                      </div>
                    </div>
                    {userProfile?.two_factor_enabled ? (
                      <span className="flex items-center gap-1 text-sm text-success">
                        <Check className="w-4 h-4" />
                        Enabled
                      </span>
                    ) : (
                      <Link href="/auth/2fa">
                        <Button variant="outline" size="sm">
                          Enable 2FA
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Login Sessions */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-medium mb-4">Active Sessions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Chrome on Windows</p>
                        <p className="text-sm text-muted-foreground">Lagos, Nigeria • Current session</p>
                      </div>
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                        Active Now
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-sm text-muted-foreground">Lagos, Nigeria • Last active 2 hours ago</p>
                      </div>
                      <button className="text-sm text-error hover:underline">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>

                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email_orders', label: 'Order updates', desc: 'Get notified about your order status changes' },
                        { key: 'email_promotions', label: 'Promotions & offers', desc: 'Receive exclusive deals and discounts' },
                        { key: 'email_newsletter', label: 'Newsletter', desc: 'Weekly updates about new products and features' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              notifications[item.key as keyof typeof notifications] ? 'bg-secondary' : 'bg-muted'
                            }`}
                            aria-label={`Toggle ${item.label}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="font-medium flex items-center gap-2 mb-4">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'push_orders', label: 'Order updates', desc: 'Real-time notifications for order status' },
                        { key: 'push_promotions', label: 'Promotions & offers', desc: 'Instant alerts for flash sales' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              notifications[item.key as keyof typeof notifications] ? 'bg-secondary' : 'bg-muted'
                            }`}
                            aria-label={`Toggle ${item.label}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="font-medium flex items-center gap-2 mb-4">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      SMS Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order updates</p>
                          <p className="text-sm text-muted-foreground">Get SMS for important order updates</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, sms_orders: !notifications.sms_orders })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications.sms_orders ? 'bg-secondary' : 'bg-muted'
                          }`}
                          aria-label="Toggle SMS order updates"
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            notifications.sms_orders ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button variant="primary" onClick={handleSave}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
