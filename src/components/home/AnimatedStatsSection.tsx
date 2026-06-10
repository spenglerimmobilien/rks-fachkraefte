"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Users, Building2, Star, Globe } from "lucide-react";

const stats = [
  { key: "placed", value: 500, suffix: "+", icon: Users },
  { key: "employers", value: 50, suffix: "+", icon: Building2 },
  { key: "satisfaction", value: 98, suffix: "%", icon: Star },
  { key: "countries", value: 2, suffix: "", icon: Globe },
] as const;

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, active, duration]);
  return count;
}

function StatCard({ statKey, value, suffix, icon: Icon, active }: {
  statKey: string; value: number; suffix: string; icon: typeof Users; active: boolean;
}) {
  const t = useTranslations("stats");
  const count = useCountUp(value, active);

  return (
    <div className="text-center p-6 rounded-2xl bg-white border border-border card-hover group">
      <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-red/20 transition-colors">
        <Icon className="h-6 w-6 text-brand-red" />
      </div>
      <div className="text-3xl md:text-4xl font-black text-navy mb-1 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted font-medium">{t(statKey)}</div>
    </div>
  );
}

export function AnimatedStatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-20 bg-sand/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.key} statKey={stat.key} value={stat.value} suffix={stat.suffix} icon={stat.icon} active={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
