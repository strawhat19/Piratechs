'use client';

import {
  useEffect,
  useId,
  useReducer,
  useRef,
  type FormEvent,
} from 'react';

export type ServiceId = 'mentoring' | 'marketing' | 'build';
export type EstimatorStage = 'services' | 'scope' | 'budget' | 'payment' | 'review';
export type MaintenanceChoice = 'self' | 'managed' | null;
export type PaymentMethod = 'full' | 'finance';
export type DownPaymentMode = 'lower-monthly' | 'finish-sooner';

type PricedOption = {
  id: string;
  label: string;
  price: number;
};

const mentoringTopics = [
  { id: 'ai', label: 'AI', price: 200 },
  { id: 'design', label: 'Design', price: 175 },
  { id: 'business', label: 'Business', price: 175 },
  { id: 'development', label: 'Development', price: 225 },
  { id: 'career-advice', label: 'Career Advice', price: 125 },
  { id: 'resume-review', label: 'Resume Review', price: 100 },
  { id: 'gamify-learning', label: 'Gamify Learning', price: 175 },
  { id: 'project-management', label: 'Project Management', price: 150 },
  { id: 'computers-technology', label: 'Computers + Technology', price: 200 },
  { id: 'technical-writing-reading', label: 'Technical Writing + Reading', price: 75 },
] as const satisfies readonly PricedOption[];

const marketingOptions = [
  { id: 'seo', label: 'SEO', price: 250 },
  { id: 'cms', label: 'CMS', price: 250 },
  { id: 'automations', label: 'Automations', price: 300 },
  { id: 'advertising', label: 'Advertising', price: 250 },
  { id: 'social-media', label: 'Social Media', price: 200 },
  { id: 'ai-drone-analysis', label: 'AI // Drone Analysis', price: 350 },
  { id: 'customer-feedback', label: 'Capture Customer Feedback', price: 150 },
  { id: 'photography-videography', label: 'Photography // Videography', price: 250 },
  { id: 'graphic-design-custom-art', label: 'Graphic Design // Custom Art', price: 200 },
  { id: 'writing-copy-articles-blogs', label: 'Writing Copy, Articles, Blogs', price: 100 },
  { id: 'short-form-video', label: 'Tik Toks // Youtube Shorts // Instagram Reels', price: 100 },
] as const satisfies readonly PricedOption[];

const buildTypes = [
  { id: 'game-only', label: 'Game Only', platforms: ['game'] },
  { id: 'website-only', label: 'Website Only', platforms: ['website'] },
  { id: 'website-game', label: 'Website + Game', platforms: ['website', 'game'] },
  { id: 'mobile-only', label: 'Mobile Application Only', platforms: ['mobile'] },
  { id: 'mobile-game', label: 'Mobile Application + Game', platforms: ['mobile', 'game'] },
  { id: 'website-mobile', label: 'Website + Mobile Application', platforms: ['website', 'mobile'] },
  { id: 'website-mobile-game', label: 'Website + Mobile Application + Game', platforms: ['website', 'mobile', 'game'] },
] as const;

const buildFeatures = [
  { id: 'analytics', label: 'Analytics', price: 150 },
  { id: 'animations', label: 'Animations', price: 250 },
  { id: 'multiplayer', label: 'Multiplayer', price: 400 },
  { id: 'contact-form', label: 'Contact Form', price: 100 },
  { id: 'api-server', label: 'API // Server', price: 300 },
  { id: 'booking-calendar', label: 'Booking Calendar', price: 200 },
  { id: 'auth', label: 'Sign In + Sign Up', price: 250 },
  { id: 'customer-order-tracking', label: 'Customer // Order Tracking', price: 250 },
  { id: 'cms-database', label: 'CMS // Database Management', price: 350 },
  { id: 'ecommerce', label: 'ECommerce + Products + Cart', price: 500 },
  { id: 'notifications', label: 'Push Notifications or Message Notifications', price: 250 },
] as const satisfies readonly PricedOption[];

export const SERVICE_ESTIMATOR_CATALOG = {
  mentoring: {
    label: 'Mentoring // Tutoring',
    prompt: 'What is the name of the Student?',
    basePrice: 400,
    maximum: 2000,
    topics: mentoringTopics,
  },
  marketing: {
    label: 'Marketing // Analytics',
    prompt: 'What is the name of the Service?',
    basePrice: 600,
    maximum: 3000,
    options: marketingOptions,
  },
  build: {
    label: 'Website // Mobile Application or Game Development',
    prompt: 'What is the name of the Project?',
    basePrice: 2000,
    maximum: 10000,
    types: buildTypes,
    features: buildFeatures,
  },
} as const;

export type MentoringTopicId = typeof mentoringTopics[number]['id'];
export type MarketingOptionId = typeof marketingOptions[number]['id'];
export type BuildTypeId = typeof buildTypes[number]['id'];
export type BuildFeatureId = typeof buildFeatures[number]['id'];
export type BuildPlatform = 'website' | 'mobile' | 'game';

export type ServiceEstimatorDraft = {
  selectedServices: ServiceId[];
  names: Record<ServiceId, string>;
  mentoringTopics: MentoringTopicId[];
  marketingOptions: MarketingOptionId[];
  buildTypes: BuildTypeId[];
  buildFeatures: BuildFeatureId[];
  mentoringPricingMode: 'package' | 'hourly';
  hourlyRate: number;
  mentoringHours: number;
  maintenance: MaintenanceChoice;
  budget: number;
  budgetTouched: boolean;
  paymentMethod: PaymentMethod;
  monthlyTarget: number;
  downPayment: number;
  downPaymentMode: DownPaymentMode;
};

export type ServiceEstimateItem = {
  id: string;
  label: string;
  amount: number;
};

export type ServiceEstimateGroup = {
  service: ServiceId;
  label: string;
  items: ServiceEstimateItem[];
  total: number;
};

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
  pricingVersion: 1;
  title: string;
  draft: ServiceEstimatorDraft;
  estimate: ServiceEstimate;
  payment: ServicePaymentProjection;
  createdAt: string;
};

export type HomeServiceEstimatorProps = {
  initialItem?: ServiceCartItem | null;
  onAddToCart?: (item: ServiceCartItem) => void;
  onUpdateCart?: (item: ServiceCartItem) => void;
};

const stages: readonly { id: EstimatorStage; label: string }[] = [
  { id: 'services', label: 'Services' },
  { id: 'scope', label: 'Scope' },
  { id: 'budget', label: 'Budget' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

const serviceCards: readonly {
  id: ServiceId;
  label: string;
  description: string;
  price: string;
  icon: string;
}[] = [
  {
    id: 'mentoring',
    label: SERVICE_ESTIMATOR_CATALOG.mentoring.label,
    description: 'Focused guidance for a student, professional, or project team.',
    price: 'Up to $2,000',
    icon: 'fa-solid fa-compass',
  },
  {
    id: 'marketing',
    label: SERVICE_ESTIMATOR_CATALOG.marketing.label,
    description: 'A measurable campaign, content, or growth systems engagement.',
    price: 'Up to $3,000',
    icon: 'fa-solid fa-satellite-dish',
  },
  {
    id: 'build',
    label: SERVICE_ESTIMATOR_CATALOG.build.label,
    description: 'A web, mobile, or game product built as one connected system.',
    price: 'Up to $10,000',
    icon: 'fa-solid fa-ship',
  },
];

const platformPrices: Record<BuildPlatform, number> = {
  website: 1200,
  mobile: 2000,
  game: 1800,
};

const platformLabels: Record<BuildPlatform, string> = {
  website: 'Website',
  mobile: 'Mobile Application',
  game: 'Game',
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

const clamp = (minimum: number, value: number, maximum: number) => (
  Math.min(maximum, Math.max(minimum, value))
);

const toggleValue = <Value extends string>(values: readonly Value[], value: Value): Value[] => (
  values.includes(value) ? values.filter(current => current !== value) : [...values, value]
);

const hasValidName = (value: string) => {
  const length = value.trim().length;
  return length >= 2 && length <= 80;
};

export function createEmptyServiceEstimatorDraft(): ServiceEstimatorDraft {
  return {
    selectedServices: [],
    names: { mentoring: '', marketing: '', build: '' },
    mentoringTopics: [],
    marketingOptions: [],
    buildTypes: [],
    buildFeatures: [],
    mentoringPricingMode: 'package',
    hourlyRate: 35,
    mentoringHours: 10,
    maintenance: null,
    budget: 0,
    budgetTouched: false,
    paymentMethod: 'full',
    monthlyTarget: 175,
    downPayment: 0,
    downPaymentMode: 'finish-sooner',
  };
}

const cloneDraft = (draft: ServiceEstimatorDraft): ServiceEstimatorDraft => ({
  ...draft,
  selectedServices: [...draft.selectedServices],
  names: { ...draft.names },
  mentoringTopics: [...draft.mentoringTopics],
  marketingOptions: [...draft.marketingOptions],
  buildTypes: [...draft.buildTypes],
  buildFeatures: [...draft.buildFeatures],
});

const selectedPricedOptions = (
  options: readonly PricedOption[],
  selectedIds: readonly string[],
): ServiceEstimateItem[] => options
  .filter(option => selectedIds.includes(option.id))
  .map(option => ({ id: option.id, label: option.label, amount: option.price }));

export function getBuildPlatforms(selectedTypes: readonly BuildTypeId[]): BuildPlatform[] {
  const selected = new Set<BuildPlatform>();
  buildTypes.forEach(type => {
    if (!selectedTypes.includes(type.id)) return;
    type.platforms.forEach(platform => selected.add(platform));
  });
  return (['website', 'mobile', 'game'] as const).filter(platform => selected.has(platform));
}

export function calculateServiceEstimate(draft: ServiceEstimatorDraft): ServiceEstimate {
  const selectedServices = new Set(draft.selectedServices);
  const groups: ServiceEstimateGroup[] = [];
  const platforms = selectedServices.has('build') ? getBuildPlatforms(draft.buildTypes) : [];

  if (selectedServices.has('mentoring')) {
    const hourly = draft.selectedServices.length === 1 && draft.mentoringPricingMode === 'hourly';
    const items = hourly
      ? [{
        id: 'hourly-engagement',
        label: clamp(1, Math.round(draft.mentoringHours), 40) + ' hours × ' +
          currencyFormatter.format(clamp(20, Math.round(draft.hourlyRate), 50)) + '/hour',
        amount: clamp(1, Math.round(draft.mentoringHours), 40) *
          clamp(20, Math.round(draft.hourlyRate), 50),
      }]
      : [
        { id: 'mentoring-base', label: 'Mentoring engagement base', amount: 400 },
        ...selectedPricedOptions(mentoringTopics, draft.mentoringTopics),
      ];
    groups.push({
      service: 'mentoring',
      label: SERVICE_ESTIMATOR_CATALOG.mentoring.label,
      items,
      total: Math.min(2000, items.reduce((sum, item) => sum + item.amount, 0)),
    });
  }

  if (selectedServices.has('marketing')) {
    const items = [
      { id: 'marketing-base', label: 'Marketing engagement base', amount: 600 },
      ...selectedPricedOptions(marketingOptions, draft.marketingOptions),
    ];
    groups.push({
      service: 'marketing',
      label: SERVICE_ESTIMATOR_CATALOG.marketing.label,
      items,
      total: Math.min(3000, items.reduce((sum, item) => sum + item.amount, 0)),
    });
  }

  if (selectedServices.has('build')) {
    const items: ServiceEstimateItem[] = [
      { id: 'build-base', label: 'Product build foundation', amount: 2000 },
      ...platforms.map(platform => ({
        id: 'platform-' + platform,
        label: platformLabels[platform],
        amount: platformPrices[platform],
      })),
      ...selectedPricedOptions(buildFeatures, draft.buildFeatures),
    ];
    groups.push({
      service: 'build',
      label: SERVICE_ESTIMATOR_CATALOG.build.label,
      items,
      total: Math.min(10000, items.reduce((sum, item) => sum + item.amount, 0)),
    });
  }

  const total = Math.min(15000, groups.reduce((sum, group) => sum + group.total, 0));
  return {
    groups,
    platforms,
    total,
    maximum: 15000,
    isFreeConsultation: selectedServices.size === 0,
  };
}

const getBaseCompletionWeeks = (services: readonly ServiceId[]) => Math.max(
  services.includes('mentoring') ? 4 : 0,
  services.includes('marketing') ? 8 : 0,
  services.includes('build') ? 24 : 0,
);

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

const getReviewTitles = (draft: ServiceEstimatorDraft, estimate: ServiceEstimate): string[] => {
  const titles: string[] = [];
  if (draft.selectedServices.includes('mentoring')) {
    titles.push('Mentoring for ' + (draft.names.mentoring.trim() || 'your student'));
  }
  if (draft.selectedServices.includes('marketing')) {
    titles.push('Marketing for ' + (draft.names.marketing.trim() || 'your service'));
  }
  if (draft.selectedServices.includes('build')) {
    const platformTitle = estimate.platforms.length
      ? estimate.platforms.map(platform => platformLabels[platform]).join(' + ')
      : 'Digital product';
    titles.push(platformTitle + ' for ' + (draft.names.build.trim() || 'your project'));
  }
  return titles.length ? titles : ['Free consultation'];
};

const getPricingKey = (draft: ServiceEstimatorDraft, estimate: ServiceEstimate, budget: number) => JSON.stringify([
  estimate.total,
  draft.selectedServices,
  draft.names,
  draft.mentoringTopics,
  draft.marketingOptions,
  draft.buildTypes,
  draft.buildFeatures,
  draft.mentoringPricingMode,
  draft.hourlyRate,
  draft.mentoringHours,
  draft.maintenance,
  budget,
]);

const getScopeIssue = (draft: ServiceEstimatorDraft): string => {
  if (draft.selectedServices.includes('mentoring')) {
    if (!hasValidName(draft.names.mentoring)) return 'Enter the student name to reveal mentoring topics.';
    if (!draft.mentoringTopics.length) return 'Choose at least one mentoring topic.';
  }
  if (draft.selectedServices.includes('marketing')) {
    if (!hasValidName(draft.names.marketing)) return 'Enter the service name to reveal marketing options.';
    if (!draft.marketingOptions.length) return 'Choose at least one marketing option.';
  }
  if (draft.selectedServices.includes('build')) {
    if (!hasValidName(draft.names.build)) return 'Enter the project name to reveal build options.';
    if (!draft.buildTypes.length) return 'Choose at least one website, mobile application, or game option.';
    if (!draft.maintenance) return 'Choose how you want website updates and maintenance handled.';
  }
  return '';
};

type EstimatorState = {
  stage: EstimatorStage;
  draft: ServiceEstimatorDraft;
  acceptedPricingKey: string | null;
  editingId: string | null;
  cart: ServiceCartItem[];
  status: string;
};

type ListField = 'mentoringTopics' | 'marketingOptions' | 'buildTypes' | 'buildFeatures';

type EstimatorAction =
  | { type: 'go'; stage: EstimatorStage }
  | { type: 'toggle-service'; service: ServiceId }
  | { type: 'set-name'; service: ServiceId; value: string }
  | { type: 'toggle-list'; field: ListField; value: string }
  | { type: 'set-mentoring-mode'; value: 'package' | 'hourly' }
  | { type: 'set-hourly-rate'; value: number }
  | { type: 'set-hours'; value: number }
  | { type: 'set-maintenance'; value: Exclude<MaintenanceChoice, null> }
  | { type: 'set-budget'; value: number }
  | { type: 'accept-price'; pricingKey: string }
  | { type: 'set-payment-method'; value: PaymentMethod }
  | { type: 'set-monthly'; value: number }
  | { type: 'set-down-payment'; value: number }
  | { type: 'set-down-mode'; value: DownPaymentMode }
  | { type: 'commit-item'; item: ServiceCartItem }
  | { type: 'edit-item'; item: ServiceCartItem }
  | { type: 'reset' }
  | { type: 'invalid-review' };

const invalidatePricing = (
  state: EstimatorState,
  nextDraft: ServiceEstimatorDraft,
  status = '',
): EstimatorState => {
  const nextEstimate = calculateServiceEstimate(nextDraft);
  return {
    ...state,
    draft: {
      ...nextDraft,
      paymentMethod: nextEstimate.total === 0 ? 'full' : nextDraft.paymentMethod,
      downPayment: Math.min(nextDraft.downPayment, nextEstimate.total),
    },
    acceptedPricingKey: null,
    status,
  };
};

const reducer = (state: EstimatorState, action: EstimatorAction): EstimatorState => {
  switch (action.type) {
    case 'go':
      return { ...state, stage: action.stage, status: '' };
    case 'toggle-service': {
      const selectedServices = toggleValue(state.draft.selectedServices, action.service);
      const normalizedFromHourly = selectedServices.length > 1 &&
        state.draft.mentoringPricingMode === 'hourly';
      return invalidatePricing(state, {
        ...state.draft,
        selectedServices,
        mentoringPricingMode: normalizedFromHourly ? 'package' : state.draft.mentoringPricingMode,
      }, normalizedFromHourly ? 'Mentoring changed to package pricing because another service was added.' : '');
    }
    case 'set-name':
      return invalidatePricing(state, {
        ...state.draft,
        names: { ...state.draft.names, [action.service]: action.value.slice(0, 80) },
      });
    case 'toggle-list': {
      const current = state.draft[action.field] as readonly string[];
      return invalidatePricing(state, {
        ...state.draft,
        [action.field]: toggleValue(current, action.value),
      } as ServiceEstimatorDraft);
    }
    case 'set-mentoring-mode':
      return invalidatePricing(state, { ...state.draft, mentoringPricingMode: action.value });
    case 'set-hourly-rate':
      return invalidatePricing(state, {
        ...state.draft,
        hourlyRate: clamp(20, Math.round(action.value / 5) * 5, 50),
      });
    case 'set-hours':
      return invalidatePricing(state, {
        ...state.draft,
        mentoringHours: clamp(1, Math.round(action.value), 40),
      });
    case 'set-maintenance':
      return invalidatePricing(state, { ...state.draft, maintenance: action.value });
    case 'set-budget':
      return {
        ...state,
        draft: {
          ...state.draft,
          budget: clamp(0, Math.round(action.value / 250) * 250, 15000),
          budgetTouched: true,
        },
        acceptedPricingKey: null,
        status: '',
      };
    case 'accept-price':
      return {
        ...state,
        stage: 'payment',
        acceptedPricingKey: action.pricingKey,
        status: 'Planning estimate accepted. Choose a payment route.',
      };
    case 'set-payment-method':
      return { ...state, draft: { ...state.draft, paymentMethod: action.value }, status: '' };
    case 'set-monthly':
      return {
        ...state,
        draft: {
          ...state.draft,
          monthlyTarget: clamp(5, Math.round(action.value / 5) * 5, 350),
        },
        status: '',
      };
    case 'set-down-payment':
      return {
        ...state,
        draft: {
          ...state.draft,
          downPayment: clamp(0, Math.round(action.value), calculateServiceEstimate(state.draft).total),
        },
        status: '',
      };
    case 'set-down-mode':
      return { ...state, draft: { ...state.draft, downPaymentMode: action.value }, status: '' };
    case 'commit-item': {
      const exists = state.cart.some(item => item.id === action.item.id);
      const cart = exists
        ? state.cart.map(item => item.id === action.item.id ? action.item : item)
        : [...state.cart, action.item];
      return {
        stage: 'services',
        draft: createEmptyServiceEstimatorDraft(),
        acceptedPricingKey: null,
        editingId: null,
        cart,
        status: exists ? 'Cart item updated. The calculator is ready for another plan.' :
          'Plan added to cart. The calculator is ready for another plan.',
      };
    }
    case 'edit-item':
      return {
        ...state,
        stage: 'services',
        draft: cloneDraft(action.item.draft),
        acceptedPricingKey: null,
        editingId: action.item.id,
        status: 'Editing ' + action.item.title + '.',
      };
    case 'reset':
      return {
        ...state,
        stage: 'services',
        draft: createEmptyServiceEstimatorDraft(),
        acceptedPricingKey: null,
        editingId: null,
        status: 'Calculator cleared.',
      };
    case 'invalid-review':
      return {
        ...state,
        stage: 'budget',
        acceptedPricingKey: null,
        status: 'The scope changed. Please accept the updated estimate before continuing.',
      };
    default:
      return state;
  }
};

const createInitialState = (initialItem?: ServiceCartItem | null): EstimatorState => ({
  stage: 'services',
  draft: initialItem ? cloneDraft(initialItem.draft) : createEmptyServiceEstimatorDraft(),
  acceptedPricingKey: null,
  editingId: initialItem?.id ?? null,
  cart: initialItem ? [initialItem] : [],
  status: initialItem ? 'Editing ' + initialItem.title + '.' : '',
});

type ChoiceGridProps = {
  idPrefix: string;
  label: string;
  options: readonly { id: string; label: string; price?: number }[];
  selected: readonly string[];
  onToggle: (id: string) => void;
  showPrices?: boolean;
};

function ChoiceGrid({
  idPrefix,
  label,
  options,
  selected,
  onToggle,
  showPrices = true,
}: ChoiceGridProps) {
  return (
    <fieldset className="landingQuoteChoices">
      <legend>{label}</legend>
      <div className="landingQuoteChoiceGrid">
        {options.map(option => {
          const id = idPrefix + '-' + option.id;
          const isSelected = selected.includes(option.id);
          return (
            <label className="landingQuoteChoice" data-selected={isSelected || undefined} htmlFor={id} key={option.id}>
              <input
                id={id}
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(option.id)}
              />
              <span className="landingQuoteChoiceCheck" aria-hidden="true">
                <i className="fa-solid fa-check" />
              </span>
              <span>{option.label}</span>
              {showPrices && typeof option.price === 'number' ? (
                <small>+{currencyFormatter.format(option.price)}</small>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function HomeServiceEstimator({
  initialItem,
  onAddToCart,
  onUpdateCart,
}: HomeServiceEstimatorProps = {}) {
  const instanceId = useId();
  const headingId = instanceId + '-title';
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousStageRef = useRef<EstimatorStage>('services');
  const [state, dispatch] = useReducer(reducer, initialItem, createInitialState);
  const estimate = calculateServiceEstimate(state.draft);
  const suggestedBudget = estimate.total === 0 ? 0 : Math.min(15000, Math.ceil(estimate.total / 250) * 250);
  const effectiveBudget = state.draft.budgetTouched ? state.draft.budget : suggestedBudget;
  const pricingKey = getPricingKey(state.draft, estimate, effectiveBudget);
  const payment = calculatePaymentProjection(state.draft, estimate);
  const scopeIssue = getScopeIssue(state.draft);
  const reviewTitles = getReviewTitles(state.draft, estimate);
  const activeStageIndex = stages.findIndex(stage => stage.id === state.stage);
  const budgetGap = effectiveBudget - estimate.total;
  const canReview = state.acceptedPricingKey === pricingKey;

  useEffect(() => {
    if (previousStageRef.current !== state.stage) {
      stageHeadingRef.current?.focus();
      previousStageRef.current = state.stage;
    }
  }, [state.stage]);

  const addOrUpdateCart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.stage !== 'review' || !canReview) {
      dispatch({ type: 'invalid-review' });
      return;
    }

    const existingItem = state.editingId
      ? state.cart.find(item => item.id === state.editingId)
      : undefined;
    const id = state.editingId ?? globalThis.crypto?.randomUUID?.() ?? 'plan-' + Date.now();
    const item: ServiceCartItem = {
      id,
      pricingVersion: 1,
      title: reviewTitles.join(' + '),
      draft: cloneDraft(state.draft),
      estimate,
      payment,
      createdAt: existingItem?.createdAt ?? new Date().toISOString(),
    };

    if (state.editingId) onUpdateCart?.(item);
    else onAddToCart?.(item);
    dispatch({ type: 'commit-item', item });
  };

  const nextFromServices = () => dispatch({ type: 'go', stage: 'scope' });
  const nextFromScope = () => {
    if (!scopeIssue) dispatch({ type: 'go', stage: 'budget' });
  };

  return (
    <section className="landingAltSection landingAltEstimator landingQuoteSection" aria-labelledby={headingId}>
      <div className="landingQuoteBackdrop" aria-hidden="true">
        <i className="fa-solid fa-anchor" />
      </div>

      <div className="landingAltInner landingQuoteInner">
        <header className="landingQuoteHeader">
          <span className="landingAltEyebrow">Build your voyage</span>
          <h2 id={headingId}>What service are you looking for?</h2>
          <p>Select one route or combine the whole crew. Every choice updates the planning estimate.</p>
        </header>

        <nav className="landingQuoteStepper" aria-label="Estimate progress">
          <ol>
            {stages.map((stage, index) => (
              <li
                className="landingQuoteStep"
                data-active={state.stage === stage.id || undefined}
                data-complete={index < activeStageIndex || undefined}
                aria-current={state.stage === stage.id ? 'step' : undefined}
                key={stage.id}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {stage.label}
              </li>
            ))}
          </ol>
          <progress value={activeStageIndex + 1} max={stages.length}>
            Step {activeStageIndex + 1} of {stages.length}
          </progress>
        </nav>

        <form className="landingQuoteForm" onSubmit={addOrUpdateCart}>
          <div className="landingQuoteWorkspace">
            <div className="landingQuotePanel">
              {state.stage === 'services' ? (
                <div className="landingQuoteStage">
                  <header className="landingQuoteStageHeader">
                    <span>01 // Services</span>
                    <h3 ref={stageHeadingRef} tabIndex={-1}>Choose one, several, or start with a conversation.</h3>
                    <p>No selection keeps your estimate at a free consultation.</p>
                  </header>

                  <fieldset className="landingQuoteServiceFieldset">
                    <legend className="landingAltSrOnly">Available services</legend>
                    <div className="landingQuoteServiceGrid">
                      {serviceCards.map(service => {
                        const id = instanceId + '-service-' + service.id;
                        const selected = state.draft.selectedServices.includes(service.id);
                        return (
                          <label
                            className="landingQuoteServiceCard"
                            data-selected={selected || undefined}
                            htmlFor={id}
                            key={service.id}
                          >
                            <input
                              id={id}
                              type="checkbox"
                              checked={selected}
                              onChange={() => dispatch({ type: 'toggle-service', service: service.id })}
                            />
                            <span className="landingQuoteServiceCheck" aria-hidden="true">
                              <i className="fa-solid fa-check" />
                            </span>
                            <i className={service.icon + ' landingQuoteServiceIcon'} aria-hidden="true" />
                            <strong>{service.label}</strong>
                            <p>{service.description}</p>
                            <small>{service.price}</small>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="landingQuoteActions">
                    <button className="landingQuotePrimary" type="button" onClick={nextFromServices}>
                      {estimate.isFreeConsultation ? 'Continue with free consultation' : 'Continue to scope'}
                      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </button>
                    <button className="landingQuoteTextButton" type="button" onClick={() => dispatch({ type: 'reset' })}>
                      Start over
                    </button>
                  </div>
                </div>
              ) : null}

              {state.stage === 'scope' ? (
                <div className="landingQuoteStage">
                  <header className="landingQuoteStageHeader">
                    <span>02 // Scope</span>
                    <h3 ref={stageHeadingRef} tabIndex={-1}>Name the voyage, then outfit it.</h3>
                    <p>Options appear after each selected service has a name.</p>
                  </header>

                  {!state.draft.selectedServices.length ? (
                    <div className="landingQuoteFreeCard">
                      <i className="fa-solid fa-comments" aria-hidden="true" />
                      <div>
                        <strong>Free consultation</strong>
                        <p>We will use the first conversation to chart the right service.</p>
                      </div>
                    </div>
                  ) : null}

                  <div className="landingQuoteScopeList">
                    {state.draft.selectedServices.includes('mentoring') ? (
                      <article className="landingQuoteScopeCard">
                        <header>
                          <i className="fa-solid fa-compass" aria-hidden="true" />
                          <div>
                            <span>Mentoring // Tutoring</span>
                            <strong>Up to $2,000</strong>
                          </div>
                        </header>
                        <label className="landingQuoteNameField" htmlFor={instanceId + '-mentoring-name'}>
                          <span>{SERVICE_ESTIMATOR_CATALOG.mentoring.prompt}</span>
                          <input
                            id={instanceId + '-mentoring-name'}
                            type="text"
                            value={state.draft.names.mentoring}
                            maxLength={80}
                            autoComplete="name"
                            placeholder="Student name"
                            onChange={event => dispatch({
                              type: 'set-name',
                              service: 'mentoring',
                              value: event.target.value,
                            })}
                          />
                        </label>

                        {hasValidName(state.draft.names.mentoring) ? (
                          <>
                            {state.draft.selectedServices.length === 1 ? (
                              <fieldset className="landingQuoteModeFieldset">
                                <legend>How should mentoring be priced?</legend>
                                <div className="landingQuoteSegmented">
                                  <label>
                                    <input
                                      type="radio"
                                      name={instanceId + '-mentoring-mode'}
                                      checked={state.draft.mentoringPricingMode === 'package'}
                                      onChange={() => dispatch({ type: 'set-mentoring-mode', value: 'package' })}
                                    />
                                    <span>Project package</span>
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      name={instanceId + '-mentoring-mode'}
                                      checked={state.draft.mentoringPricingMode === 'hourly'}
                                      onChange={() => dispatch({ type: 'set-mentoring-mode', value: 'hourly' })}
                                    />
                                    <span>Hourly</span>
                                  </label>
                                </div>
                              </fieldset>
                            ) : null}

                            {state.draft.mentoringPricingMode === 'hourly' &&
                            state.draft.selectedServices.length === 1 ? (
                              <div className="landingQuoteHourlyGrid">
                                <label htmlFor={instanceId + '-hourly-rate'}>
                                  <span>Hourly rate</span>
                                  <output htmlFor={instanceId + '-hourly-rate'}>
                                    {currencyFormatter.format(state.draft.hourlyRate)} / hour
                                  </output>
                                  <input
                                    id={instanceId + '-hourly-rate'}
                                    type="range"
                                    min={20}
                                    max={50}
                                    step={5}
                                    value={state.draft.hourlyRate}
                                    onChange={event => dispatch({
                                      type: 'set-hourly-rate',
                                      value: Number(event.target.value),
                                    })}
                                  />
                                </label>
                                <label htmlFor={instanceId + '-mentoring-hours'}>
                                  <span>Estimated hours</span>
                                  <output htmlFor={instanceId + '-mentoring-hours'}>
                                    {state.draft.mentoringHours} hours
                                  </output>
                                  <input
                                    id={instanceId + '-mentoring-hours'}
                                    type="range"
                                    min={1}
                                    max={40}
                                    step={1}
                                    value={state.draft.mentoringHours}
                                    onChange={event => dispatch({
                                      type: 'set-hours',
                                      value: Number(event.target.value),
                                    })}
                                  />
                                </label>
                              </div>
                            ) : null}

                            <ChoiceGrid
                              idPrefix={instanceId + '-mentoring'}
                              label="What should we work on?"
                              options={mentoringTopics}
                              selected={state.draft.mentoringTopics}
                              showPrices={state.draft.mentoringPricingMode === 'package' ||
                                state.draft.selectedServices.length > 1}
                              onToggle={value => dispatch({
                                type: 'toggle-list',
                                field: 'mentoringTopics',
                                value,
                              })}
                            />
                          </>
                        ) : (
                          <p className="landingQuoteGate">Enter at least two characters to reveal mentoring topics.</p>
                        )}
                      </article>
                    ) : null}

                    {state.draft.selectedServices.includes('marketing') ? (
                      <article className="landingQuoteScopeCard">
                        <header>
                          <i className="fa-solid fa-satellite-dish" aria-hidden="true" />
                          <div>
                            <span>Marketing // Analytics</span>
                            <strong>Up to $3,000</strong>
                          </div>
                        </header>
                        <label className="landingQuoteNameField" htmlFor={instanceId + '-marketing-name'}>
                          <span>{SERVICE_ESTIMATOR_CATALOG.marketing.prompt}</span>
                          <input
                            id={instanceId + '-marketing-name'}
                            type="text"
                            value={state.draft.names.marketing}
                            maxLength={80}
                            placeholder="Service name"
                            onChange={event => dispatch({
                              type: 'set-name',
                              service: 'marketing',
                              value: event.target.value,
                            })}
                          />
                        </label>
                        {hasValidName(state.draft.names.marketing) ? (
                          <ChoiceGrid
                            idPrefix={instanceId + '-marketing'}
                            label="Which services should join the campaign?"
                            options={marketingOptions}
                            selected={state.draft.marketingOptions}
                            onToggle={value => dispatch({
                              type: 'toggle-list',
                              field: 'marketingOptions',
                              value,
                            })}
                          />
                        ) : (
                          <p className="landingQuoteGate">Enter at least two characters to reveal marketing options.</p>
                        )}
                      </article>
                    ) : null}

                    {state.draft.selectedServices.includes('build') ? (
                      <article className="landingQuoteScopeCard">
                        <header>
                          <i className="fa-solid fa-ship" aria-hidden="true" />
                          <div>
                            <span>Website // Mobile Application or Game Development</span>
                            <strong>Up to $10,000</strong>
                          </div>
                        </header>
                        <label className="landingQuoteNameField" htmlFor={instanceId + '-build-name'}>
                          <span>{SERVICE_ESTIMATOR_CATALOG.build.prompt}</span>
                          <input
                            id={instanceId + '-build-name'}
                            type="text"
                            value={state.draft.names.build}
                            maxLength={80}
                            placeholder="Project name"
                            onChange={event => dispatch({
                              type: 'set-name',
                              service: 'build',
                              value: event.target.value,
                            })}
                          />
                        </label>
                        {hasValidName(state.draft.names.build) ? (
                          <>
                            <ChoiceGrid
                              idPrefix={instanceId + '-build-type'}
                              label="What are we building?"
                              options={buildTypes}
                              selected={state.draft.buildTypes}
                              showPrices={false}
                              onToggle={value => dispatch({
                                type: 'toggle-list',
                                field: 'buildTypes',
                                value,
                              })}
                            />
                            <p className="landingQuotePlatformNote">
                              Overlapping selections share one platform cost, so nothing is double-counted.
                            </p>
                            <ChoiceGrid
                              idPrefix={instanceId + '-build-feature'}
                              label="And additional features"
                              options={buildFeatures}
                              selected={state.draft.buildFeatures}
                              onToggle={value => dispatch({
                                type: 'toggle-list',
                                field: 'buildFeatures',
                                value,
                              })}
                            />
                            <fieldset className="landingQuoteMaintenance">
                              <legend>
                                Do you need the ability to do simple updates and maintenance on the website,
                                or would you like us to handle everything?
                              </legend>
                              <div className="landingQuoteSegmented">
                                <label>
                                  <input
                                    type="radio"
                                    name={instanceId + '-maintenance'}
                                    checked={state.draft.maintenance === 'self'}
                                    onChange={() => dispatch({ type: 'set-maintenance', value: 'self' })}
                                  />
                                  <span>Give me simple update tools</span>
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={instanceId + '-maintenance'}
                                    checked={state.draft.maintenance === 'managed'}
                                    onChange={() => dispatch({ type: 'set-maintenance', value: 'managed' })}
                                  />
                                  <span>Have Piratechs handle everything</span>
                                </label>
                              </div>
                              <small>Managed maintenance is scoped separately and does not change this build estimate.</small>
                            </fieldset>
                          </>
                        ) : (
                          <p className="landingQuoteGate">Enter at least two characters to reveal project options.</p>
                        )}
                      </article>
                    ) : null}
                  </div>

                  {scopeIssue ? (
                    <p className="landingQuoteValidation" id={instanceId + '-scope-issue'}>{scopeIssue}</p>
                  ) : null}
                  <div className="landingQuoteActions">
                    <button className="landingQuoteSecondary" type="button" onClick={() => dispatch({ type: 'go', stage: 'services' })}>
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back
                    </button>
                    <button
                      className="landingQuotePrimary"
                      type="button"
                      disabled={Boolean(scopeIssue)}
                      aria-describedby={scopeIssue ? instanceId + '-scope-issue' : undefined}
                      onClick={nextFromScope}
                    >
                      Continue to budget <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}

              {state.stage === 'budget' ? (
                <div className="landingQuoteStage">
                  <header className="landingQuoteStageHeader">
                    <span>03 // Budget</span>
                    <h3 ref={stageHeadingRef} tabIndex={-1}>Set a comfortable working range.</h3>
                    <p>The selection-based estimate stays transparent while you compare it with your budget.</p>
                  </header>

                  <div className="landingQuoteRangeCard">
                    <label htmlFor={instanceId + '-budget'}>
                      <span>Working budget</span>
                      <output htmlFor={instanceId + '-budget'}>{currencyFormatter.format(effectiveBudget)}</output>
                    </label>
                    <input
                      id={instanceId + '-budget'}
                      type="range"
                      min={0}
                      max={15000}
                      step={250}
                      value={effectiveBudget}
                      onChange={event => dispatch({ type: 'set-budget', value: Number(event.target.value) })}
                    />
                    <div className="landingQuoteRangeEnds" aria-hidden="true">
                      <span>$0</span><span>$15,000</span>
                    </div>
                    <p>
                      {estimate.isFreeConsultation
                        ? 'Nothing selected — your first consultation is free.'
                        : budgetGap >= 0
                          ? currencyFormatter.format(budgetGap) + ' remains above the current estimate.'
                          : 'This scope is ' + currencyFormatter.format(Math.abs(budgetGap)) + ' above your working budget.'}
                    </p>
                  </div>

                  <div className="landingQuoteAgreement">
                    <i className="fa-solid fa-file-signature" aria-hidden="true" />
                    <div>
                      <strong>
                        {estimate.isFreeConsultation
                          ? 'Continue with a free consultation'
                          : 'Accept the ' + currencyFormatter.format(estimate.total) + ' planning estimate'}
                      </strong>
                      <p>This is a transparent starting estimate, not a final contract or lending offer.</p>
                    </div>
                  </div>

                  {budgetGap < 0 ? (
                    <p className="landingQuoteValidation" id={instanceId + '-budget-issue'}>
                      Raise the budget or return to scope and adjust selections before accepting.
                    </p>
                  ) : null}

                  <div className="landingQuoteActions">
                    <button className="landingQuoteSecondary" type="button" onClick={() => dispatch({ type: 'go', stage: 'scope' })}>
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back
                    </button>
                    <button
                      className="landingQuotePrimary"
                      type="button"
                      disabled={budgetGap < 0}
                      aria-describedby={budgetGap < 0 ? instanceId + '-budget-issue' : undefined}
                      onClick={() => dispatch({ type: 'accept-price', pricingKey })}
                    >
                      {estimate.isFreeConsultation ? 'See consultation plan' : 'Agree & see payment plans'}
                      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}

              {state.stage === 'payment' ? (
                <div className="landingQuoteStage">
                  <header className="landingQuoteStageHeader">
                    <span>04 // Payment</span>
                    <h3 ref={stageHeadingRef} tabIndex={-1}>Choose how to fund the voyage.</h3>
                    <p>Higher monthly plans carry a lower illustrative rate, quicker cadence, and earlier delivery projection.</p>
                  </header>

                  <fieldset className="landingQuotePaymentMethod">
                    <legend>Payment route</legend>
                    <div className="landingQuoteSegmented">
                      <label>
                        <input
                          type="radio"
                          name={instanceId + '-payment-method'}
                          checked={state.draft.paymentMethod === 'full'}
                          onChange={() => dispatch({ type: 'set-payment-method', value: 'full' })}
                        />
                        <span>Pay in full</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={instanceId + '-payment-method'}
                          checked={state.draft.paymentMethod === 'finance'}
                          disabled={estimate.total === 0}
                          onChange={() => dispatch({ type: 'set-payment-method', value: 'finance' })}
                        />
                        <span>Finance the plan</span>
                      </label>
                    </div>
                  </fieldset>

                  {state.draft.paymentMethod === 'finance' && estimate.total > 0 ? (
                    <div className="landingQuoteFinance">
                      <div className="landingQuoteRangeCard">
                        <label htmlFor={instanceId + '-monthly'}>
                          <span>Preferred monthly payment</span>
                          <output htmlFor={instanceId + '-monthly'}>
                            {currencyFormatter.format(state.draft.monthlyTarget)} / month
                          </output>
                        </label>
                        <input
                          id={instanceId + '-monthly'}
                          type="range"
                          min={5}
                          max={350}
                          step={5}
                          value={state.draft.monthlyTarget}
                          onChange={event => dispatch({ type: 'set-monthly', value: Number(event.target.value) })}
                        />
                        <div className="landingQuoteRangeEnds" aria-hidden="true">
                          <span>$5 / month</span><span>$350 / month</span>
                        </div>
                      </div>

                      <div className="landingQuoteRangeCard">
                        <label htmlFor={instanceId + '-down-payment'}>
                          <span>Down payment</span>
                          <output htmlFor={instanceId + '-down-payment'}>
                            {currencyFormatter.format(state.draft.downPayment)}
                          </output>
                        </label>
                        <input
                          id={instanceId + '-down-payment'}
                          type="range"
                          min={0}
                          max={estimate.total}
                          step={estimate.total <= 500 ? 5 : 50}
                          value={Math.min(state.draft.downPayment, estimate.total)}
                          onChange={event => dispatch({ type: 'set-down-payment', value: Number(event.target.value) })}
                        />
                        <div className="landingQuoteRangeEnds" aria-hidden="true">
                          <span>$0</span><span>{currencyFormatter.format(estimate.total)}</span>
                        </div>
                      </div>

                      <fieldset className="landingQuoteDownMode">
                        <legend>Use the down payment to</legend>
                        <div className="landingQuoteSegmented">
                          <label>
                            <input
                              type="radio"
                              name={instanceId + '-down-mode'}
                              checked={state.draft.downPaymentMode === 'finish-sooner'}
                              onChange={() => dispatch({ type: 'set-down-mode', value: 'finish-sooner' })}
                            />
                            <span>Finish sooner</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={instanceId + '-down-mode'}
                              checked={state.draft.downPaymentMode === 'lower-monthly'}
                              onChange={() => dispatch({ type: 'set-down-mode', value: 'lower-monthly' })}
                            />
                            <span>Lower monthly payment</span>
                          </label>
                        </div>
                      </fieldset>
                    </div>
                  ) : null}

                  <dl className="landingQuoteProjection">
                    <div>
                      <dt>{payment.method === 'full' ? 'Due' : 'Projected monthly'}</dt>
                      <dd>
                        {payment.method === 'full'
                          ? currencyFormatter.format(estimate.total)
                          : currencyFormatter.format(payment.monthlyPayment)}
                      </dd>
                    </div>
                    <div>
                      <dt>Illustrative rate</dt>
                      <dd>{percentFormatter.format(payment.interestRate)}%</dd>
                    </div>
                    <div>
                      <dt>Update cadence</dt>
                      <dd>{payment.cadence}</dd>
                    </div>
                    <div>
                      <dt>Delivery projection</dt>
                      <dd>{payment.completionWeeks ? payment.completionWeeks + ' weeks after kickoff' : 'Schedule after consultation'}</dd>
                    </div>
                  </dl>

                  {payment.method === 'finance' ? (
                    <p className={payment.customReviewRequired ? 'landingQuoteFinanceWarning' : 'landingQuoteFinanceNote'}>
                      {payment.customReviewRequired
                        ? 'This selection projects beyond 60 months. Piratechs will review a custom payment structure before anything is agreed.'
                        : currencyFormatter.format(payment.financeFee) + ' estimated financing cost across ' +
                          payment.months + ' month' + (payment.months === 1 ? '' : 's') + '.'}
                    </p>
                  ) : (
                    <p className="landingQuoteFinanceNote">Paying in full carries no financing cost.</p>
                  )}

                  <p className="landingQuoteLegal">
                    Planning illustration only. Financing availability, rate, schedule, and final scope require review and a signed agreement.
                  </p>

                  <div className="landingQuoteActions">
                    <button className="landingQuoteSecondary" type="button" onClick={() => dispatch({ type: 'go', stage: 'budget' })}>
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back
                    </button>
                    <button
                      className="landingQuotePrimary"
                      type="button"
                      disabled={!canReview}
                      onClick={() => dispatch({ type: 'go', stage: 'review' })}
                    >
                      Review the plan <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}

              {state.stage === 'review' ? (
                <div className="landingQuoteStage">
                  <header className="landingQuoteStageHeader">
                    <span>05 // Review</span>
                    <h3 ref={stageHeadingRef} tabIndex={-1}>Review the chart before adding it to cart.</h3>
                    <p>You can return to any earlier stage; changing scope requires accepting the updated price.</p>
                  </header>

                  <div className="landingQuoteReviewTitles">
                    {reviewTitles.map(title => (
                      <div key={title}>
                        <i className="fa-solid fa-flag" aria-hidden="true" />
                        <strong>{title}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="landingQuoteReviewGrid">
                    <article>
                      <span>Scope</span>
                      {estimate.groups.length ? estimate.groups.map(group => (
                        <div className="landingQuoteReviewGroup" key={group.service}>
                          <strong>{group.label}</strong>
                          <ul>
                            {group.items.map(item => <li key={item.id}>{item.label}</li>)}
                          </ul>
                        </div>
                      )) : <p>Free consultation to determine the right scope.</p>}
                    </article>
                    <article>
                      <span>Payment</span>
                      <dl>
                        <div><dt>Estimate</dt><dd>{currencyFormatter.format(estimate.total)}</dd></div>
                        <div><dt>Budget</dt><dd>{currencyFormatter.format(effectiveBudget)}</dd></div>
                        <div>
                          <dt>Route</dt>
                          <dd>{payment.method === 'full' ? 'Pay in full' : 'Financing review'}</dd>
                        </div>
                        {payment.method === 'finance' ? (
                          <>
                            <div><dt>Down payment</dt><dd>{currencyFormatter.format(state.draft.downPayment)}</dd></div>
                            <div><dt>Monthly</dt><dd>{currencyFormatter.format(payment.monthlyPayment)}</dd></div>
                            <div><dt>Term</dt><dd>{payment.months} months</dd></div>
                          </>
                        ) : null}
                        <div><dt>Updates</dt><dd>{payment.cadence}</dd></div>
                      </dl>
                    </article>
                  </div>

                  {state.draft.selectedServices.includes('build') ? (
                    <p className="landingQuoteMaintenanceReview">
                      <i className="fa-solid fa-anchor" aria-hidden="true" />
                      {state.draft.maintenance === 'managed'
                        ? 'Piratechs-managed updates and maintenance requested; recurring care will be scoped separately.'
                        : 'Simple update tools and a handoff are requested.'}
                    </p>
                  ) : null}

                  {payment.customReviewRequired ? (
                    <p className="landingQuoteFinanceWarning">
                      This financing preference requires a custom review because its projection exceeds 60 months.
                    </p>
                  ) : null}

                  <div className="landingQuoteActions">
                    <button className="landingQuoteSecondary" type="button" onClick={() => dispatch({ type: 'go', stage: 'payment' })}>
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back
                    </button>
                    <button className="landingQuotePrimary" type="submit">
                      <i className="fa-solid fa-cart-plus" aria-hidden="true" />
                      {state.editingId ? 'Update cart item' : 'Add plan to cart'}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="landingQuoteSummary" aria-label="Live estimate summary">
              <span className="landingQuoteSummaryFlag">
                <i className="fa-solid fa-flag" aria-hidden="true" /> Live chart
              </span>
              <div className="landingQuoteSummaryTotal">
                <span>{estimate.isFreeConsultation ? 'Free consultation' : 'Planning estimate'}</span>
                <output>{currencyFormatter.format(estimate.total)}</output>
                <small>Selections are capped at {currencyFormatter.format(estimate.maximum)}.</small>
              </div>
              <dl>
                {estimate.groups.map(group => (
                  <div key={group.service}>
                    <dt>{group.label}</dt>
                    <dd>{currencyFormatter.format(group.total)}</dd>
                  </div>
                ))}
                {!estimate.groups.length ? <div><dt>Conversation</dt><dd>$0</dd></div> : null}
                <div><dt>Working budget</dt><dd>{currencyFormatter.format(effectiveBudget)}</dd></div>
              </dl>
              {estimate.platforms.length ? (
                <p>
                  <span>Unique build platforms</span>
                  {estimate.platforms.map(platform => platformLabels[platform]).join(' + ')}
                </p>
              ) : null}
              <div className="landingQuoteMiniTrail" aria-hidden="true">
                <span style={{ width: ((activeStageIndex + 1) / stages.length) * 100 + '%' }} />
              </div>
              <small>Step {activeStageIndex + 1} of {stages.length} // {stages[activeStageIndex]?.label}</small>
            </aside>
          </div>
        </form>

        <p className="landingQuoteStatus" aria-live="polite" aria-atomic="true">{state.status}</p>

        {state.cart.length ? (
          <aside className="landingQuoteCart" aria-label="Saved plans">
            <header>
              <div>
                <span>Local cart</span>
                <h3>{state.cart.length} saved plan{state.cart.length === 1 ? '' : 's'}</h3>
              </div>
              <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
            </header>
            <ul>
              {state.cart.map(item => (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {currencyFormatter.format(item.estimate.total)} · {
                        item.payment.method === 'full' ? 'Pay in full' :
                          currencyFormatter.format(item.payment.monthlyPayment) + '/month'
                      }
                    </span>
                  </div>
                  <button type="button" onClick={() => dispatch({ type: 'edit-item', item })}>
                    <i className="fa-solid fa-pen" aria-hidden="true" /> Edit
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

export default HomeServiceEstimator;
