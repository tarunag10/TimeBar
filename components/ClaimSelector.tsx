'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Banknote,
  Briefcase,
  FileText,
  Gavel,
  Heart,
  HeartOff,
  House,
  Landmark,
  MessageSquare,
  Package,
  PackageX,
  Percent,
  RefreshCcw,
  Scale,
  SearchX,
  Shield,
  ShieldCheck,
  Stamp,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Rule } from '@/types/rules';
import { claimCategories, getRule } from '@/lib/rules';

const claimIcons: Record<Rule['claimType'], LucideIcon> = {
  simple_contract: FileText,
  tort_non_pi: Shield,
  personal_injury: Heart,
  defamation: MessageSquare,
  deed_specialty: Stamp,
  professional_negligence: Briefcase,
  debt_recovery: Banknote,
  contribution: Scale,
  recovery_of_land: Landmark,
  breach_of_trust: Users,
  judgment_enforcement: Gavel,
  mortgage_principal: House,
  mortgage_interest: Percent,
  clinical_negligence: Stethoscope,
  fatal_accident: HeartOff,
  product_liability: Package,
  conversion: PackageX,
  unjust_enrichment: RefreshCcw,
  latent_damage: SearchX,
  hra_claim: ShieldCheck,
};

type Props = {
  onSelect: (claimType: Rule['claimType']) => void;
};

export default function ClaimSelector({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <p className="text-[11px] tracking-[3px] uppercase text-slate-500 font-medium mb-2">
          England &amp; Wales
        </p>
        <h1 className="text-3xl sm:text-4xl display-serif tracking-tight text-gradient">
          Limitation Calculator
        </h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
          Select the legal claim type that best matches your case. The calculator will then guide you
          through plain-English questions and estimate the likely limitation deadline under
          England &amp; Wales law.
        </p>
      </div>

      <div className="space-y-6">
        {claimCategories.map((category, categoryIndex) => (
          <div key={category.label}>
            <p className="text-[11px] tracking-[2px] uppercase text-slate-500 font-medium mb-3">
              {category.label}
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {category.items.map((claim, itemIndex) => {
                const Icon = claimIcons[claim.key];
                const rule = getRule(claim.key);
                const overallIndex = (categoryIndex * 4) + itemIndex;
                return (
                  <motion.button
                    key={claim.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: overallIndex * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{ y: -2, transition: { type: 'spring', stiffness: 420, damping: 24 } }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onSelect(claim.key)}
                    className="w-full group relative text-left glass glass-hover glass-card rounded-2xl p-4
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50
                      cursor-pointer overflow-hidden border-l-2 border-l-transparent hover:border-l-[var(--accent)]
                      active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/15 via-transparent to-[var(--accent-blue)]/12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                    <div className="relative flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-[var(--overlay-white-4)] border border-[var(--accent)]/25 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[var(--accent-icon)] group-hover:text-[var(--accent-icon-hover)] transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                          {claim.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {claim.shortDesc}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {rule.statuteRef.act}, {rule.statuteRef.section}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transform group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
