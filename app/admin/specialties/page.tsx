import SpecialtiesTable from '@/components/Admin/Specialties/SpecialtiesTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'إدارة التخصصات الطبية',
    description: 'إدارة التخصصات الطبية في المستشفى',
};

export default function SpecialtiesPage() {
    return (
        <div className="p-6">
            <SpecialtiesTable />
        </div>
    );
}