import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { getToken } from '@/services/auth';

export default function Index() {
  const [target, setTarget] = useState<'/home' | '/login' | null>(null);

  useEffect(() => {
    getToken().then((token) => setTarget(token ? '/home' : '/login'));
  }, []);

  if (!target) return null;
  return <Redirect href={target} />;
}
