"use client";
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div>
      <Header className="fixed top-0 left-0 min-w-[320px]" />
      <div className="main pt-12 w-full mx-auto max-w-[640px] pb-6 flex flex-col items-center px-4">
        <div className="bg-gray-100 rounded-2xl vi-shadow px-8 py-10 mt-20 flex flex-col items-center w-full max-w-md">
          <div className="bg-yellow-100 rounded-full p-3 mb-4">
            <AlertTriangle size={40} className="text-yellow-500" />
          </div>
          <h1 className="vi-text-primary text-2xl font-bold mb-2 text-center">
            Oops! Page Not Found
          </h1>
            <p className="vi-text text-muted-foreground mb-6 text-center">
            Sorry, the page you are looking for does not exist, or may be under development.
            </p>
          <Button asChild variant="default">
            <Link href="/support">Go to Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}