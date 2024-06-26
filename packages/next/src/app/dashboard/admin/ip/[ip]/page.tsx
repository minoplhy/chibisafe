import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { fetchEndpoint } from '@/lib/fileFetching';
import type { PageQuery } from '@/types';
import { FilesList } from '@/components/FilesList';
import { BanThisIpDialog } from '@/components/dialogs/BanThisIpDialog';
import { redirect } from 'next/navigation';
import { BanThisIpDrawer } from '@/components/drawers/BanThisIpDrawer';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - IPs'
};

export default async function DashboardPage({
	params,
	searchParams
}: {
	readonly params: { ip: string };
	readonly searchParams: PageQuery;
}) {
	const ip = decodeURIComponent(params.ip);
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;

	const { data: response, error, status } = await fetchEndpoint({ type: 'admin', ip }, currentPage, perPage);
	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<DashboardHeader
				title={`${ip} files`}
				subtitle="As an admin, you can manage their files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Banned IPs', url: '/dashboard/admin/ip' },
					{ name: ip, url: `/dashboard/admin/ip/${ip}` }
				]}
			>
				{response.banned ? null : (
					<>
						<BanThisIpDialog ip={ip} className="hidden md:inline-flex" />
						<BanThisIpDrawer ip={ip} className="md:hidden inline-flex" />
					</>
				)}
			</DashboardHeader>
			<div className="px-2 w-full">
				<FilesList type="admin" files={response.files} count={response.count} />
			</div>
		</>
	);
}
