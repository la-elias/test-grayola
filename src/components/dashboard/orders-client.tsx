import OrderCard from "./order-card"
import { type Database } from "@/app/types/database"

interface OrdersGridProps {
    projects: Array<Database["public"]["Tables"]["projects"]["Row"]>
}

export default function OrdersGrid({ projects }: OrdersGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto max-h-screen">
      {projects.map(projects => (
        <OrderCard key={projects.id} projects={projects} />
      ))}
    </div>
  )
}