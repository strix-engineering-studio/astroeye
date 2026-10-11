'use client';

import React from 'react';

import { cn } from '@/lib/utils';

export default function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('w-full space-y-6 p-6', className)}>{children}</div>;
}
