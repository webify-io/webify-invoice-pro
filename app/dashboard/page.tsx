import { DashboardBlocks } from '../components/DashboardBlocks';
import { signOut } from '../utils/auth';
import { requireUser } from '../utils/hooks';

export default async function DashboardRoute() {
	const session = await requireUser();

	return (
		<>
			<DashboardBlocks />
		</>
	);
}
