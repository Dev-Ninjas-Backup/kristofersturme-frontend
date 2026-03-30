import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Crown, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, { message: 'Passwords must match', path: ['confirm_password'] });

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore(s => s.register);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    const success = registerUser({ email: data.email, password: data.password, first_name: data.first_name, last_name: data.last_name });
    if (success) {
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } else {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy-gradient items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Crown className="w-16 h-16 text-gold mx-auto mb-6" />
          <h1 className="font-display text-4xl text-gold-light mb-4">Join the Club</h1>
          <p className="text-lg" style={{ color: 'hsl(220 20% 70%)' }}>
            Become part of an exclusive network of professionals, entrepreneurs, and creatives.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Crown className="w-8 h-8 text-gold" />
            <span className="font-display text-2xl text-foreground">Members Club</span>
          </div>
          <h2 className="font-display text-3xl text-foreground mb-2">Create Account</h2>
          <p className="text-muted-foreground mb-8">Fill in your details to join</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" {...register('first_name')} className="mt-1.5" />
                {errors.first_name && <p className="text-sm text-destructive mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...register('last_name')} className="mt-1.5" />
                {errors.last_name && <p className="text-sm text-destructive mt-1">{errors.last_name.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" {...register('email')} className="mt-1.5" />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input id="confirm_password" type="password" {...register('confirm_password')} className="mt-1.5" />
              {errors.confirm_password && <p className="text-sm text-destructive mt-1">{errors.confirm_password.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gold-gradient text-accent-foreground hover:opacity-90 font-semibold">
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-dark font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
