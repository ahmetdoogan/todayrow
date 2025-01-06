import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  collapsed?: boolean;
}

export const Logo = ({ collapsed, className, ...props }: LogoProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (collapsed) {
    return (
      <svg
        className={cn("w-auto h-full", className)}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 28.3 26"
        {...props}
      >
        <defs>
          <style>
            {`.st0 { fill: #cc684e; } .st1 { fill: ${isDark ? '#fef6f1' : '#20203f'}; }`}
          </style>
        </defs>
        <path className="st1" d="M19.5,18c-3.6,3.6-9.7,2.5-11.7-2.1s3.2-11.9,9.1-9.7c4.9,1.8,6.2,8.1,2.6,11.8h0ZM13.8,8.2c-3.7.4-5.5,5-3,7.9,2.5,2.9,7.3,1.8,8.3-1.8s-1.8-6.4-5.3-6.1Z"/>
        <path className="st1" d="M21.9,4.1c1-.2,1.7.6,1.5,1.5s-1.2,1.5-1.6,1.7c-1,.4-2-.5-1.7-1.5s1.3-1.6,1.7-1.7c0,0,.1,0,.1,0Z"/>
        <path className="st1" d="M14.1,1c.7-.1,1.4.2,1.5,1s0,1.6,0,1.9c-.4,1.1-2.1.9-2.3-.3s0-1.5,0-1.8.5-.7.8-.8Z"/>
        <path className="st1" d="M3.3,11.8h1.7c1.4.2,1.4,2.2,0,2.4s-1.6,0-1.9-.1c-1-.5-.8-2.1.2-2.3Z"/>
        <path className="st1" d="M23.7,11.8h1.7c1.3.2,1.2,2.2,0,2.4s-1.3,0-1.6,0c-1.3-.2-1.4-1.9-.3-2.4,0,0,.2,0,.2,0Z"/>
        <path className="st1" d="M14.3,21.4c.6,0,1.2.4,1.3,1s0,1.6,0,1.8c-.4.9-1.8,1-2.2,0s-.2-1.5,0-1.9c0-.5.4-.9,1-.9h-.1Z"/>
        <path className="st1" d="M6.6,4.2c.4,0,.7,0,1,.3l1.1,1.1c.5,1.1-.6,2.2-1.7,1.6s-1.1-1-1.3-1.3c-.3-.7,0-1.6.9-1.7Z"/>
        <path className="st1" d="M7.2,18.8c1.3-.2,2,1,1.2,2s-.7.7-1,.9c-1,.5-2.1-.2-1.9-1.3s1.2-1.5,1.6-1.6h.1Z"/>
        <path className="st1" d="M21.2,19c.7-.1,1.6.6,1.8,1.2.5,1.1-.5,2.1-1.6,1.6s-1-.9-1.1-1.1c-.4-.7,0-1.6.9-1.7h0Z"/>
        <path className="st0" d="M14.1,9.4c.8-.1,2,.3,2.6.9,1.9,1.6,1.6,4.7-.7,5.9-2.3,1.2-2.5.8-2.9-.6v-5.3c.1-.4.5-.8.9-.9,0,0,.1,0,.1,0Z"/>
      </svg>
    );
  }

  return (
    <svg
      className={cn("w-auto h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 180 26"
      fill="none"
      {...props}
    >
      {/* Mevcut tam logo markup'ı buraya gelecek */}
    </svg>
  );
};

export default Logo;