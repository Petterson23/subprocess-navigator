
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  icon?: React.ReactNode;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  icon,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed bg-muted/30 animate-fade-in">
      <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="mb-6 text-muted-foreground max-w-md">{description}</p>
      <Button onClick={onAction} className="hover-scale">
        <Plus className="mr-2 h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;
