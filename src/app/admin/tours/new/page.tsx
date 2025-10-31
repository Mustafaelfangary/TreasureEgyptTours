"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TourForm = dynamic(() => import("@/components/forms/TourForm"), { ssr: false });

export default function AdminNewTourPage() {
  const router = useRouter();

  const createMut = useMutation({
    mutationFn: async (values: any) => {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create tour");
      return res.json();
    },
    onSuccess: () => {
      router.push("/admin/tours");
    },
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Tour</h1>
        <Button variant="outline" onClick={() => router.push("/admin/tours")}>Cancel</Button>
      </div>
      <Card className="p-4">
        <TourForm
          onSubmit={(values: any) => createMut.mutate(values)}
          isSubmitting={createMut.isLoading}
        />
        {createMut.isLoading && (
          <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin"/> Creating tour...
          </div>
        )}
      </Card>
    </div>
  );
}
