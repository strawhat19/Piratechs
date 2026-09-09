import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildPackages, calculatePaymentProjection, calculateServiceEstimate, cloneDraft,
  createEmptyServiceEstimatorDraft, getIncludedBuildFeatures, getIncludedServiceOptions,
  type ServiceEstimatorDraft,
} from '../src/app/components/sections/service-estimator-model';
import { getServiceEstimatorFlow } from '../src/app/components/sections/service-estimator-steps';

const draft = (patch: Partial<ServiceEstimatorDraft> = {}): ServiceEstimatorDraft => ({
  ...createEmptyServiceEstimatorDraft(), selectedServices: ['build'], ...patch,
});

for (const [effort, pages, prices] of [
  ['simple', 'one', [333, 777, 1111]],
  ['business', 'five-plus', [1500, 2222, 2500]],
  ['enterprise', 'ten-plus', [3000, 3333, 3500]],
] as const) {
  test(`${effort} packages match advertised prices and include progressively more features`, () => {
    let previous: readonly string[] = [];
    buildPackages.forEach((pack, index) => {
      const plan = draft({ buildEffort: effort, buildPageCount: pages, buildPackage: pack.id });
      const included = getIncludedBuildFeatures(plan);
      assert.equal(calculateServiceEstimate(plan).total, prices[index]);
      assert.ok(previous.every(feature => included.includes(feature as typeof included[number])));
      assert.equal(calculateServiceEstimate({ ...plan, buildFeatures: [...included] }).total, prices[index]);
      previous = included;
    });
  });
}

test('specialized extras remain billable, and tier changes recalculate selected features', () => {
  const plan = draft({ buildEffort: 'enterprise', buildPageCount: 'ten-plus', buildPackage: 'complete', buildFeatures: ['auth', 'multiplayer'] });
  assert.equal(calculateServiceEstimate(plan).total, 3850);
  assert.equal(calculateServiceEstimate({ ...plan, buildEffort: 'simple', buildPageCount: 'one', buildPackage: 'essential' }).total, 933);
});

test('included deliverables are not charged again through creative or marketing services', () => {
  const plan = draft({ selectedServices: ['build', 'ai', 'art', 'writing', 'marketing'], buildEffort: 'enterprise', buildPageCount: 'ten-plus', buildPackage: 'recommended', marketingOptions: ['cms', 'automations', 'customer-feedback', 'advertising'] });
  assert.deepEqual(getIncludedServiceOptions(plan, 'ai'), ['ai-chatbot', 'automations']);
  assert.equal(calculateServiceEstimate(plan).total, 3333 + 200 + 250);
  assert.equal(calculateServiceEstimate({ ...plan, selectedServices: ['ai'], creativeOptions: { ...plan.creativeOptions, ai: ['ai-chatbot'] } }).total, 150);
});

test('no-service consultation skips payment in both directions', () => {
  const plan = draft({ selectedServices: [] });
  assert.deepEqual(getServiceEstimatorFlow(plan).map(step => step.id), ['services', 'review']);
  assert.equal(calculateServiceEstimate(plan).total, 0);
  assert.equal(calculatePaymentProjection({ ...plan, paymentMethod: 'finance' }).months, 0);
  assert.ok(getServiceEstimatorFlow(draft()).some(step => step.id === 'payment'));
});

test('website starts at Pages and has no platform selection tab', () => {
  const flow = getServiceEstimatorFlow(draft({ buildTypes: [] }));
  assert.equal(flow[1].id, 'build-pages');
  assert.ok(!flow.some(step => step.id === 'build'));
  assert.ok(flow.some(step => step.id === 'build-services'));
  assert.ok(flow.some(step => step.id === 'build-care'));
});

test('mobile is optional and costs exactly $150 for every page count and package', () => {
  for (const buildEffort of ['simple', 'business', 'enterprise'] as const) {
    for (const buildPageCount of ['one', 'three', 'five-plus', 'ten-plus'] as const) {
      for (const { id: buildPackage } of buildPackages) {
        const base = draft({ buildEffort, buildPageCount, buildPackage });
        const mobile = { ...base, buildFeatures: ['mobile-app'] as const };
        assert.ok(!getIncludedBuildFeatures(base).includes('mobile-app'));
        const withMobile = calculateServiceEstimate({ ...mobile, buildFeatures: [...mobile.buildFeatures] });
        assert.equal(withMobile.total - calculateServiceEstimate(base).total, 150);
        assert.deepEqual(withMobile.platforms, ['website', 'mobile']);
      }
    }
  }
});

test('legacy mobile selections migrate to one removable flat add-on', () => {
  const old = draft({ buildTypes: ['website-only', 'website-mobile'], buildFeatures: ['mobile-app', 'multiplayer'] });
  assert.equal(calculateServiceEstimate(old).total, 333 + 150 + 350);
  const migrated = cloneDraft(old);
  assert.deepEqual(migrated.buildTypes, ['website-only']);
  assert.equal(migrated.buildFeatures.filter(id => id === 'mobile-app').length, 1);
  assert.equal(calculateServiceEstimate(migrated).total, 833);
  assert.equal(calculateServiceEstimate({ ...migrated, buildFeatures: ['multiplayer'] }).total, 683);
});

test('website games are charged once even when selected through Video', () => {
  const plan = draft({ selectedServices: ['build', 'video'], buildFeatures: ['game'], creativeOptions: { ai: [], art: [], writing: [], video: ['game'] } });
  assert.equal(calculateServiceEstimate(plan).total, 333 + 300);
  assert.equal(calculateServiceEstimate({ ...plan, buildFeatures: [] }).total, 333 + 300);
  const standalone = { ...plan, selectedServices: ['video'] as const, buildFeatures: ['mobile-app', 'game'] as const };
  const estimate = calculateServiceEstimate({ ...standalone, selectedServices: [...standalone.selectedServices], buildFeatures: [...standalone.buildFeatures] });
  assert.equal(estimate.total, 333);
  assert.deepEqual(estimate.platforms, ['game']);
  assert.ok(!getServiceEstimatorFlow({ ...plan, selectedServices: ['video'] }).some(step => step.id === 'build-services'));
});

test('saved plans preserve n/a, packages, and independently editable financing inputs', () => {
  const plan = draft({ projectName: 'n/a', buildPackage: 'complete', financeTermMonths: 120, financingControl: 'term' });
  const saved = cloneDraft(plan);
  assert.equal(saved.projectName, 'n/a');
  assert.equal(saved.buildPackage, 'complete');
  assert.equal(saved.financeTermMonths, 120);
  saved.buildFeatures.push('auth');
  assert.deepEqual(plan.buildFeatures, []);
});

test('financing always repays the balance within 120 months', () => {
  for (const total of [333, 1111, 2222, 3500, 15000]) {
    for (const downPayment of [0, Math.floor(total / 2), total, total + 100]) {
      for (const financingControl of ['monthly', 'term'] as const) {
        for (const value of [1, 5, 24, 60, 120, 360]) {
          const plan = draft({ paymentMethod: 'finance', financingControl, financeTermMonths: value, monthlyTarget: value, downPayment });
          const result = calculatePaymentProjection(plan, { ...calculateServiceEstimate(plan), total });
          assert.ok(result.months >= 0 && result.months <= 120);
          assert.ok(result.monthlyPayment * result.months + 0.001 >= result.financedTotal);
          assert.ok(result.monthlyPayment * result.months - result.financedTotal < 1.21);
          if (downPayment >= total) assert.equal(result.months, 0);
        }
      }
    }
  }
});

test('editing term, monthly payment, and down payment changes the schedule predictably', () => {
  const plan = draft({ buildEffort: 'enterprise', buildPageCount: 'ten-plus', paymentMethod: 'finance', financeTermMonths: 120 });
  const long = calculatePaymentProjection(plan);
  const short = calculatePaymentProjection({ ...plan, financeTermMonths: 24 });
  assert.equal(short.months, 24);
  assert.ok(short.monthlyPayment > long.monthlyPayment);
  const higherMonthly = calculatePaymentProjection({ ...plan, financingControl: 'monthly', monthlyTarget: 200 });
  assert.ok(higherMonthly.months < short.months);
  assert.ok(calculatePaymentProjection({ ...plan, downPayment: 1000 }).monthlyPayment < long.monthlyPayment);
  const full = calculatePaymentProjection({ ...plan, paymentMethod: 'full' });
  assert.equal(full.financeFee, 0);
  assert.equal(full.months, 0);
});
