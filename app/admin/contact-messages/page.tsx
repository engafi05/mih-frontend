import ContactMessagesTable from '@/components/Admin/ContactMessages/ContactMessagesTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'إدارة رسائل الاتصال',
    description: 'إدارة رسائل الاتصال الواردة',
};

export default function ContactMessagesPage() {
    return (
        <div className="p-6">
            <ContactMessagesTable />
        </div>
    );
}