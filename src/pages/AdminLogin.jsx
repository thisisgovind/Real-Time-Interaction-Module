
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, LogIn, Mail, Key, UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { registerAdmin, loginAdmin, isAdminAuthenticated, hasAdminAccount, verifyOtp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [loginStep, setLoginStep] = useState('credentials'); 

  useEffect(() => {
    setIsAccountCreated(hasAdminAccount());
    if (isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate, hasAdminAccount]);

  const handleCredentialSubmit = (e) => {
    e.preventDefault();
    if (!isAccountCreated) {
      if (registerAdmin(email, password)) {
        setLoginStep('otp'); 
        toast({ title: "Account Created! OTP Sent (Simulated)", description: "Enter OTP 123456 to verify."});
      }
    } else {
      if (loginAdmin(email, password)) {
        setLoginStep('otp');
        toast({ title: "OTP Sent (Simulated)", description: "Enter OTP 123456 to verify."});
      } else {
        setEmail('');
        setPassword('');
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (verifyOtp(otp)) {
      navigate('/admin');
    } else {
      setOtp('');
    }
  };
  
  const toggleFormMode = () => {
    setIsAccountCreated(!isAccountCreated);
    setEmail('');
    setPassword('');
    setOtp('');
    setLoginStep('credentials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect shadow-2xl">
          <CardHeader className="text-center">
            <motion.div className="floating mx-auto mb-4">
              {loginStep === 'credentials' ? (
                isAccountCreated ? <LogIn className="w-16 h-16 text-primary" /> : <UserPlus className="w-16 h-16 text-primary" />
              ) : (
                <Key className="w-16 h-16 text-primary" />
              )}
            </motion.div>
            <CardTitle className="text-3xl font-bold gradient-text">
              {loginStep === 'credentials' ? (isAccountCreated ? 'Admin Login' : 'Admin Registration') : 'Verify OTP'}
            </CardTitle>
            <CardDescription className="text-subtle">
              {loginStep === 'credentials' 
                ? (isAccountCreated ? 'Enter your admin credentials.' : 'Create your admin account.')
                : 'Enter the OTP sent to your email (simulated: 123456).'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginStep === 'credentials' && (
              <form onSubmit={handleCredentialSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-emphasis">Email</Label>
                  <div className="relative mt-2">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="pl-10"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-emphasis">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  </div>
                </div>
                <Button type="submit" className="w-full button-primary text-lg py-3 pulse-glow">
                  {isAccountCreated ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                  {isAccountCreated ? 'Login & Get OTP' : 'Register & Get OTP'}
                </Button>
                 <Button type="button" variant="link" onClick={toggleFormMode} className="w-full text-primary">
                  {isAccountCreated ? "Don't have an account? Register" : "Already have an account? Login"}
                </Button>
              </form>
            )}
            {loginStep === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="otp" className="text-emphasis">OTP</Label>
                  <div className="relative mt-2">
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="pl-10 tracking-widest text-center"
                      maxLength={6}
                      required
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  </div>
                </div>
                <Button type="submit" className="w-full button-primary text-lg py-3 pulse-glow">
                  <LogIn className="w-5 h-5 mr-2" />
                  Verify OTP & Login
                </Button>
                <Button type="button" variant="link" onClick={() => setLoginStep('credentials')} className="w-full text-primary">
                  Back to Login
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
