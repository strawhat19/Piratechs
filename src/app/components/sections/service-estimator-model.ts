import type { ReactNode } from 'react';
import {
  buildEffortLevels, buildFeatures, buildPageCounts, buildTypes, creativeOptions,
  marketingOptions, mentoringTopics, serviceCards,
  type CreativeServiceId, type ServiceId, type ServiceOption,
} from './service-estimator-catalog';

export type { ServiceId } from './service-estimator-catalog';
export type BuildStepId = 'build-pages' | 'build-detail' | 'build-content' | 'build-design'
  | 'build-data' | 'build-connect' | 'build-experience' | 'build-customers' | 'build-operations' | 'build-care';
export type EstimatorStage = 'services' | ServiceId | BuildStepId | 'mentoring-session' | 'marketing-tools' | 'payment' | 'review' | 'cart';
export type MaintenanceChoice = 'self' | 'managed' | null;
export type PaymentMethod = 'full' | 'finance';
export type DownPaymentMode = 'lower-monthly' | 'finish-sooner';
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
  build: { label: 'Website // Mobile App', startingPrice: 300, maximum: 10000, types: buildTypes, features: buildFeatures },
};

export const buildPricingMatrix: Record<BuildEffortId, Record<BuildPageCountId, number>> = {
  simple: { one: 300, three: 500, 'five-plus': 1000, 'ten-plus': 1500 },
  business: { one: 500, three: 1000, 'five-plus': 2000, 'ten-plus': 3500 },
  enterprise: { one: 1000, three: 2000, 'five-plus': 3500, 'ten-plus': 5500 },
};

export type ServiceEstimatorDraft = {
  selectedServices: ServiceId[];
  projectName: string;
  // Retained when loading a plan created by the previous estimator.
  names?: Partial<Record<ServiceId, string>>;
  creativeOptions: Record<CreativeServiceId, string[]>;
  mentoringTopics: MentoringTopicId[];
  marketingOptions: MarketingOptionId[];
  buildTypes: BuildTypeId[];
  buildFeatures: BuildFeatureId[];
  buildPageCount: BuildPageCountId | null;
  buildEffort: BuildEffortId | null;
  mentoringPricingMode: 'package' | 'hourly';
  hourlyRate: number;
  mentoringHours: number;
  maintenance: MaintenanceChoice;
  paymentMethod: PaymentMethod;
  monthlyTarget: number;
  downPayment: number;
  downPaymentMode: DownPaymentMode;
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
  pricingVersion: 2 | 3;
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
export const getBuildScopePrice = (pageCount: BuildPageCountId | null, effort: BuildEffortId | null) => (
  buildPricingMatrix[effort ?? 'simple'][pageCount ?? 'one']
);

export function createEmptyServiceEstimatorDraft(): ServiceEstimatorDraft {
  return {
    selectedServices: [], projectName: '',
    creativeOptions: { ai: ['ai-chatbot'], video: ['short-form-video'], art: ['logo'], writing: ['content'] },
    mentoringTopics: ['ai'], marketingOptions: [], buildTypes: ['website-only'], buildFeatures: [],
    buildPageCount: 'one', buildEffort: 'simple', mentoringPricingMode: 'hourly',
    hourlyRate: 20, mentoringHours: 1, maintenance: 'self',
    paymentMethod: 'full', monthlyTarget: 175, downPayment: 0, downPaymentMode: 'finish-sooner',
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
    buildTypes: draft.buildTypes.length ? [...draft.buildTypes] : ['website-only'],
    buildFeatures: [...draft.buildFeatures], buildPageCount: draft.buildPageCount ?? 'one',
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

const pricedItems = (options: readonly ServiceOption[], selected: readonly string[]): ServiceEstimateItem[] => (
  options.filter(option => selected.includes(option.id)).map(option => ({ id: option.id, label: option.label, amount: option.price ?? 0 }))
);

export function calculateServiceEstimate(draft: ServiceEstimatorDraft): ServiceEstimate {
  const groups: ServiceEstimateGroup[] = [];
  const platforms = draft.selectedServices.includes('build') ? getBuildPlatforms(draft.buildTypes) : [];
  const hasVideoGame = draft.selectedServices.includes('video') && draft.creativeOptions.video.includes('game');
  const scopePrice = getBuildScopePrice(draft.buildPageCount, draft.buildEffort);
  const scopeLabel = `${buildEffortLevels.find(option => option.id === draft.buildEffort)?.label ?? 'Simple'} · ${buildPageCounts.find(option => option.id === draft.buildPageCount)?.shortLabel ?? '1 screen'}`;
  for (const service of serviceCards) {
    if (!draft.selectedServices.includes(service.id)) continue;
    let items: ServiceEstimateItem[] = [];
    let maximum = Infinity;
    if (isCreativeService(service.id)) {
      items = pricedItems(creativeOptions[service.id], draft.creativeOptions[service.id]);
      if (service.id === 'video' && hasVideoGame) {
        items = items.map(item => item.id === 'game'
          ? { ...item, label: `Game · ${scopeLabel}`, amount: platforms.includes('game') ? 0 : scopePrice }
          : item);
        if (!draft.selectedServices.includes('build')) items.push(...pricedItems(buildFeatures, draft.buildFeatures));
      }
    } else if (service.id === 'mentoring') {
      maximum = 2000;
      items = draft.mentoringPricingMode === 'hourly'
        ? [{ id: 'hourly-engagement', label: `${draft.mentoringHours} hour${draft.mentoringHours === 1 ? '' : 's'} × ${money(draft.hourlyRate)}/hour`, amount: clamp(1, draft.mentoringHours, 40) * clamp(20, draft.hourlyRate, 50) }]
        : [{ id: 'mentoring-base', label: 'Mentoring engagement', amount: 100 }, ...pricedItems(mentoringTopics, draft.mentoringTopics)];
    } else if (service.id === 'marketing') {
      maximum = 3000;
      items = [{ id: 'marketing-base', label: 'Marketing engagement', amount: 200 }, ...pricedItems(marketingOptions, draft.marketingOptions)];
    } else if (service.id === 'build') {
      maximum = 10000;
      items = [
        ...platforms.map(platform => ({ id: `platform-${platform}`, label: `${platformLabels[platform]} · ${scopeLabel}`, amount: scopePrice })),
        ...pricedItems(buildFeatures, draft.buildFeatures),
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

  const monthlyTarget = clamp(5, Math.round(draft.monthlyTarget / 5) * 5, 350);
  const downPayment = clamp(0, Math.round(draft.downPayment), total);
  const speed = (monthlyTarget - 5) / 345;
  const downRatio = total > 0 ? downPayment / total : 0;
  const interestRate = clamp(3, 18 - (10 * speed) - (5 * downRatio), 18);
  const principal = Math.max(0, total - downPayment);
  const financeFee = Math.round(principal * (interestRate / 100));
  const financedTotal = principal + financeFee;
  const baselineRate = clamp(3, 18 - (10 * speed), 18);
  const baselineTotal = Math.round(total * (1 + baselineRate / 100));
  const baselineMonths = total > 0 ? Math.max(1, Math.ceil(baselineTotal / monthlyTarget)) : 0;

  const months = principal === 0
    ? 0
    : draft.downPaymentMode === 'lower-monthly'
      ? baselineMonths
      : Math.ceil(financedTotal / monthlyTarget);
  const monthlyPayment = principal === 0
    ? 0
    : draft.downPaymentMode === 'lower-monthly'
      ? Math.ceil(financedTotal / Math.max(1, months))
      : monthlyTarget;
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
    customReviewRequired: months > 60,
    completionWeeks: Math.ceil(getBaseCompletionWeeks(draft.selectedServices) * completionFactor),
    cadence,
  };
}
