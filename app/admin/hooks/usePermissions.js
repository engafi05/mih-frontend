import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export function usePermissions() {
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                if (!token) {
                    router.push('/admin/login');
                    return;
                }

                const response = await axios.get('http://engafi05-001-site1.stempurl.com/api/admin/pages', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // For now, just set all permissions to true for admin
                // In a real app, you'd fetch the user's specific permissions
                const perms = {};
                response.data.forEach(page => {
                    perms[page.Path] = { canView: true, canEdit: true };
                });

                setPermissions(perms);
            } catch (error) {
                console.error('Error fetching permissions:', error);
                if (error.response?.status === 401) {
                    router.push('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [router]);

    const hasPermission = (path, action = 'view') => {
        if (loading) return false;
        const page = permissions[path] || permissions['/admin'];
        if (!page) return false;
        return action === 'edit' ? page.canEdit : page.canView;
    };

    return { hasPermission, loading };
}