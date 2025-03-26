"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  children,
  floatingElements,
}: {
  children: React.ReactNode;
  floatingElements?: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
  });

  // Perspektif ve rotasyon için dönüşümler
  // Başlangıçta eğimli/çaplı, scroll yapıldıkça düz olacak
  const rotateX = useTransform(scrollYProgress, [0, 0.9], [15, 0]);
  const perspective = 800;
  
  // Boyut ve opaklık değişimleri
  const scale = useTransform(scrollYProgress, [0, 0.9, 1], [0.95, 1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0.9]);
  const translateY = useTransform(scrollYProgress, [0, 0.9, 1], [0, 0, 40]);
  
  // Floating badges rotation effects
  const topBadgeRotate = useTransform(scrollYProgress, [0, 0.5], [-5, 0]);
  const bottomBadgeRotate = useTransform(scrollYProgress, [0, 0.5], [5, 0]);

  return (
    <div
      className="relative mb-10"
      ref={containerRef}
    >
      <motion.div
        style={{
          scale,
          opacity,
          y: translateY,
          rotateX, // X ekseni etrafında döndürme
          transformPerspective: perspective, // Perspektif efekti
          transformOrigin: "center bottom", // Dönüşüm merkezi
          transformStyle: "preserve-3d", // 3D efektleri korur
        }}
        className="relative"
      >
        {children}
        
        {floatingElements && floatingElements}
      </motion.div>
      
      {/* Top Floating Badge eklenmiyor, bu landing sayfasında kendi badge'lerimizi kullanacağız */}
      
      {/* Bottom Floating Badge eklenmiyor, bu landing sayfasında kendi badge'lerimizi kullanacağız */}
    </div>
  );
};

export const FloatingBadge = ({
  children,
  delay = 0,
  initialX = 0,
  initialY = 10,
}: {
  children: React.ReactNode;
  delay?: number;
  initialX?: number;
  initialY?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};