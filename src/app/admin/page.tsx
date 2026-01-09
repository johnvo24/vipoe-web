import { StatCard } from '@/components/admin/stat-card';
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from 'lucide-react';


export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your system.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard />
      </div>
    </div>
  );
}
