import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="font-display text-lg text-foreground mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
