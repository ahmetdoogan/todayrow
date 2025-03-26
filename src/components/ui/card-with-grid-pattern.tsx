import { cn } from '@/lib/utils'
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

interface GridPatternCardProps {
  children: React.ReactNode
  className?: string
  patternClassName?: string
  gradientClassName?: string
  enableHoverEffect?: boolean
}

export function GridPatternCard({ 
  children, 
  className,
  patternClassName,
  gradientClassName,
  enableHoverEffect = false
}: GridPatternCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse move events to track the cursor position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    // Calculate relative mouse position within the card (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "border w-full rounded-md overflow-hidden",
        "bg-white dark:bg-gray-800",
        "border-gray-200 dark:border-gray-700",
        "p-2",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseMove={enableHoverEffect ? handleMouseMove : undefined}
      onMouseEnter={enableHoverEffect ? () => setIsHovering(true) : undefined}
      onMouseLeave={enableHoverEffect ? () => setIsHovering(false) : undefined}
      style={enableHoverEffect ? { position: 'relative' } : {}}
    >
      <div className={cn(
        "size-full bg-repeat bg-[length:30px_30px]",
        "bg-grid-pattern-light dark:bg-grid-pattern bg-[length:20px_20px]",
        patternClassName
      )}>
        <div className={cn(
          "size-full bg-gradient-to-tr",
          "from-white/90 via-white/40 to-white/10 dark:from-gray-800/90 dark:via-gray-800/40 dark:to-gray-800/10",
          gradientClassName
        )}>
          {/* Grid Highlight Effect - Light mode */}
          {enableHoverEffect && isHovering && (
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out dark:hidden"
              style={{
                background: `radial-gradient(circle 120px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 30%, transparent 70%)`,
                opacity: isHovering ? 1 : 0,
                mixBlendMode: 'multiply',
              }}
            />
          )}

          {/* Grid Highlight Effect - Dark mode */}
          {enableHoverEffect && isHovering && (
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out hidden dark:block"
              style={{
                background: `radial-gradient(circle 120px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 70%)`,
                opacity: isHovering ? 1 : 0,
                mixBlendMode: 'soft-light',
              }}
            />
          )}
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export function GridPatternCardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("text-left p-4 md:p-6", className)} 
      {...props} 
    />
  )
}