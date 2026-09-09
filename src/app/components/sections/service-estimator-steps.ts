import { buildFeatures, marketingOptions, serviceCards } from './service-estimator-catalog';
import { getBuildPlatforms, type BuildFeatureId, type BuildStepId, type EstimatorStage, type ServiceEstimatorDraft } from './service-estimator-model';

export type ServiceEstimatorStep = { id: EstimatorStage; label: string; title: string; icon: string };

const featureGroups: {
  id: BuildStepId;
  label: string;
  title: string;
  icon: string;
  features: readonly BuildFeatureId[];
}[] = [
  { id: 'build-content', label: 'Content', title: 'Content and publishing', icon: 'fa-file-lines', features: ['blog', 'news', 'content', 'announcements', 'images', 'cms-database', 'news-letter', 'search'] },
  { id: 'build-design', label: 'Design', title: 'Brand, design, and motion', icon: 'fa-palette', features: ['logo', 'sliders', 'loader', 'design', 'fonts', 'themes', 'animations', 'adv-animations'] },
  { id: 'build-data', label: 'Data', title: 'Useful tools and data', icon: 'fa-chart-column', features: ['to-do', 'grids', 'charts', 'stocks', 'clock', 'weather', 'dashboard', 'analytics', 'adv-analytics'] },
  { id: 'build-connect', label: 'Connect', title: 'Connect your tools', icon: 'fa-plug', features: ['qr', 'ai-chatbot', 'maps', 'music', 'automations', 'api-server', 'functions', 'location'] },
  { id: 'build-experience', label: 'Experience', title: 'Shape the experience', icon: 'fa-hand-pointer', features: ['media', 'drag-drop', 'haptics', 'audio', 'international', 'accessibility', 'pwa', 'multiplayer'] },
  { id: 'build-customers', label: 'Customers', title: 'Connect with customers', icon: 'fa-comments', features: ['reviews', 'contact-form', 'capture', 'missed', 'email', 'social-media', 'advanced-contact-form', 'booking-calendar'] },
  { id: 'build-operations', label: 'Operations', title: 'Accounts, commerce, and operations', icon: 'fa-gears', features: ['testing', 'security', 'maintenance', 'storage', 'customer-order-tracking', 'notifications', 'auth', 'ecommerce'] },
];

export const buildAddOnSteps = featureGroups.map(({ features, ...step }) => ({
  ...step,
  options: features.map(id => buildFeatures.find(feature => feature.id === id)!),
}));

const marketingToolIds = new Set(['cms', 'automations', 'ai-drone-analysis', 'customer-feedback']);
export const marketingCampaignOptions = marketingOptions.filter(option => !marketingToolIds.has(option.id));
export const marketingToolOptions = marketingOptions.filter(option => marketingToolIds.has(option.id));

export function getServiceEstimatorFlow(draft: ServiceEstimatorDraft): ServiceEstimatorStep[] {
  const flow: ServiceEstimatorStep[] = [{ id: 'services', label: 'Services', title: 'What can we help you create?', icon: 'fa-layer-group' }];
  const hasBuild = draft.selectedServices.includes('build');
  const hasVideoGame = draft.selectedServices.includes('video') && draft.creativeOptions.video.includes('game');

  for (const service of serviceCards) {
    if (!draft.selectedServices.includes(service.id)) continue;
    flow.push({ id: service.id, label: service.tab, title: service.label, icon: service.icon });

    if (service.id === 'mentoring') {
      flow.push({ id: 'mentoring-session', label: 'Session', title: 'Plan your mentoring session', icon: 'fa-clock' });
    }
    if (service.id === 'marketing') {
      flow.push({ id: 'marketing-tools', label: 'Tools', title: 'Marketing tools and insights', icon: 'fa-chart-line' });
    }

    // A game selected through Video shares its scope and add-ons with Build.
    if (service.id === 'build' || (service.id === 'video' && hasVideoGame && !hasBuild)) {
      flow.push(
        { id: 'build-pages', label: 'Pages', title: 'How much room does your idea need?', icon: 'fa-window-restore' },
        { id: 'build-detail', label: 'Detail', title: 'Choose the level of detail', icon: 'fa-sliders' },
        ...buildAddOnSteps,
      );
      if (hasBuild && getBuildPlatforms(draft.buildTypes).includes('website')) {
        flow.push({ id: 'build-care', label: 'Care', title: 'Plan for after launch', icon: 'fa-life-ring' });
      }
    }
  }

  if (draft.selectedServices.length) flow.push({ id: 'payment', label: 'Payment', title: 'Choose how to pay', icon: 'fa-wallet' });
  flow.push({ id: 'review', label: 'Review', title: 'Review your plan and name your project', icon: 'fa-flag' });
  return flow;
}
