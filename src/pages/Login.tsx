import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSending, setResetSending] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      const user = useAuthStore.getState().user;
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        toast.error('Invalid email or password');
      } else if (code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please try again later.');
      } else {
        toast.error('Sign in failed. Please try again.');
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) { toast.error('Please enter your email address'); return; }
    setResetSending(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      toast.success('Password reset email sent. Check your inbox.');
      setResetOpen(false);
      setResetEmail('');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        toast.error('No account found with that email');
      } else {
        toast.error('Failed to send reset email. Try again.');
      }
    } finally {
      setResetSending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy-gradient items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src="/onem-logo.jpg" alt="Onem" className="h-24 w-auto object-contain rounded mx-auto mb-6" />
          <h1 className="font-display text-4xl text-gold-light mb-4">Members Club</h1>
          <p className="text-lg" style={{ color: 'hsl(220 20% 70%)' }}>
            An exclusive community of exceptional individuals. Access premium experiences in Granada and Barcelona.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src="/onem-logo.jpg" alt="Onem" className="h-10 w-auto object-contain rounded" />
            <span className="font-display text-2xl text-foreground">Members Club</span>
          </div>
          <h2 className="font-display text-3xl text-foreground mb-2">Sign In</h2>
          <p className="text-muted-foreground mb-8">Enter your credentials to access the portal</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" {...register('email')} className="mt-1.5" />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setResetOpen(true)}
                  className="text-xs text-navy hover:opacity-70 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gold-gradient text-white hover:opacity-90 font-semibold">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={resetOpen} onOpenChange={open => { if (!resetSending) { setResetOpen(open); if (!open) setResetEmail(''); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gold" /> Reset Password
            </DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="reset_email">Email</Label>
            <Input
              id="reset_email"
              type="email"
              placeholder="your@email.com"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordReset()}
              className="mt-1.5"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={resetSending} onClick={() => { setResetOpen(false); setResetEmail(''); }}>
              Cancel
            </Button>
            <Button
              className="bg-gold-gradient text-white hover:opacity-90"
              disabled={resetSending}
              onClick={handlePasswordReset}
            >
              {resetSending ? 'Sending...' : 'Send Reset Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
