"use client";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`} />;
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-1/2" />
        <SkeletonText className="w-5/6" />
      </div>
    </div>
  );
}

