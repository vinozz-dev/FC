import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: string;
  className?: string;
}

const roleColors = {
  student: 'bg-purple-500 text-white hover:bg-purple-600',
  entrepreneur: 'bg-yellow-500 text-white hover:bg-yellow-600',
  mentor: 'bg-green-500 text-white hover:bg-green-600',
  investor: 'bg-blue-500 text-white hover:bg-blue-600',
  institution: 'bg-indigo-500 text-white hover:bg-indigo-600',
  wantrepreneur: 'bg-gray-500 text-white hover:bg-gray-600',
};

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  const colorClass = roleColors[role as keyof typeof roleColors] || roleColors.wantrepreneur;
  
  return (
    <Badge className={cn(colorClass, className)}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
};
