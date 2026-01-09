import { RecentActivities } from "@/components/admin/recent-activities";
import { SalesChart } from "@/components/admin/sales-chart";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";

const recentOrders = [
  {
    id: "#12345",
    customer: "John Doe",
    product: "Premium Package",
    amount: "$299.00",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#12344",
    customer: "Jane Smith",
    product: "Basic Package",
    amount: "$99.00",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "#12343",
    customer: "Mike Johnson",
    product: "Pro Package",
    amount: "$199.00",
    status: "processing",
    date: "2024-01-14",
  },
  {
    id: "#12342",
    customer: "Sarah Williams",
    product: "Enterprise Package",
    amount: "$499.00",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "#12341",
    customer: "Tom Brown",
    product: "Basic Package",
    amount: "$99.00",
    status: "cancelled",
    date: "2024-01-13",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231"
          change="+20.1% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value="2,345"
          change="+15% from last month"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Users"
          value="12,234"
          change="+8% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Growth Rate"
          value="23.5%"
          change="-2% from last month"
          changeType="negative"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesChart />
        </div>
        <div className="lg:col-span-3">
          <RecentActivities />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "pending"
                          ? "secondary"
                          : order.status === "processing"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
