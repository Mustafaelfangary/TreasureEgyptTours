"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ViewDetailsButtonProps {
  href: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function ViewDetailsButton({
  href,
  className = '',
  variant = 'default',
  size = 'default',
  children = 'View Details',
  icon = <ArrowRight className="ml-2 h-4 w-4" />,
  onClick,
  ...props
}: ViewDetailsButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={`group transition-all duration-200 ${className}`}
      onClick={handleClick}
      {...props}
    >
      <Link href={href}>
        {children}
        {icon}
      </Link>
    </Button>
  );
}
