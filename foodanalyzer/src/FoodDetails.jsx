import { motion } from 'framer-motion';
import {
  Utensils,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Sparkles,
  HeartPulse,
  ArrowLeftRight,
  CircleCheck,
  TriangleAlert,
  Tag,
  Info,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────
const riskStyle = (status) => {
  if (status === 'Risky') return { text: 'text-error', bg: 'bg-error-container', bar: 'bg-error', Icon: ShieldOff };
  if (status === 'Moderate') return { text: 'text-tertiary', bg: 'bg-tertiary-container/60', bar: 'bg-tertiary', Icon: ShieldAlert };
  return { text: 'text-primary', bg: 'bg-primary-container/60', bar: 'bg-primary', Icon: ShieldCheck };
};

const sourceLabel = {
  dataset: { text: 'Verified Dataset', color: 'bg-primary/10 text-primary' },
  api: { text: 'External API', color: 'bg-secondary/10 text-secondary' },
  ai: { text: 'AI Estimated', color: 'bg-tertiary/10 text-tertiary' },
  user: { text: 'User Added', color: 'bg-surface-container text-on-surface-variant' },
};

// ── Main Component ─────────────────────────────────────────────
function FoodDetails({ food }) {
  const src = sourceLabel[food.source] || sourceLabel.user;
  const carbs = food.carbohydrates ?? food.carbs ?? 0;
  const risk = riskStyle(food.status);
  const RiskIcon = risk.Icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col gap-8 text-on-surface"
    >
      {/* ── Header: Name & Badges ─────────────────────────── */}
      <div className="flex flex-col gap-3">
        <h2 className="text-5xl font-heading font-black tracking-tight leading-tight capitalize">
          {food.food || food.name}
        </h2>
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${src.color}`}>
            {src.text}
          </span>
          {food.estimated && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-tertiary/10 text-tertiary">
              Estimated
            </span>
          )}
          {food.quantity > 1 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-surface-container text-on-surface-variant">
              ×{food.quantity} servings
            </span>
          )}
        </div>
      </div>

      {/* ── High-Level Summary: Macros & Risk ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Macros Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MacroCard label="Calories" value={food.calories} sub="kcal" highlight />
          <MacroCard label="Protein"  value={food.protein}  sub="g" />
          <MacroCard label="Carbs"    value={carbs}          sub="g" />
          <MacroCard label="Fat"      value={food.fat}       sub="g" />
        </div>

        {/* Risk Score Card */}
        <div className="bg-surface-container rounded-[2rem] p-6 border border-surface-container-high flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Health Risk Score
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${risk.text} ${risk.bg}`}>
              <RiskIcon size={12} />
              {food.status}
            </span>
          </div>
          <div className="h-4 rounded-full bg-surface-container-high overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${food.riskScore}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className={`h-full rounded-full ${risk.bar}`}
            />
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Safe</span>
            <span className="text-sm font-black text-on-surface">{food.riskScore}/100</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Risky</span>
          </div>
        </div>
      </div>

      {/* ── Detailed Nutrition (The "Right Box" now extended) ── */}
      <div className="w-full flex flex-col gap-6">

        {/* Nutrition Details */}
        <div className="bg-surface-container-low/50 rounded-[3rem] border border-surface-container-high p-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading font-bold flex items-center gap-2">
              <Info size={18} className="text-primary" />
              Detailed Nutrition Facts
            </h3>
            <span className="text-sm text-on-surface-variant font-medium">
              Per {food.quantity > 1 ? `${food.quantity} servings` : 'serving'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <NutritionSection title="Carbohydrates & Fiber">
              <NutritionRow label="Total Fiber" value={`${food.fiber ?? 0}g`} />
              <NutritionRow label="Total Sugar" value={`${food.sugar ?? 0}g`} />
              <NutritionRow label="Net Carbs" value={`${Math.max(0, carbs - (food.fiber ?? 0)).toFixed(1)}g`} />
            </NutritionSection>

            <NutritionSection title="Fats & Lipids">
              <NutritionRow label="Total Fat" value={`${food.fat ?? 0}g`} />
              <NutritionRow label="Saturated Fat" value={food.saturatedFat != null ? `${food.saturatedFat}g` : '—'} />
              <NutritionRow label="Unsaturated Fat" value={food.unsaturatedFat != null ? `${food.unsaturatedFat}g` : '—'} />
            </NutritionSection>

            {/* Tags */}
            {food.tags?.length > 0 && (
              <div className="md:col-span-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80 border-b border-surface-container-high pb-2 mb-3 flex items-center gap-1.5">
                  <Tag size={12} />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {food.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold text-on-surface-variant capitalize">
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Explanation */}
        {food.explanation && (
          <div className="bg-secondary-container/20 border border-secondary/10 rounded-[2rem] p-6 flex gap-4">
            <Sparkles size={20} className="text-secondary mt-0.5 flex-none" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-secondary mb-2">AI Explanation</h4>
              <p className="text-sm text-on-surface leading-relaxed">{food.explanation}</p>
            </div>
          </div>
        )}

        {/* Personal Health Check */}
        {food.personalHealth?.length > 0 && (
          <div className="bg-surface-container rounded-[2rem] border border-surface-container-high p-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <HeartPulse size={16} className="text-primary" />
              Personal Health Check
            </h4>

            {/* Setup prompt */}
            {food.personalHealth[0]?.type === 'setup' ? (
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Info size={16} className="text-outline flex-none" />
                <span>
                  {food.personalHealth[0].message}
                  <a href="/profile" className="ml-1 text-primary font-bold hover:underline">
                    Go to Profile →
                  </a>
                </span>
              </div>
            ) : (
              /* Actual health results */
              <div className="flex flex-col gap-3">
                {food.personalHealth.map((item, i) => {
                  const msg = typeof item === 'string' ? item : item.message;
                  const isRisky = msg?.toLowerCase().includes('risky') || msg?.toLowerCase().includes('not suitable');
                  return (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      {isRisky
                        ? <TriangleAlert size={16} className="text-error mt-0.5 flex-none" />
                        : <CircleCheck size={16} className="text-primary mt-0.5 flex-none" />
                      }
                      <span className="text-on-surface font-medium">{msg}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Smart Alternatives */}
        {/* {food.alternatives?.length > 0 && (
          <div className="bg-primary-container/20 border border-primary/10 rounded-[2rem] p-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <ArrowLeftRight size={16} className="text-primary" />
              Healthier Alternatives
            </h4>
            <div className="flex flex-wrap gap-2">
              {food.alternatives.map((alt, i) => (
                <span key={i} className="px-4 py-2 bg-surface-container border border-surface-container-high rounded-full text-sm font-semibold capitalize">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </motion.div>
  );
}

// ── Sub-components ─────────────────────────────────────────────
const MacroCard = ({ label, value, sub, highlight }) => (
  <div className={`flex flex-col items-start p-5 rounded-[2rem] transition-all hover:translate-y-[-3px] ${highlight
      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
      : 'bg-surface-container text-on-surface border border-surface-container-high'
    }`}>
    <span className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${highlight ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
      {label}
    </span>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-heading font-black">{value ?? '—'}</span>
      <span className="text-sm font-bold opacity-70">{sub}</span>
    </div>
  </div>
);

const NutritionSection = ({ title, children, className = '' }) => (
  <div className={`flex flex-col gap-3 ${className}`}>
    <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80 border-b border-surface-container-high pb-2">
      {title}
    </h4>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

const NutritionRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-0.5">
    <span className="text-sm font-medium text-on-surface-variant capitalize">{label}</span>
    <span className="text-sm font-bold text-on-surface">{value}</span>
  </div>
);

export default FoodDetails;
