'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, getToken, clearTokens } from '@/lib/api';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  role_display: string;
  phone: string;
  is_main_admin: boolean;
  is_admin_user: boolean;
}

export function useAuth(redirect = true) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      if (redirect) router.push('/admin/login');
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => {
        clearTokens();
        if (redirect) router.push('/admin/login');
      })
      .finally(() => setLoading(false));
  }, [router, redirect]);

  return { user, loading, logout: () => { clearTokens(); router.push('/admin/login'); } };
}
