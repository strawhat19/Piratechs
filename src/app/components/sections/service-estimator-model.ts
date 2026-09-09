import type { ReactNode } from 'react';
import {
  buildEffortLevels, buildFeatures, buildPageCounts, buildTypes, creativeOptions,
  marketingOptions, mentoringTopics, serviceCards,
  type CreativeServiceId, type ServiceId, type ServiceOption,
} from './service-estimator-catalog';

export type { ServiceId } from './service-estimator-catalog';
export type BuildStepId = 'build-services' | 'build-pages' | 'build-detail' | 'build-content' | 'build-design'
  | 'build-data' | 'build-connect' | 'build-experience' | 'build-customers' | 'build-operations' | 'build-care';
export type EstimatorStage = 'services' | ServiceId | BuildStepId | 'mentoring-session' | 'marketing-tools' | 'payment' | 'review' | 'cart';
export type MaintenanceChoice = 'self' | 'managed' | null;
export type PaymentMethod = 'full' | 'finance';
export type BuildPackageId = 'essential' | 'recommended' | 'complete';
export type MentoringTopicId = typeof mentoringTopics[number]['id'];
export type MarketingOptionId = typeof marketingOptions[number]['id'];
export type BuildTypeId = typeof buildTypes[number]['id'];
export type BuildFeatureId = typeof buildFeatures[number]['id'];
export type BuildPageCountId = typeof buildPageCounts[number]['id'];
export type BuildEffortId = typeof buildEffortLevels[number]['id'];
export type BuildPlatform = 'website' | 'mobile' | 'game';

export const SERVICE_ESTIMATOR_CATALOG = {
  ...Object.fromEntries(serviceCards.map(service => [service.id, service])),
  mentoring: { label: 'Tutoring // Mentoring', basePrice: 100, maximum: 2000, topics: mentoringTopics },
  marketing: { label: 'Marketing // Analytics', basePrice: 200, maximum: 3000, options: marketingOptions },
  build: { label: 'Website // Mobile App', startingPrice: 333, types: buildTypes, features: buildFeatures },
};

export const buildPricingMatrix: Record<BuildEffortId, Record<BuildPageCountId, number>> = {
  simple: { one: 333, three: 600, 'five-plus': 900, 'ten-plus': 1111 },
  business: { one: 900, three: 1200, 'five-plus': 1500, 'ten-plus': 2000 },
  enterprise: { one: 1800, three: 2200, 'five-plus': 2600, 'ten-plus': 3000 },
};

// Package prices at 1 page (Simple), 5+ pages (Business), and 10+ pages (Enterprise).
export const buildPackages = [
  { id: 'essential', label: 'Essentials' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'complete', label: 'Complete' },
] as const;
export const buildPackagePrices: Record<BuildEffortId, Record<BuildPackageId, number>> = {
  simple: { essential: 333, recommended: 777, complete: 1111 },
  business: { essential: 1500, recommended: 2222, complete: 2500 },
  enterprise: { essential: 3000, recommended: 3333, complete: 3500 },
};
const essentialFeatures: BuildFeatureId[] = ['design', 'images', 'fonts', 'contact-form', 'social-media', 'testing', 'security', 'accessibility'];
const businessFeatures: BuildFeatureId[] = [...essentialFeatures, 'blog', 'cms-database', 'search', 'analytics', 'content', 'animations', 'maps', 'reviews'];
const enterpriseFeatures: BuildFeatureId[] = [...businessFeatures, 'dashboard', 'adv-analytics', 'api-server', 'functions', 'auth', 'storage', 'automations', 'advanced-contact-form', 'capture', 'email'];
const packageFeatures: Record<BuildEffortId, Record<BuildPackageId, BuildFeatureId[]>> = {
  simple: {
    essential: essentialFeatures,
    recommended: [...essentialFeatures, 'content', 'logo', 'analytics', 'animations', 'maps'],
    complete: [...essentialFeatures, 'content', 'logo', 'analytics', 'animations', 'maps', 'themes', 'booking-calendar', 'news-letter'],
  },
  business: {
    essential: businessFeatures,
    recommended: [...businessFeatures, 'logo', 'themes', 'email', 'advanced-contact-form', 'booking-calendar', 'news-letter', 'capture', 'automations'],
    complete: [...businessFeatures, 'logo', 'themes', 'email', 'advanced-contact-form', 'booking-calendar', 'news-letter', 'capture', 'automations', 'auth', 'ecommerce', 'customer-order-tracking', 'dashboard'],
  },
  enterprise: {
    essential: [...enterpriseFeatures, 'logo', 'themes', 'booking-calendar', 'news-letter', 'ecommerce', 'customer-order-tracking'],
    recommended: [...enterpriseFeatures, 'logo', 'themes', 'booking-calendar', 'news-letter', 'ecommerce', 'customer-order-tracking', 'ai-chatbot', 'notifications', 'pwa', 'adv-animations'],
    complete: [...enterpriseFeatures, 'logo', 'themes', 'booking-calendar', 'news-letter', 'ecommerce', 'customer-order-tracking', 'ai-chatbot', 'notifications', 'pwa', 'adv-animations', 'international', 'charts', 'grids', 'drag-drop'],
  },
};
export const getIncludedBuildFeatures = (draft: ServiceEstimatorDraft): readonly BuildFeatureId[] => (
  draft.selectedServices.includes('build') || (draft.selectedServices.includes('video') && draft.creativeOptions.video.includes('game'))
    ? packageFeatures[draft.buildEffort ?? 'simple'][draft.buildPackage ?? 'essential'] : []
);
// Only identical deliverables are shared across services; ongoing campaigns remain separate.
export function getIncludedServiceOptions(draft: ServiceEstimatorDraft, service: ServiceId): string[] {
  const included = getIncludedBuildFeatures(draft);
  if (service === 'video' && draft.selectedServices.includes('build') && getSelectedBuildFeatures(draft).includes('game')) return ['game'];
  if (service === 'marketing') {
    const equivalents = { cms: 'cms-database', automations: 'automations', 'customer-feedback': 'capture' } as const;
    return Object.entries(equivalents).filter(([, feature]) => included.includes(feature)).map(([option]) => option);
  }
  return isCreativeService(service) ? creativeOptions[service].filter(option => included.includes(option.id as BuildFeatureId)).map(option => option.id) : [];
}

export type ServiceEstimatorDraft = {
  selectedServices: ServiceId[];
  projectName: string;
  // Retained when loading a plan created by the previous estimator.
  names?: Partial<Record<ServiceId, string>>;
  creativeOptions: Record<CreativeServiceId, string[]>;
  mentoringTopics: MentoringTopicId[];
  marketingOptions: MarketingOptionId[];
  // Legacy platform choices are migrated to optional service add-ons.
  buildTypes: BuildTypeId[];
  buildFeatures: BuildFeatureId[];
  buildPageCount: BuildPageCountId | null;
  buildEffort: BuildEffortId | null;
  buildPackage?: BuildPackageId;
  mentoringPricingMode: 'package' | 'hourly';
  hourlyRate: number;
  mentoringHours: number;
  maintenance: MaintenanceChoice;
  paymentMethod: PaymentMethod;
  monthlyTarget: number;
  downPayment: number;
  financeTermMonths?: number;
  financingControl?: 'term' | 'monthly';
  // Legacy saved plans can still be loaded. New plans use direct inputs.
  downPaymentMode?: 'lower-monthly' | 'finish-sooner';
};

export type ServiceEstimateItem = { id: string; label: string; amount: number };
export type ServiceEstimateGroup = { service: ServiceId; label: string; items: ServiceEstimateItem[]; total: number };
export type ServiceEstimate = {
  groups: ServiceEstimateGroup[];
  platforms: BuildPlatform[];
  total: number;
  maximum: number;
  isFreeConsultation: boolean;
};
export type ServicePaymentProjection = {
  method: PaymentMethod;
  principal: number;
  financeFee: number;
  financedTotal: number;
  interestRate: number;
  monthlyPayment: number;
  months: number;
  customReviewRequired: boolean;
  completionWeeks: number;
  cadence: 'Monthly' | 'Every two weeks' | 'Weekly';
};
export type ServiceCartItem = {
  id: string;
  pricingVersion: 2 | 3 | 4 | 5;
  title: string;
  draft: ServiceEstimatorDraft;
  estimate: ServiceEstimate;
  payment: ServicePaymentProjection;
  createdAt: string;
};
export type ServiceEstimatorSelectionProps = {
  selectedServices: ServiceId[];
  onToggle: (service: ServiceId) => void;
  onStart: () => void;
};
export type HomeServiceEstimatorProps = {
  initialItem?: ServiceCartItem | null;
  onAddToCart?: (item: ServiceCartItem) => void;
  onUpdateCart?: (item: ServiceCartItem) => void;
  renderServiceSelection?: (props: ServiceEstimatorSelectionProps) => ReactNode;
  onStageChange?: (stage: EstimatorStage) => void;
};

export const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const money = (amount: number) => currencyFormatter.format(amount);
export const clamp = (minimum: number, value: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));
export const toggleValue = <Value extends string>(values: readonly Value[], value: Value): Value[] => (
  values.includes(value) ? values.filter(current => current !== value) : [...values, value]
);
export const platformLabels: Record<BuildPlatform, string> = { website: 'Website', mobile: 'Mobile App', game: 'Game' };
export const isCreativeService = (service: string): service is CreativeServiceId => Object.hasOwn(creativeOptions, service);
export const getBuildScopePrice = (pageCount: BuildPageCountId | null, effort: BuildEffortId | null, packageId: BuildPackageId = 'essential') => {
  const tier = effort ?? 'simple';
  const base = buildPricingMatrix[tier][pageCount ?? 'one'];
  return base + buildPackagePrices[tier][packageId] - buildPackagePrices[tier].essential;
};

export function createEmptyServiceEstimatorDraft(): ServiceEstimatorDraft {
  return {
    selectedServices: [], projectName: '',
    creativeOptions: { ai: ['ai-chatbot'], video: ['short-form-video'], art: ['logo'], writing: ['content'] },
    mentoringTopics: ['ai'], marketingOptions: [], buildTypes: ['website-only'], buildFeatures: [],
    buildPageCount: 'one', buildEffort: 'simple', buildPackage: 'essential', mentoringPricingMode: 'hourly',
    hourlyRate: 20, mentoringHours: 1, maintenance: 'self',
    paymentMethod: 'full', monthlyTarget: 175, downPayment: 0, financeTermMonths: 24, financingControl: 'term',
  };
}

export function cloneDraft(draft: ServiceEstimatorDraft): ServiceEstimatorDraft {
  const defaults = createEmptyServiceEstimatorDraft();
  return {
    ...defaults, ...draft,
    selectedServices: [...draft.selectedServices],
    projectName: draft.projectName ?? Object.values(draft.names ?? {}).filter(Boolean).join(' + ').slice(0, 80),
    creativeOptions: Object.fromEntries(Object.entries(defaults.creativeOptions).map(([service, values]) => [
      service, [...(draft.creativeOptions?.[service as CreativeServiceId] ?? values)],
    ])) as ServiceEstimatorDraft['creativeOptions'],
    mentoringTopics: [...draft.mentoringTopics], marketingOptions: [...draft.marketingOptions],
    buildTypes: ['website-only'],
    buildFeatures: getSelectedBuildFeatures(draft), buildPageCount: draft.buildPageCount ?? 'one',
    buildEffort: draft.buildEffort ?? 'simple', maintenance: draft.maintenance ?? 'self',
  };
}

export function getBuildPlatforms(selectedTypes: readonly BuildTypeId[]): BuildPlatform[] {
  const selected = new Set<BuildPlatform>();
  buildTypes.forEach(type => {
    if (selectedTypes.includes(type.id)) type.platforms.forEach(platform => selected.add(platform));
  });
  return (['website', 'mobile', 'game'] as const).filter(platform => selected.has(platform));
}

export function getSelectedBuildFeatures(draft: ServiceEstimatorDraft): BuildFeatureId[] {
  const selected = new Set(draft.buildFeatures);
  const legacy = getBuildPlatforms(draft.buildTypes);
  if (legacy.includes('mobile')) selected.add('mobile-app');
  if (legacy.includes('game')) selected.add('game');
  return [...selected];
}

const pricedItems = (options: readonly ServiceOption[], selected: readonly string[]): ServiceEstimateItem[] => (
  options.filter(option => selected.includes(option.id)).map(option => ({ id: option.id, label: option.label, amount: option.price ?? 0 }))
);

export function calculateServiceEstimate(draft: ServiceEstimatorDraft): ServiceEstimate {
  const groups: ServiceEstimateGroup[] = [];
  const hasBuild = draft.selectedServices.includes('build');
  const selectedFeatures = getSelectedBuildFeatures(draft);
  const platforms: BuildPlatform[] = hasBuild ? ['website'] : [];
  if (hasBuild && selectedFeatures.includes('mobile-app')) platforms.push('mobile');
  if (hasBuild && selectedFeatures.includes('game')) platforms.push('game');
  const hasVideoGame = draft.selectedServices.includes('video') && draft.creativeOptions.video.includes('game');
  const scopePrice = getBuildScopePrice(draft.buildPageCount, draft.buildEffort, draft.buildPackage);
  const included = getIncludedBuildFeatures(draft);
  const featureItems = buildFeatures.filter(feature => (hasBuild || !['mobile-app', 'game'].includes(feature.id)) && (included.includes(feature.id) || selectedFeatures.includes(feature.id))).map(feature => ({ id: feature.id, label: feature.label, amount: included.includes(feature.id) ? 0 : feature.price }));
  const scopeLabel = `${buildEffortLevels.find(option => option.id === draft.buildEffort)?.label ?? 'Simple'} · ${buildPageCounts.find(option => option.id === draft.buildPageCount)?.shortLabel ?? '1 screen'} · ${buildPackages.find(option => option.id === (draft.buildPackage ?? 'essential'))?.label}`;
  for (const service of serviceCards) {
    if (!draft.selectedServices.includes(service.id)) continue;
    let items: ServiceEstimateItem[] = [];
    let maximum = Infinity;
    if (isCreativeService(service.id)) {
      const covered = getIncludedServiceOptions(draft, service.id);
      items = pricedItems(creativeOptions[service.id], [...new Set([...draft.creativeOptions[service.id], ...covered])]).map(item => covered.includes(item.id) ? { ...item, amount: 0 } : item);
      if (service.id === 'video' && hasVideoGame) {
        items = items.map(item => item.id === 'game'
          ? { ...item, label: hasBuild ? 'Website Game' : `Game · ${scopeLabel}`, amount: platforms.includes('game') ? 0 : hasBuild ? buildFeatures.find(feature => feature.id === 'game')!.price : scopePrice }
          : item);
        if (!draft.selectedServices.includes('build')) items.push(...featureItems);
      }
    } else if (service.id === 'mentoring') {
      maximum = 2000;
      items = draft.mentoringPricingMode === 'hourly'
        ? [{ id: 'hourly-engagement', label: `${draft.mentoringHours} hour${draft.mentoringHours === 1 ? '' : 's'} × ${money(draft.hourlyRate)}/hour`, amount: clamp(1, draft.mentoringHours, 40) * clamp(20, draft.hourlyRate, 50) }]
        : [{ id: 'mentoring-base', label: 'Mentoring engagement', amount: 100 }, ...pricedItems(mentoringTopics, draft.mentoringTopics)];
    } else if (service.id === 'marketing') {
      maximum = 3000;
      const covered = getIncludedServiceOptions(draft, service.id);
      items = [{ id: 'marketing-base', label: 'Marketing engagement', amount: 200 }, ...pricedItems(marketingOptions, [...new Set([...draft.marketingOptions, ...covered])]).map(item => covered.includes(item.id) ? { ...item, amount: 0 } : item)];
    } else if (service.id === 'build') {
      items = [
        { id: 'website-package', label: `Website · ${scopeLabel}`, amount: scopePrice },
        ...featureItems,
      ];
    }
    groups.push({ service: service.id, label: service.label, items, total: Math.min(maximum, items.reduce((sum, item) => sum + item.amount, 0)) });
  }
  return {
    groups, platforms: hasVideoGame && !platforms.includes('game') ? [...platforms, 'game'] : platforms,
    total: groups.reduce((sum, group) => sum + group.total, 0), maximum: 30000,
    isFreeConsultation: draft.selectedServices.length === 0,
  };
}

const getBaseCompletionWeeks = (services: readonly ServiceId[]) => Math.max(0, ...services.map(service => (
  service === 'build' || service === 'video' || service === 'ai' ? 6 : service === 'marketing' ? 5 : 4
)));

export function calculatePaymentProjection(
  draft: ServiceEstimatorDraft,
  estimate: ServiceEstimate = calculateServiceEstimate(draft),
): ServicePaymentProjection {
  const total = estimate.total;
  if (draft.paymentMethod === 'full' || total === 0) {
    return {
      method: 'full',
      principal: total,
      financeFee: 0,
      financedTotal: total,
      interestRate: 0,
      monthlyPayment: 0,
      months: 0,
      customReviewRequired: false,
      completionWeeks: total === 0 ? 0 : Math.ceil(getBaseCompletionWeeks(draft.selectedServices) * 0.7),
      cadence: 'Weekly',
    };
  }

  const downPayment = clamp(0, Math.round(draft.downPayment), total);
  const downRatio = total > 0 ? downPayment / total : 0;
  const principal = Math.max(0, total - downPayment);
  const schedule = (months: number) => {
    const interestRate = clamp(3, 3 + 15 * (months - 1) / 119 - 5 * downRatio, 18);
    const financeFee = Math.round(principal * interestRate / 100);
    const financedTotal = principal + financeFee;
    return { interestRate, financeFee, financedTotal, monthlyPayment: Math.ceil(financedTotal * 100 / months) / 100 };
  };
  let months = clamp(1, Math.round(draft.financeTermMonths ?? 24), 120);
  if (draft.financingControl === 'monthly') {
    months = 120;
    for (let term = 1; term <= 120; term++) {
      if (schedule(term).monthlyPayment <= Math.max(1, draft.monthlyTarget)) { months = term; break; }
    }
  }
  const { interestRate, financeFee, financedTotal, monthlyPayment } = schedule(months);
  if (principal === 0) months = 0;
  const speed = 1 - Math.max(0, months - 1) / 119;
  const paceScore = clamp(0, speed + (downRatio * 0.25), 1);
  const cadence = paceScore < 0.34 ? 'Monthly' : paceScore < 0.67 ? 'Every two weeks' : 'Weekly';
  const completionFactor = clamp(0.7, 1.6 - (0.6 * speed) - (0.3 * downRatio), 1.6);

  return {
    method: 'finance',
    principal,
    financeFee,
    financedTotal,
    interestRate,
    monthlyPayment,
    months,
    customReviewRequired: false,
    completionWeeks: Math.ceil(getBaseCompletionWeeks(draft.selectedServices) * completionFactor),
    cadence,
  };
}
