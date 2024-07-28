import { HeaderDashboard } from '@/components/dashboard/header-dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderDashboard />
      <div className="flex items-center justify-between mt-8 px-4 sm:px-20">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        <Button className="sm:inline-flex">
          Create New Order
        </Button>
      </div>
      <div className=" items-center justify-between mt-8 px-4 sm:px-20">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 gap-6"
        >
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">
                  Order #12345
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div className="text-muted-foreground mb-4">
                Placed on 2023-04-15
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-medium">
                  $99.99
                </div>
                <Button variant="outline" size="sm">
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">
                  Order #12346
                </div>
                <Badge variant="default">Fulfilled</Badge>
              </div>
              <div className="text-muted-foreground mb-4">
                Placed on 2023-04-12
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-medium">
                  $149.99
                </div>
                <Button variant="outline" size="sm">
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">
                  Order #12347
                </div>
                <Badge variant="destructive">
                  Cancelled
                </Badge>
              </div>
              <div className="text-muted-foreground mb-4">
                Placed on 2023-04-10
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-medium">
                  $79.99
                </div>
                <Button variant="outline" size="sm">
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">
                  Order #12348
                </div>
                <Badge variant="secondary">Fulfilled</Badge>
              </div>
              <div className="text-muted-foreground mb-4">
                Placed on 2023-04-08
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-medium">
                  $199.99
                </div>
                <Button variant="outline" size="sm">
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">
                  Order #12349
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div className="text-muted-foreground mb-4">
                Placed on 2023-04-05
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-medium">
                  $59.99
                </div>
                <Button variant="outline" size="sm">
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">
                  Order #12350
                </div>
                <Badge variant="default">Fulfilled</Badge>
              </div>
              <div className="text-muted-foreground mb-4">
                Placed on 2023-04-03
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-medium">
                  $129.99
                </div>
                <Button variant="outline" size="sm">
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">
                  Order #12351
                </div>
                <Badge variant="secondary">Cancelled</Badge>
              </div>
              <div className="text-muted-foreground mb-4">
                Placed on 2023-03-30
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-medium">
                  $89.99
                </div>
                <Button variant="outline" size="sm">
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">
                  Order #12352
                </div>
                <Badge variant="outline">Fulfilled</Badge>
              </div>
              <div className="text-muted-foreground mb-4">
                Placed on 2023-03-28
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-medium">
                  $169.99
                </div>
                <Button variant="outline" size="sm">
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
