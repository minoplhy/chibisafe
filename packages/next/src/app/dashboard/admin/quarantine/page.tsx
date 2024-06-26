import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Quarantine'
};

export default async function DashboardAdminQuarantinePage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const { data: response, error, status } = await fetchEndpoint({ type: 'quarantine' }, currentPage, perPage, search);
	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<DashboardHeader
				title="Quarantined files"
				subtitle="Manage quarantined files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Quarantined files', url: '/dashboard/admin/quarantine' }
				]}
			/>
			<div className="px-2 w-full">
				<FilesList type="quarantine" files={response.files} count={response.count} />
			</div>
		</>
	);
}
