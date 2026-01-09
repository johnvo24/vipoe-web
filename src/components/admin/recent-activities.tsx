import UserAvatar from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const activities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'completed order',
    orderId: '#12345',
    time: '2 minutes ago',
    type: 'success',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'registered new account',
    time: '15 minutes ago',
    type: 'info',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    action: 'cancelled order',
    orderId: '#12344',
    time: '1 hour ago',
    type: 'warning',
  },
  {
    id: 4,
    user: 'Sarah Williams',
    action: 'left a review',
    time: '2 hours ago',
    type: 'success',
  },
  {
    id: 5,
    user: 'Tom Brown',
    action: 'requested refund',
    orderId: '#12343',
    time: '3 hours ago',
    type: 'warning',
  },
];

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <UserAvatar className="h-10 w-10" fallbackText='T' />
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>{' '}
                  {activity.orderId && (
                    <Badge variant="outline" className="ml-1">
                      {activity.orderId}
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
