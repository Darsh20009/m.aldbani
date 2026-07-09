import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";

/**
 * Wraps children in a lightweight 3D tilt effect that follows the cursor —
 * gives cards a sense of physical depth on hover instead of a flat lift.
 * Pure CSS-perspective transform via framer-motion, no extra dependencies.
 */
export function Tilt3D({
  children,
  className = "",
  maxTilt = 10,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);
  const glareX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 60%)`;

  const [hovering, setHovering] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    x.set(0.5);
    y.set(0.5);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={reset}
      style={{ perspective: 1000 }}
      className={className}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full will-change-transform"
      >
        {children}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBackground, opacity: hovering ? 1 : 0, transition: "opacity 0.3s" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
