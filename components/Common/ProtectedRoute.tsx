// components/common/ProtectedRoute.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { checkPermission } from '@/utils/permissions';

const ProtectedRoute = ({ children, requiredPermission = 'view' }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                router.push('/admin/login');
                return;
            }

            try {
                const response = await fetch('/api/admin/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Unauthorized');
                
                const userData = await response.json();
                setUser(userData);
                
                const hasPermission = checkPermission(userData, router.pathname, requiredPermission);
                if (!hasPermission) {
                    router.push('/admin/unauthorized');
                }
            } catch (error) {
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, requiredPermission]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? children : null;
};

export default ProtectedRoute;