'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getSummary } from '@/lib/api/admin';
import { useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectToken } from '@/lib/store/auth/authSlice'

export function StatCard() {
  const [stats, getStats] = useState<object[]>([])
  const token = useAppSelector(selectToken)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getSummary(token!)
      getStats(res)
      console.log(res)
    }
    fetchStats()
  }, [token])

  return (
    <>
      {stats.length > 0 && stats.map((stat: any) => {
        <Card className="transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">123</p>
                <h3 className="text-3xl font-bold mt-2">123</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                {/* <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" /> */}
              </div>
            </div>
          </CardContent>
        </Card>
      })}
    </>
  );
}
