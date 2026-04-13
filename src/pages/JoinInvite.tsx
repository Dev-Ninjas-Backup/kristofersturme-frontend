import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getInvitation, markInvitationUsed, setUserData } from '@/lib/db';
import { set, ref } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { MemberProfile } from '@/types';

type PageState = 'loading' | 'invalid' | 'expired' | 'used' | 'revoked' | 'ready' | 'success';

const JoinInvite = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, _setAuth } = useAuthStore();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [prefillEmail, setPrefillEmail] = useState<string>('');

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (!token) { setPageState('invalid'); return; }

    getInvitation(token).then(invite => {
      if (!invite) { setPageState('invalid'); return; }
      console.log('[JoinInvite] invite data:', invite);
      if (invite.status === 'revoked') { setPageState('revoked'); return; }
      // max_uses is undefined (not null) when Firebase drops the null field — use != null (loose)
      const maxUses = invite.max_uses ?? null;
      const usedCount = invite.used_count ?? 0;
      const exhausted = maxUses != null && usedCount >= maxUses;
      if (invite.status === 'used' || exhausted) { setPageState('used'); return; }
      if (invite.expires_at && new Date() > new Date(invite.expires_at)) { setPageState('expired'); return; }
      if (invite.email) {
        setPrefillEmail(invite.email);
        setForm(f => ({ ...f, email: invite.email! }));
      }
      setPageState('ready');
    }).catch(() => setPageState('invalid'));
  }, [token, user]);

  const f = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { first_name, last_name, email, password } = form;
    if (!first_name.trim()) { toast.error('First name is required'); return; }
    if (!email.trim()) { toast.error('Email is required'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;

      await setUserData(uid, { email: email.trim(), role: 'member', is_active: true });

      const memberId = `m_${uid.slice(0, 8)}`;
      const memberProfile: MemberProfile = {
        id: memberId,
        user_id: uid,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        avatar_url: null,
        bio: null,
        occupation: null,
        phone: null,
        website_url: null,
        linkedin_url: null,
        instagram_url: null,
        twitter_url: null,
        is_visible: true,
        location: null,
        skills: [],
      };
      await set(ref(database, `members/${memberId}`), memberProfile);

      await markInvitationUsed(token!);

      _setAuth({ id: uid, email: email.trim(), role: 'member', is_active: true }, false);

      setPageState('success');
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use') toast.error('That email is already registered — try logging in');
      else if (code === 'auth/invalid-email') toast.error('Invalid email address');
      else if (code === 'auth/weak-password') toast.error('Password is too weak');
      else toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusMessages: Record<Exclude<PageState, 'loading' | 'ready' | 'success'>, { title: string; body: string }> = {
    invalid: { title: 'Invalid invite link', body: 'This invite link does not exist or has been removed.' },
    expired: { title: 'Invite link expired', body: 'This invite link has expired. Ask your admin for a new one.' },
    used: { title: 'Invite no longer available', body: 'This invite link has reached its maximum number of uses.' },
    revoked: { title: 'Invite revoked', body: 'This invite link has been cancelled by the admin.' },
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-gradient items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src="/onem-logo.jpg" alt="Onem" className="h-24 w-auto object-contain rounded mx-auto mb-6" />
          <h1 className="font-display text-4xl text-gold-light mb-4">Members Club</h1>
          <p className="text-lg" style={{ color: 'hsl(220 20% 70%)' }}>
            An exclusive community of exceptional individuals. Access premium experiences in Granada and Barcelona.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src="/onem-logo.jpg" alt="Onem" className="h-10 w-auto object-contain rounded" />
            <span className="font-display text-2xl text-foreground">Members Club</span>
          </div>

          {/* Loading */}
          {pageState === 'loading' && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Validating your invite...</p>
            </div>
          )}

          {/* Error states */}
          {['invalid', 'expired', 'used', 'revoked'].includes(pageState) && (
            <div className="text-center space-y-4">
              <XCircle className="w-12 h-12 text-destructive mx-auto" />
              <h2 className="font-display text-2xl text-foreground">
                {statusMessages[pageState as keyof typeof statusMessages].title}
              </h2>
              <p className="text-muted-foreground">
                {statusMessages[pageState as keyof typeof statusMessages].body}
              </p>
              <Link to="/login">
                <Button variant="outline" className="mt-2">Back to Sign In</Button>
              </Link>
            </div>
          )}

          {/* Success */}
          {pageState === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h2 className="font-display text-2xl text-foreground">Welcome aboard!</h2>
              <p className="text-muted-foreground">Your account has been created. Taking you to the dashboard...</p>
            </div>
          )}

          {/* Registration form */}
          {pageState === 'ready' && (
            <>
              <h2 className="font-display text-3xl text-foreground mb-2">Create your account</h2>
              <p className="text-muted-foreground mb-8">You've been invited to join the Members Club.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="first_name">First Name <span className="text-destructive">*</span></Label>
                    <Input id="first_name" value={form.first_name} onChange={f('first_name')} placeholder="James" className="mt-1.5" autoFocus />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" value={form.last_name} onChange={f('last_name')} placeholder="Whitfield" className="mt-1.5" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={f('email')}
                    placeholder="your@email.com"
                    className="mt-1.5"
                    readOnly={!!prefillEmail}
                  />
                  {prefillEmail && (
                    <p className="text-xs text-muted-foreground mt-1">Email address set by your admin.</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={f('password')}
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold-gradient text-white hover:opacity-90 font-semibold"
                >
                  {submitting ? 'Creating account...' : 'Join the Members Club'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-navy hover:opacity-70 transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinInvite;
