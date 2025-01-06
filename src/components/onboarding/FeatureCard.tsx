import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
