import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type Database } from '@/app/types/database'

interface OrderCardProps {
  projects: Database['public']['Tables']['projects']['Row']
}

export default function OrderCard({
  projects
}: OrderCardProps) {
  return (
    <Card className="bg-background shadow-md rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-medium">
            {projects.title}
          </div>
          <Badge
            variant={
              projects.state === 'pending'
                ? 'secondary'
                : projects.state === 'done'
                  ? 'default'
                  : projects.state === 'cancel'
                    ? 'destructive'
                    : 'outline'
            }
          >
            {projects.state}
          </Badge>
        </div>
        <div className="text-muted-foreground mb-4">
          Placed on{' '}
          {new Date(
            projects.created_at
          ).toLocaleDateString()}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-primary font-medium">
            {projects.amount ? `${projects.amount.toFixed(2)}` : 'N/A'}
          </div>
          <Button variant="outline" size="sm">
            View Order
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
