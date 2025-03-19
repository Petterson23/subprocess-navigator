
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className,
}) => {
  return (
    <div className={cn(
      "flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 border-b", 
      className
    )}>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 md:mt-0 md:ml-auto animate-fade-in">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
