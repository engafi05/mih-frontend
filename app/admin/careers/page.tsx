import JobsTable from '@/components/Admin/Careers/JobsTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'إدارة الوظائف ',
    description: 'إدارة الوظائف الشاغرة في المستشفى',
};

export default function JobsPage() {
    return (
        <div className="p-6">
            <JobsTable />
        </div>
    );
}