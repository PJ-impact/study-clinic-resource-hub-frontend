'use server';

import { auth, signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}

export async function getCurrentUserFromApi() {
  const session = await auth();
  if (!session?.user?.apiToken) {
    return null;
  }

  const apiBase =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:5000';

  try {
    const res = await fetch(`${apiBase}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const user = await res.json();
    return user;
  } catch {
    return null;
  }
}
