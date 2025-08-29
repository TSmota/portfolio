import { useTranslations } from "next-intl";

interface StatusBadgeProps {
  status: 'completed' | 'inProgress' | 'planned';
  className?: string;
}

const getStatusIcon = (status: StatusBadgeProps['status']) => {
  switch (status) {
    case 'completed':
      return '✅';
    case 'inProgress':
      return '🚧';
    case 'planned':
      return '📋';
    default:
      return '❓';
  }
};

const statusStyles = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  inProgress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', 
  planned: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const t = useTranslations("common");
  
  const statusText = `${getStatusIcon(status)} ${t(`status.${status}`)}`;
  
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]} ${className}`}>
      {statusText}
    </span>
  );
}
