import SuccessStoriesTable from '@/components/Admin/Stories/SuccessStoriesTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'إدارة القصص الناجحة',
    description: 'عرض وإدارة قصص النجاح في المستشفى',
};

export default function SuccessStoriesPage() {
    return (
        <div className="p-6">
            <SuccessStoriesTable />
        </div>
    );
}