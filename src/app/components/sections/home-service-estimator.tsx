'use client';

import ElementReveal from '../effects/element-reveal';
import { useEffect, useId, useReducer, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react';
import {
  buildEffortLevels, buildPageCounts, creativeOptions,
  mentoringTopics, serviceCards, type CreativeServiceId, type ServiceId, type ServiceOption,
} from './service-estimator-catalog';
import { buildDetails, marketingDetails, mentoringDetails } from './service-estimator-copy';
import {
  calculatePaymentProjection, calculateServiceEstimate, cloneDraft, createEmptyServiceEstimatorDraft,
  buildPackages, getIncludedBuildFeatures, getIncludedServiceOptions, getBuildScopePrice, isCreativeService, money, toggleValue,
  type BuildPackageId, type BuildEffortId, type BuildPageCountId, type EstimatorStage, type HomeServiceEstimatorProps,
  type ServiceCartItem, type ServiceEstimatorDraft,
} from './service-estimator-model';
import { buildAddOnSteps, getServiceEstimatorFlow, marketingCampaignOptions, marketingToolOptions } from './service-estimator-steps';

export * from './service-estimator-model';

type EstimatorState = {
  stage: EstimatorStage;
  draft: ServiceEstimatorDraft;
  editingId: string | null;
  cart: ServiceCartItem[];
  status: string;
};
type Action =
  | { type: 'go'; stage: EstimatorStage }
  | { type: 'patch'; patch: Partial<ServiceEstimatorDraft> }
  | { type: 'commit'; item: ServiceCartItem }
  | { type: 'edit'; item: ServiceCartItem }
  | { type: 'new' }
  | { type: 'status'; message: string };

const initialState = (item?: ServiceCartItem | null): EstimatorState => ({
  stage: 'services', draft: item ? cloneDraft(item.draft) : createEmptyServiceEstimatorDraft(),
  editingId: item?.id ?? null, cart: item ? [item] : [], status: '',
});

function reducer(state: EstimatorState, action: Action): EstimatorState {
  switch (action.type) {
    case 'go': return { ...state, stage: action.stage, status: '' };
    case 'patch': {
      const draft = { ...state.draft, ...action.patch };
      const total = calculateServiceEstimate(draft).total;
      return { ...state, draft: { ...draft, downPayment: Math.min(draft.downPayment, total), paymentMethod: total === 0 ? 'full' : 'finance' }, status: '' };
    }
    case 'commit': return {
      ...state, stage: 'cart', editingId: null,
      cart: state.cart.some(item => item.id === action.item.id)
        ? state.cart.map(item => item.id === action.item.id ? action.item : item)
        : [...state.cart, action.item],
      status: state.editingId ? 'Your plan has been updated.' : 'Your plan has been added to the cart.',
    };
    case 'edit': return { ...state, stage: 'services', editingId: action.item.id, draft: cloneDraft(action.item.draft), status: '' };
    case 'new': return { ...initialState(), cart: state.cart };
    case 'status': return { ...state, status: action.message };
  }
}

const creativeDetails = { ...marketingDetails, ...buildDetails };

function ChoiceCards({
  label, options, selected, onToggle, onSelectionChange, included = [], details = {}, showPrices = true, pricePrefix = '+',
}: {
  label: string; options: readonly ServiceOption[]; selected: readonly string[];
  onToggle: (id: string) => void; onSelectionChange: (ids: string[]) => void; details?: Record<string, readonly [string, string]>;
  showPrices?: boolean; pricePrefix?: string; included?: readonly string[];
}) {
  const selectableIds = options.filter(option => !included.includes(option.id)).map(option => option.id);
  const retainedIds = selected.filter(id => !selectableIds.includes(id));
  const allOptionsSelected = selectableIds.length > 0 && selectableIds.every(id => selected.includes(id));
  const toggledIds = allOptionsSelected ? selectableIds.filter(id => selected.includes(id)) : selectableIds.filter(id => !selected.includes(id));
  const toggledCost = showPrices ? options.filter(option => toggledIds.includes(option.id)).reduce((total, option) => total + (option.price ?? 0), 0) : 0;
  return (
    <fieldset className="servicesWidgetChoices">
      <legend>{label}</legend>
      <div className="servicesWidgetChoiceActions" aria-label={`${label} selection controls`}>
        <button type="button" aria-pressed={allOptionsSelected} disabled={!selectableIds.length}
          onClick={() => onSelectionChange(allOptionsSelected ? retainedIds : [...new Set([...retainedIds, ...selectableIds])])}>
          <i className={`fa-solid gradientTextColor ${allOptionsSelected ? `fa-xmark` : `fa-check-double`}`} aria-hidden="true" />
          <span>{allOptionsSelected ? `Unselect all` : `Select all`}</span>
          <strong className="servicesWidgetChoiceCost" data-direction={allOptionsSelected ? `remove` : `add`}>
            {allOptionsSelected ? `-${money(toggledCost)}` : `+${money(toggledCost)}`}
          </strong>
        </button>
      </div>
      <div className="servicesWidgetCards" data-count={options.length}>
        {options.map(option => {
          const detail = details[option.id];
          const isIncluded = included.includes(option.id);
          return (
            <label className="servicesWidgetCard" data-selected={isIncluded || selected.includes(option.id)} data-included={isIncluded} aria-disabled={isIncluded} key={option.id}>
              <input type="checkbox" disabled={isIncluded} checked={isIncluded || selected.includes(option.id)} onChange={() => onToggle(option.id)} />
              <span className="servicesWidgetCardIcon" aria-hidden="true">
                <i className={`fa-solid gradientTextColor ${option.icon ?? `fa-${detail?.[0] ?? 'wand-magic-sparkles'}`}`} />
              </span>
              <span className="servicesWidgetCardCopy">
                <strong>{option.label}</strong>
                <span>{option.description ?? detail?.[1]}</span>
                {isIncluded ? <small>Included in plan</small> : showPrices && typeof option.price === 'number' ? <small>{pricePrefix}{money(option.price)}</small> : null}
              </span>
              <span className="servicesWidgetCheck" aria-hidden="true">
                <i className="fa-solid fa-check" />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function RadioCards<Value extends string>({ label, name, options, selected, onChange, className }: any) {
  return (
    <fieldset className="servicesWidgetChoices">
      <legend>{label}</legend>
      <div className={`servicesWidgetRadioCards ${className ?? ``}`} data-count={options.length}>
        {options.map((option: any) => (
          <label className="servicesWidgetRadio" data-selected={selected === option.id} key={option.id}>
            <input type="radio" name={name} checked={selected === option.id} onChange={() => onChange(option.id)} />
            <span><strong>{option.label}</strong><small>{option.description}</small></span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RangeField({ label, value, min, max, step = 1, prefix = ``, suffix = ``, disabled = false, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; prefix?: string; suffix?: string; disabled?: boolean; onChange: (value: number) => void;
}) {
  const id = useId();
  const [editing, setEditing] = useState<string | null>(null);
  const progress = max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const formatBoundary = (boundary: number) => `${prefix}${boundary.toLocaleString(`en-US`)}${suffix ? ` ${suffix}` : ``}`;
  const commit = (rawValue: string) => {
    const number = Number(rawValue);
    if (!rawValue.trim() || !Number.isFinite(number)) {
      setEditing(null);
      return;
    }
    const precision = `${step}`.split(`.`)?.[1]?.length ?? 0;
    const clamped = Math.min(max, Math.max(min, number));
    onChange(Number((Math.round(clamped / step) * step).toFixed(precision)));
    setEditing(null);
  };
  return (
    <div className="servicesWidgetRange" data-disabled={disabled}>
      <div className="servicesWidgetRangeHeader">
        <label htmlFor={`${id}-value`}>{label}</label>
        <span className="servicesWidgetRangeValue">
          {prefix ? <span aria-hidden="true">{prefix}</span> : null}
          <input id={`${id}-value`} type="number" inputMode="decimal" min={min} max={max} step={step} value={editing ?? value} disabled={disabled}
            onChange={event => setEditing(event.target.value)} onBlur={event => commit(event.target.value)}
            onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur(); } }} />
          {suffix ? <span aria-hidden="true">{suffix}</span> : null}
        </span>
      </div>
      <div className="servicesWidgetRangeControls">
        <small>{formatBoundary(min)}</small>
        <input type="range" className="servicesWidgetRangeSlider" aria-label={`${label} slider`} min={min} max={max} step={step} value={value} disabled={disabled}
          style={{ '--services-range-progress': `${progress}%` } as CSSProperties}
          onChange={event => { setEditing(null); onChange(Number(event.target.value)); }} />
        <small>{formatBoundary(max)}</small>
      </div>
    </div>
  );
}

const paymentMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);

function getScopeIssue(draft: ServiceEstimatorDraft): { stage: EstimatorStage; message: string } | null {
  for (const { id: service } of serviceCards.filter(service => draft.selectedServices.includes(service.id))) {
    if (isCreativeService(service) && !draft.creativeOptions[service].length && !getIncludedServiceOptions(draft, service).length) {
      return { stage: service, message: 'Choose at least one option, or remove this service in the Services tab.' };
    }
    if (service === 'mentoring' && !draft.mentoringTopics.length) {
      return { stage: service, message: 'Choose at least one topic for your session.' };
    }

  }
  return null;
}

export function HomeServiceEstimator({ initialItem, onAddToCart, onUpdateCart, renderServiceSelection, onStageChange }: HomeServiceEstimatorProps = {}) {
  const id = useId();
  const [state, dispatch] = useReducer(reducer, initialItem, initialState);
  const { draft, stage } = state;
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const previousStage = useRef(stage);
  const keyboardTabChange = useRef<EstimatorStage | null>(null);
  const estimate = calculateServiceEstimate(draft);
  const payment = calculatePaymentProjection(draft, estimate);
  const selectedCards = serviceCards.filter(service => draft.selectedServices.includes(service.id));
  const flow = getServiceEstimatorFlow(draft);
  const tabs = state.cart.length ? [...flow, { id: 'cart' as const, label: `Cart (${state.cart.length})`, icon: 'fa-cart-shopping' }] : flow;
  const stageIndex = flow.findIndex(step => step.id === stage);
  const currentStep = flow.find(step => step.id === stage);
  const addOnStep = buildAddOnSteps.find(step => step.id === stage);
  const scopeIssue = getScopeIssue(draft);
  const patch = (patch: Partial<ServiceEstimatorDraft>) => dispatch({ type: 'patch', patch });
  const toggleList = <Field extends 'mentoringTopics' | 'marketingOptions' | 'buildFeatures'>(field: Field, value: string) => {
    patch({ [field]: toggleValue(draft[field] as string[], value) });
  };
  const go = (requestedStage: EstimatorStage) => {
    const nextStage = requestedStage === 'build' ? 'build-pages' : requestedStage;
    if (scopeIssue && ['payment', 'review'].includes(nextStage)) {
      dispatch({ type: 'go', stage: scopeIssue.stage });
      dispatch({ type: 'status', message: scopeIssue.message });
      return;
    }
    dispatch({ type: 'go', stage: nextStage });
  };

  useEffect(() => {
    onStageChange?.(stage);
  }, [onStageChange, stage]);

  useEffect(() => {
    if (previousStage.current !== stage) {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      const tab = tabsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (keyboardTabChange.current === stage) tab?.focus({ preventScroll: true });
      else headingRef.current?.focus({ preventScroll: true });
      keyboardTabChange.current = null;
      const bar = tabsRef.current;
      if (tab && bar) {
        // Scroll only the tab strip, never the home page or its waves section.
        if (tab.offsetLeft < bar.scrollLeft) bar.scrollLeft = tab.offsetLeft;
        else if (tab.offsetLeft + tab.offsetWidth > bar.scrollLeft + bar.clientWidth) {
          bar.scrollLeft = tab.offsetLeft + tab.offsetWidth - bar.clientWidth;
        }
      }
      previousStage.current = stage;
    }
  }, [stage]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    const target = tabs[next];
    const allowed = !scopeIssue || !['payment', 'review'].includes(target.id);
    // Focus the newly rendered tab, or let the wave section focus its native
    // service choices when returning Services unmounts this tab strip.
    keyboardTabChange.current = allowed && !(target.id === 'services' && renderServiceSelection) ? target.id : null;
    go(target.id);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stage !== 'review') {
      if (stage !== 'cart') go(flow[stageIndex + 1]?.id ?? 'review');
      return;
    }
    if (scopeIssue) { go(scopeIssue.stage); dispatch({ type: 'status', message: scopeIssue.message }); return; }
    if (draft.projectName.trim().length < 2) {
      dispatch({ type: 'status', message: 'Enter a project name with at least two characters, or n/a.' });
      nameRef.current?.focus({ preventScroll: true });
      if (nameRef.current && scrollRef.current) scrollRef.current.scrollTop = nameRef.current.offsetTop;
      return;
    }
    const existing = state.cart.find(item => item.id === state.editingId);
    const item: ServiceCartItem = {
      id: state.editingId ?? crypto.randomUUID(), pricingVersion: 5,
      title: draft.projectName.trim(), draft: cloneDraft({ ...draft, projectName: draft.projectName.trim() }),
      estimate, payment, createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    if (state.editingId) onUpdateCart?.(item); else onAddToCart?.(item);
    dispatch({ type: 'commit', item });
  };

  const panelTitle = stage === 'cart' ? 'Your saved plans' : currentStep?.title;
  const toggleService = (service: ServiceId) => patch({ selectedServices: toggleValue(draft.selectedServices, service) });
  const afterAddOns = flow.findIndex(step => step.id === buildAddOnSteps[buildAddOnSteps.length - 1].id) + 1;

  if (stage === 'services' && renderServiceSelection) {
    return renderServiceSelection({ selectedServices: draft.selectedServices, onToggle: toggleService, onStart: () => go(flow[1].id) });
  }

  return (
    <section className="servicesWidget" aria-label="Service estimator">
      <header className="servicesWidgetHeader">
        <div className="servicesWidgetBrand">
          <i className="fa-solid fa-compass gradientTextColor" aria-hidden="true" />
          <span>
            Services Estimator
            <small>
              {selectedCards.length ? `${selectedCards.length} service${selectedCards.length === 1 ? '' : 's'} selected` : 'Choose Services'}
            </small>
          </span>
        </div>
        <div className="servicesWidgetTabs" role="tablist" aria-label="Project steps" ref={tabsRef}>
          {tabs.map((tab, index) => (
            <button type="button" role="tab" id={`${id}-tab-${tab.id}`} aria-controls={`${id}-panel-${tab.id}`}
              aria-selected={stage === tab.id} tabIndex={stage === tab.id ? 0 : -1} key={tab.id}
              onClick={() => go(tab.id)} onKeyDown={event => onTabKeyDown(event, index)}>
              <i className={`fa-solid gradientTextColor ${tab.icon}`} aria-hidden="true" />{tab.label}
            </button>
          ))}
        </div>
        <div className="servicesWidgetEstimate">
          <span>Estimated Price</span>
          <output aria-live="polite" aria-atomic="true" aria-label="Planning estimate">
            {money(estimate.total)}
          </output>
        </div>
      </header>

      <form className="servicesWidgetForm" onSubmit={submit} noValidate>
        <div className="servicesWidgetScroll" ref={scrollRef}>
          <div className="servicesWidgetStage" role="tabpanel" id={`${id}-panel-${stage}`} aria-labelledby={`${id}-tab-${stage}`} key={stage}>
            <header className="servicesWidgetStageHeading"><h3 ref={headingRef} tabIndex={-1}>{panelTitle}</h3></header>

            {stage === 'services' ? (
              <ChoiceCards label="Select your services" options={serviceCards} selected={draft.selectedServices} pricePrefix="From "
                onToggle={value => toggleService(value as ServiceId)} onSelectionChange={selectedServices => patch({ selectedServices: selectedServices as ServiceId[] })} />
            ) : null}

            {isCreativeService(stage) ? (
              <ChoiceCards label="Choose what you need" options={creativeOptions[stage]} selected={draft.creativeOptions[stage]} details={creativeDetails} pricePrefix="" included={getIncludedServiceOptions(draft, stage)}
                onToggle={value => patch({ creativeOptions: { ...draft.creativeOptions, [stage]: toggleValue(draft.creativeOptions[stage as CreativeServiceId], value) } })}
                onSelectionChange={values => patch({ creativeOptions: { ...draft.creativeOptions, [stage]: values } })} />
            ) : null}

            {stage === 'mentoring' ? (
              <ChoiceCards label="What would you like to learn?" options={mentoringTopics} selected={draft.mentoringTopics} details={mentoringDetails}
                showPrices={draft.mentoringPricingMode === 'package'} onToggle={value => toggleList('mentoringTopics', value)}
                onSelectionChange={values => patch({ mentoringTopics: values as ServiceEstimatorDraft['mentoringTopics'] })} />
            ) : null}

            {stage === 'mentoring-session' ? (
              <>
                <RadioCards label="Session pricing" name={`${id}-mentoring-mode`} selected={draft.mentoringPricingMode}
                  options={[{ id: 'hourly', label: 'By the hour', description: 'Start with one focused hour. Topics are included.' }, { id: 'package', label: 'Project package', description: '$100 base, plus the topics you choose.' }]}
                  onChange={(mentoringPricingMode: any) => patch({ mentoringPricingMode })} />
                {draft.mentoringPricingMode === 'hourly' ? (
                  <div className="servicesWidgetRanges">
                    <RangeField label="Hourly rate" min={20} max={50} step={5} value={draft.hourlyRate} prefix="$" suffix="/ hr" onChange={hourlyRate => patch({ hourlyRate })} />
                    <RangeField label="Session hours" min={1} max={40} value={draft.mentoringHours} onChange={mentoringHours => patch({ mentoringHours })} />
                  </div>
                ) : null}
              </>
            ) : null}

            {stage === 'marketing' ? (
              <><p className="servicesWidgetNote">Your $200 engagement starts with a focused growth plan. Add the tools and content you need.</p>
                <ChoiceCards label="Build your campaign" options={marketingCampaignOptions} selected={draft.marketingOptions} details={marketingDetails} included={getIncludedServiceOptions(draft, 'marketing')}
                  onToggle={value => toggleList('marketingOptions', value)} onSelectionChange={values => patch({ marketingOptions: values as ServiceEstimatorDraft['marketingOptions'] })} /></>
            ) : null}

            {stage === 'marketing-tools' ? (
              <ChoiceCards label="Add tools and insights · optional" options={marketingToolOptions} selected={draft.marketingOptions} details={marketingDetails} included={getIncludedServiceOptions(draft, 'marketing')}
                onToggle={value => toggleList('marketingOptions', value)} onSelectionChange={values => patch({ marketingOptions: values as ServiceEstimatorDraft['marketingOptions'] })} />
            ) : null}

            {stage === 'build-pages' ? (
              <RadioCards<BuildPageCountId> label="Pages // Screens // Views" name={`${id}-pages`} selected={draft.buildPageCount}
                options={buildPageCounts.map(option => ({ ...option, description: `${money(getBuildScopePrice(option.id, draft.buildEffort, draft.buildPackage))}` }))}
                onChange={(buildPageCount: any) => patch({ buildPageCount })} className={`webAppServices`} />
            ) : null}
            {stage === 'build-detail' ? (
              <>
                <RadioCards<BuildEffortId> label="Level of detail" name={`${id}-effort`} selected={draft.buildEffort}
                  options={buildEffortLevels} onChange={(buildEffort: any) => patch({ buildEffort })} />
                <RadioCards<BuildPackageId> label="Your package" name={`${id}-package`} selected={draft.buildPackage ?? 'essential'}
                  options={buildPackages.map(option => ({ ...option, description: `${money(getBuildScopePrice(draft.buildPageCount, draft.buildEffort, option.id))}${option.id === 'complete' && draft.buildEffort !== 'simple' ? '+' : ''} · ${getIncludedBuildFeatures({ ...draft, buildPackage: option.id }).length} included features` }))}
                  onChange={(buildPackage: any) => patch({ buildPackage })} />
                <p className="servicesWidgetNote">Package prices reflect your selected page count. Included features are ready in the following tabs. Mobile App is an optional flat $150 add-on. Other optional extras add to the estimate; ongoing services are quoted separately.</p>
              </>
            ) : null}
            {stage === 'video' && draft.creativeOptions.video.includes('game') && draft.selectedServices.includes('build') ? <p className="servicesWidgetNote">Your game shares scope and add-ons with your website or app. You’ll choose those together in Pages, Detail, and the add-on tabs.</p> : null}
            {addOnStep ? <ChoiceCards label="Make it yours · optional add-ons" options={addOnStep.options} selected={draft.buildFeatures} included={getIncludedBuildFeatures(draft)} details={buildDetails}
              onToggle={value => toggleList('buildFeatures', value)} onSelectionChange={values => patch({ buildFeatures: values as ServiceEstimatorDraft['buildFeatures'] })} /> : null}
            {stage === 'build-care' ? (
              <RadioCards label="After launch" name={`${id}-care`} selected={draft.maintenance} className="servicesWidgetCareChoices"
                options={[{ id: 'self', label: 'I’ll handle updates', description: 'Simple tools and a handoff. No ongoing care added.' }, { id: 'managed', label: 'Piratechs handles it', description: 'Request ongoing care, quoted separately.' }]}
                onChange={(maintenance: any) => patch({ maintenance })} />
            ) : null}

            {stage === 'payment' ? (
              <>
                {estimate.total ? (
                  <>
                    <div className="servicesWidgetRanges">
                      <RangeField label="Term (months)" min={payment.principal ? 2 : 0} max={120} value={payment.months} disabled={!payment.principal}
                        onChange={financeTermMonths => patch({ financeTermMonths, financingControl: 'term' })} />
                      <RangeField label="Monthly payment" min={payment.principal ? 1 : 0} max={payment.principal} step={0.01} value={payment.monthlyPayment} prefix="$" disabled={!payment.principal}
                        onChange={monthlyTarget => patch({ monthlyTarget, financingControl: 'monthly' })} />
                      <RangeField label="Down payment" min={0} max={estimate.total} value={draft.downPayment} prefix="$"
                        onChange={downPayment => patch({ downPayment })} />
                    </div>
                    <p className="servicesWidgetNote">Drag a slider or type an exact value, then press Enter or leave the field to recalculate. Move the down payment to the full estimate to pay in full with no financing fee. Maximum financed term: 120 months (10 years).</p>
                    <dl className="servicesWidgetFacts">
                      <div><dt>Projected payment</dt><dd>{payment.method === 'full' ? 'Paid in full' : `${paymentMoney(payment.monthlyPayment)} / month`}</dd></div>
                      <div><dt>Term</dt><dd>{payment.months ? `${payment.months} months` : 'No financing'}</dd></div>
                      <div><dt>Illustrative rate</dt><dd>{payment.interestRate.toFixed(1)}%</dd></div>
                      <div><dt>Financing fee</dt><dd>{money(payment.financeFee)}</dd></div>
                    </dl>
                    <p className="servicesWidgetNote">Planning illustration only. Financing and final terms require review and an agreement.</p>
                  </>
                ) : <p className="servicesWidgetNote">Your consultation is free, so no payment plan is needed.</p>}
                <p className="servicesWidgetNote">{payment.completionWeeks ? `Projected delivery: ${payment.completionWeeks} weeks after kickoff. ${payment.cadence} updates.` : 'We’ll schedule your first conversation together.'}</p>
              </>
            ) : null}

            {stage === 'review' ? (
              <>
                <div className="servicesWidgetReview">
                  {estimate.groups.length ? estimate.groups.map(group => (
                    <details key={group.service}>
                      <summary>{group.label}<span>{group.items.length} item{group.items.length === 1 ? '' : 's'}</span></summary>
                      <ul>{group.items.map(item => <li key={item.id}>{item.label} · {item.amount === 0 ? 'Included' : money(item.amount)}</li>)}</ul>
                      {group.service === 'mentoring' && draft.mentoringPricingMode === 'hourly' ? <p>{mentoringTopics.filter(topic => draft.mentoringTopics.includes(topic.id)).map(topic => topic.label).join(' · ')}</p> : null}
                      <button type="button" className="servicesWidgetTextButton" onClick={() => go(group.service)}>Edit selections</button>
                    </details>
                  )) : <p className="servicesWidgetNote">A free consultation to find the right direction for your idea.</p>}
                </div>
                <p className="servicesWidgetNote">{estimate.isFreeConsultation ? 'Free consultation · no payment needed.' : payment.method === 'full' ? 'Pay in full · no financing fee.' : `Financing requested · ${paymentMoney(payment.monthlyPayment)} / month for ${payment.months} months, plus ${money(draft.downPayment)} down. Financing fee: ${money(payment.financeFee)}.`} {draft.maintenance === 'managed' && estimate.platforms.includes('website') ? 'Ongoing website care will be quoted separately.' : ''}</p>
                <label className="servicesWidgetName" htmlFor={`${id}-name`}>
                  <span>What’s your project called?</span>
                  <input id={`${id}-name`} ref={nameRef} name="projectName" autoComplete="off" type="text" required minLength={2} maxLength={80} aria-invalid={Boolean(state.status && draft.projectName.trim().length < 2)}
                    placeholder="e.g. North Star Studio or n/a" value={draft.projectName} onChange={event => patch({ projectName: event.target.value })} />
                  <small>One name for everything in this plan. Enter n/a if you don’t have one yet.</small>
                </label>
                <p className="servicesWidgetNote">This is a planning estimate. Adding a plan to your cart does not charge you.</p>
              </>
            ) : null}

            {stage === 'cart' ? (
              <>
                <p className="servicesWidgetNote">Saved in this session. Edit a plan to view its estimate and change any selection, or start another.</p>
                <ul className="servicesWidgetCart">
                  {state.cart.map(item => (
                    <li key={item.id}><i className="fa-solid fa-flag gradientTextColor" aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.draft.selectedServices.length || 'Free consultation'}{item.draft.selectedServices.length ? ' services' : ''}</small></span>
                      <button type="button" className="servicesWidgetSecondary" onClick={() => dispatch({ type: 'edit', item })}>Edit<span className="servicesWidgetSrOnly"> {item.title}</span></button></li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
        <ElementReveal onScroll as={`footer`} y={10} delay={0.04} duration={0.42} className={`servicesWidgetFooter`}>
          <p className="servicesWidgetStatus" role="status" aria-live="polite">{state.status || (stage === 'cart' ? `${state.cart.length} saved plan${state.cart.length === 1 ? '' : 's'}` : `Step ${stageIndex + 1} of ${flow.length}${state.editingId ? ' · Editing plan' : ''}`)}</p>
          <div className="servicesWidgetActions">
            {addOnStep ? <button type="button" className="servicesWidgetTextButton" onClick={() => go(flow[afterAddOns].id)}>Finish add-ons</button> : null}
            {stage === 'cart' ? <button type="button" className="servicesWidgetPrimary" onClick={() => dispatch({ type: 'new' })}>Create another plan<i className="fa-solid fa-plus" aria-hidden="true" /></button> : (
              <>
                {stageIndex > 0 ? <button type="button" className="servicesWidgetSecondary" onClick={() => go(flow[stageIndex - 1].id)} aria-label="Previous step"><i className="fa-solid fa-arrow-left" aria-hidden="true" /></button>
                  : <button type="button" className="servicesWidgetSecondary" onClick={() => dispatch({ type: 'new' })} aria-label="Clear selections and start over"><i className="fa-solid fa-rotate-left" aria-hidden="true" /></button>}
                {stage === 'review' ? <button type="submit" className="servicesWidgetPrimary"><i className="fa-solid fa-cart-plus" aria-hidden="true" />{state.editingId ? 'Update cart' : 'Add to cart'}</button>
                  : <button type="button" className="servicesWidgetPrimary" onClick={() => go(flow[stageIndex + 1].id)}>{stage === 'services' && estimate.isFreeConsultation ? 'Free consultation' : stage === 'payment' ? 'Review plan' : 'Continue'}<i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>}
              </>
            )}
          </div>
        </ElementReveal>
      </form>
    </section>
  );
}

export default HomeServiceEstimator;
