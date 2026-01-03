'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  CheckCircle, 
  ArrowLeft,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button, Input } from '@/components/ui';

type TwoFactorMethod = 'authenticator' | 'sms' | 'email';
type SetupStep = 'choose' | 'setup' | 'verify' | 'backup' | 'complete';

const MOCK_SECRET = 'JBSWY3DPEHPK3PXP';
const MOCK_BACKUP_CODES = [
  'A1B2C3D4',
  'E5F6G7H8',
  'I9J0K1L2',
  'M3N4O5P6',
  'Q7R8S9T0',
  'U1V2W3X4',
  'Y5Z6A7B8',
  'C9D0E1F2',
];

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const [method, setMethod] = useState<TwoFactorMethod>('authenticator');
  const [step, setStep] = useState<SetupStep>('choose');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const handleMethodSelect = (selectedMethod: TwoFactorMethod) => {
    setMethod(selectedMethod);
    setStep('setup');
  };

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    // Mock verification - in real app, verify with backend
    if (verificationCode === '123456') {
      setStep('backup');
    } else {
      setError('Invalid verification code. Try 123456 for demo.');
    }
  };

  const copySecret = async () => {
    await navigator.clipboard.writeText(MOCK_SECRET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyBackupCodes = async () => {
    await navigator.clipboard.writeText(MOCK_BACKUP_CODES.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleComplete = () => {
    setStep('complete');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary">
            Two-Factor Authentication
          </h1>
          <p className="text-muted-foreground mt-2">
            Add an extra layer of security to your account
          </p>
        </div>

        {/* Progress Steps */}
        {step !== 'complete' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {['choose', 'setup', 'verify', 'backup'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s 
                    ? 'bg-secondary text-white' 
                    : ['choose', 'setup', 'verify', 'backup'].indexOf(step) > i
                      ? 'bg-success text-white'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {['choose', 'setup', 'verify', 'backup'].indexOf(step) > i ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-1 mx-1 ${
                    ['choose', 'setup', 'verify', 'backup'].indexOf(step) > i
                      ? 'bg-success'
                      : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-border p-8">
          {/* Step 1: Choose Method */}
          {step === 'choose' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Choose your 2FA method</h2>
              
              <button
                onClick={() => handleMethodSelect('authenticator')}
                className="w-full p-4 border border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-colors text-left flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium">Authenticator App</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use an app like Google Authenticator or Authy to generate verification codes
                  </p>
                  <span className="inline-block mt-2 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect('sms')}
                className="w-full p-4 border border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-colors text-left flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">SMS Text Message</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive verification codes via text message to your phone
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect('email')}
                className="w-full p-4 border border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-colors text-left flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive verification codes via email
                  </p>
                </div>
              </button>

              <div className="pt-4">
                <Link href="/account/profile" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Profile
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Setup */}
          {step === 'setup' && (
            <div className="space-y-6">
              <button
                onClick={() => setStep('choose')}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {method === 'authenticator' && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">Set up Authenticator App</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Scan the QR code with your authenticator app or enter the secret key manually
                    </p>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="flex justify-center">
                    <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                      <div className="text-center">
                        <div className="grid grid-cols-5 gap-1 p-4">
                          {[...Array(25)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-6 h-6 ${Math.random() > 0.5 ? 'bg-primary' : 'bg-white'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secret Key */}
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Or enter this key manually:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-sm bg-white px-3 py-2 rounded border border-border">
                        {showSecret ? MOCK_SECRET : '••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="p-2 hover:bg-white rounded transition-colors"
                      >
                        {showSecret ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={copySecret}
                        className="p-2 hover:bg-white rounded transition-colors"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-success" />
                        ) : (
                          <Copy className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {method === 'sms' && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">Set up SMS Verification</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll send verification codes to your phone number
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Standard message and data rates may apply
                    </p>
                  </div>
                </>
              )}

              {method === 'email' && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">Set up Email Verification</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll send verification codes to your email address
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Codes will be sent to:
                    </p>
                    <p className="font-medium mt-1">user@example.com</p>
                  </div>
                </>
              )}

              <Button
                variant="primary"
                className="w-full"
                onClick={() => setStep('verify')}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 3: Verify */}
          {step === 'verify' && (
            <div className="space-y-6">
              <button
                onClick={() => setStep('setup')}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div>
                <h2 className="text-lg font-semibold">Enter Verification Code</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {method === 'authenticator' && 'Enter the 6-digit code from your authenticator app'}
                  {method === 'sms' && 'Enter the 6-digit code we sent to your phone'}
                  {method === 'email' && 'Enter the 6-digit code we sent to your email'}
                </p>
              </div>

              <div>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                />
                {error && (
                  <p className="text-sm text-error mt-2">{error}</p>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleVerify}
                disabled={verificationCode.length !== 6}
              >
                Verify
              </Button>

              {method !== 'authenticator' && (
                <p className="text-center text-sm text-muted-foreground">
                  Didn't receive the code?{' '}
                  <button className="text-secondary hover:underline">
                    Resend
                  </button>
                </p>
              )}
            </div>
          )}

          {/* Step 4: Backup Codes */}
          {step === 'backup' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Save Your Backup Codes</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep these codes in a safe place. You can use them to access your account if you lose your 2FA device.
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_BACKUP_CODES.map((code, i) => (
                    <code key={i} className="bg-white px-3 py-2 rounded text-sm font-mono text-center">
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={copyBackupCodes}
                >
                  {copiedCodes ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Codes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const text = MOCK_BACKUP_CODES.join('\n');
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'shopthings-backup-codes.txt';
                    a.click();
                  }}
                >
                  Download
                </Button>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-accent-foreground">
                  <strong>Important:</strong> Each backup code can only be used once. Generate new codes from your security settings if you run out.
                </p>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleComplete}
              >
                I've Saved My Codes
              </Button>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">2FA Enabled Successfully!</h2>
                <p className="text-muted-foreground mt-2">
                  Your account is now protected with two-factor authentication.
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4 text-left">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• You'll be asked for a verification code when you sign in</li>
                  <li>• Use your {method === 'authenticator' ? 'authenticator app' : method === 'sms' ? 'phone' : 'email'} to get codes</li>
                  <li>• Use backup codes if you lose access to your {method === 'authenticator' ? 'authenticator' : method === 'sms' ? 'phone' : 'email'}</li>
                </ul>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push('/account/profile')}
              >
                Go to Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
