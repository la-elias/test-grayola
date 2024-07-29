import { HeaderDashboard } from '@/components/dashboard/header-dashboard'
import ModalNewProject from '@/components/dashboard/modal-new-project'
import { getUser, avatarUrl, getProjects} from '@/actions'
import OrdersGrid from '@/components/dashboard/orders-client'

export default async function DashboardPage() {
  const user = await getUser()

  let avatar = 'https://github.com/shadcn.png'
  let projects = []

  if (user) {
    avatar = await avatarUrl(user.id)
    projects = await getProjects(user.id)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderDashboard avatarUrl={avatar} />
      <div className="flex items-center justify-between mt-8 px-4 sm:px-20">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        {user?.id && <ModalNewProject userId={user.id} />}
      </div>
      <div className=" items-center justify-between mt-8 px-4 sm:px-20">
        <OrdersGrid projects={projects} />
      </div>
    </div>
  )
}
