'use client';

import { useEffect, useId, useReducer, useRef, type FormEvent, type KeyboardEvent } from 'react';
import {
  buildEffortLevels, buildPageCounts, creativeOptions,
  mentoringTopics, serviceCards, type CreativeServiceId, type ServiceId, type ServiceOption,
} from './service-estimator-catalog';
import { buildDetails, marketingDetails, mentoringDetails } from './service-estimator-copy';
import {
  calculatePaymentProjection, calculateServiceEstimate, cloneDraft, createEmptyServiceEstimatorDraft,
  getBuildPlatforms, getBuildScopePrice, isCreativeService, money, toggleValue,
  type BuildEffortId, type BuildPageCountId, type EstimatorStage, type HomeServiceEstimatorProps,
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
      return { ...state, draft: { ...draft, downPayment: Math.min(draft.downPayment, total), paymentMethod: total === 0 ? 'full' : draft.paymentMethod }, status: '' };
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
const platformOptions = [
  { id: 'website-only', label: 'Website', icon: 'fa-globe', description: 'A responsive home for your business, ready for customers on any device.' },
  { id: 'mobile-only', label: 'Mobile App', icon: 'fa-mobile-screen-button', description: 'Bring your service to customers through a dedicated mobile experience.' },
  { id: 'game-only', label: 'Game', icon: 'fa-gamepad', description: 'Engage your audience with interactive play, challenges, and shared experiences.' },
] as const;

function ChoiceCards({
  label, options, selected, onToggle, details = {}, showPrices = true, pricePrefix = '+',
}: {
  label: string; options: readonly ServiceOption[]; selected: readonly string[];
  onToggle: (id: string) => void; details?: Record<string, readonly [string, string]>;
  showPrices?: boolean; pricePrefix?: string;
}) {
  return (
    <fieldset className="servicesWidgetChoices">
      <legend>{label}</legend>
      <div className="servicesWidgetCards">
        {options.map(option => {
          const detail = details[option.id];
          return (
            <label className="servicesWidgetCard" data-selected={selected.includes(option.id)} key={option.id}>
              <input type="checkbox" checked={selected.includes(option.id)} onChange={() => onToggle(option.id)} />
              <span className="servicesWidgetCardIcon" aria-hidden="true"><i className={`fa-solid ${option.icon ?? `fa-${detail?.[0] ?? 'wand-magic-sparkles'}`}`} /></span>
              <span className="servicesWidgetCardCopy">
                <strong>{option.label}</strong>
                <span>{option.description ?? detail?.[1]}</span>
                {showPrices && typeof option.price === 'number' ? <small>{pricePrefix}{money(option.price)}</small> : null}
              </span>
              <span className="servicesWidgetCheck" aria-hidden="true"><i className="fa-solid fa-check" /></span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function RadioCards<Value extends string>({ label, name, options, selected, onChange }: {
  label: string; name: string; options: readonly { id: Value; label: string; description: string }[];
  selected: Value | null; onChange: (value: Value) => void;
}) {
  return (
    <fieldset className="servicesWidgetChoices">
      <legend>{label}</legend>
      <div className="servicesWidgetRadioCards">
        {options.map(option => (
          <label className="servicesWidgetRadio" data-selected={selected === option.id} key={option.id}>
            <input type="radio" name={name} checked={selected === option.id} onChange={() => onChange(option.id)} />
            <span><strong>{option.label}</strong><small>{option.description}</small></span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RangeField({ label, value, min, max, step = 1, display, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; display: string; onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <label className="servicesWidgetRange" htmlFor={id}>
      <span>{label}<output htmlFor={id}>{display}</output></span>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} />
    </label>
  );
}

function getScopeIssue(draft: ServiceEstimatorDraft): { stage: EstimatorStage; message: string } | null {
  for (const { id: service } of serviceCards.filter(service => draft.selectedServices.includes(service.id))) {
    if (isCreativeService(service) && !draft.creativeOptions[service].length) {
      return { stage: service, message: 'Choose at least one option, or remove this service in the Services tab.' };
    }
    if (service === 'mentoring' && !draft.mentoringTopics.length) {
      return { stage: service, message: 'Choose at least one topic for your session.' };
    }
    if (service === 'build' && !draft.buildTypes.length) {
      return { stage: service, message: 'Choose at least one platform for your project.' };
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
  const toggleList = <Field extends 'mentoringTopics' | 'marketingOptions' | 'buildTypes' | 'buildFeatures'>(field: Field, value: string) => {
    patch({ [field]: toggleValue(draft[field] as string[], value) });
  };
  const go = (nextStage: EstimatorStage) => {
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
      dispatch({ type: 'status', message: 'Give your project a name with at least two characters.' });
      nameRef.current?.focus({ preventScroll: true });
      if (nameRef.current && scrollRef.current) scrollRef.current.scrollTop = nameRef.current.offsetTop;
      return;
    }
    const existing = state.cart.find(item => item.id === state.editingId);
    const item: ServiceCartItem = {
      id: state.editingId ?? crypto.randomUUID(), pricingVersion: 3,
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
        <div className="servicesWidgetBrand"><i className="fa-solid fa-compass" aria-hidden="true" /><span>Build your voyage<small>{selectedCards.length ? `${selectedCards.length} service${selectedCards.length === 1 ? '' : 's'} selected` : 'Choose as many as you like'}</small></span></div>
        <div className="servicesWidgetEstimate">
          <span>Live estimate</span>
          <output aria-live="polite" aria-atomic="true" aria-label="Planning estimate">{money(estimate.total)}</output>
        </div>
      </header>

      <div className="servicesWidgetTabs" role="tablist" aria-label="Project steps" ref={tabsRef}>
        {tabs.map((tab, index) => (
          <button type="button" role="tab" id={`${id}-tab-${tab.id}`} aria-controls={`${id}-panel-${tab.id}`}
            aria-selected={stage === tab.id} tabIndex={stage === tab.id ? 0 : -1} key={tab.id}
            onClick={() => go(tab.id)} onKeyDown={event => onTabKeyDown(event, index)}>
            <i className={`fa-solid ${tab.icon}`} aria-hidden="true" />{tab.label}
          </button>
        ))}
      </div>

      <form className="servicesWidgetForm" onSubmit={submit} noValidate>
        <div className="servicesWidgetScroll" ref={scrollRef}>
          <div className="servicesWidgetStage" role="tabpanel" id={`${id}-panel-${stage}`} aria-labelledby={`${id}-tab-${stage}`} key={stage}>
            <header className="servicesWidgetStageHeading"><h3 ref={headingRef} tabIndex={-1}>{panelTitle}</h3></header>

            {stage === 'services' ? (
              <ChoiceCards label="Select your services" options={serviceCards} selected={draft.selectedServices} pricePrefix="From "
                onToggle={value => toggleService(value as ServiceId)} />
            ) : null}

            {isCreativeService(stage) ? (
              <ChoiceCards label="Choose what you need" options={creativeOptions[stage]} selected={draft.creativeOptions[stage]} details={creativeDetails} pricePrefix=""
                onToggle={value => patch({ creativeOptions: { ...draft.creativeOptions, [stage]: toggleValue(draft.creativeOptions[stage as CreativeServiceId], value) } })} />
            ) : null}

            {stage === 'mentoring' ? (
              <ChoiceCards label="What would you like to learn?" options={mentoringTopics} selected={draft.mentoringTopics} details={mentoringDetails}
                showPrices={draft.mentoringPricingMode === 'package'} onToggle={value => toggleList('mentoringTopics', value)} />
            ) : null}

            {stage === 'mentoring-session' ? (
              <>
                <RadioCards label="Session pricing" name={`${id}-mentoring-mode`} selected={draft.mentoringPricingMode}
                  options={[{ id: 'hourly', label: 'By the hour', description: 'Start with one focused hour. Topics are included.' }, { id: 'package', label: 'Project package', description: '$100 base, plus the topics you choose.' }]}
                  onChange={mentoringPricingMode => patch({ mentoringPricingMode })} />
                {draft.mentoringPricingMode === 'hourly' ? (
                  <div className="servicesWidgetRanges">
                    <RangeField label="Hourly rate" min={20} max={50} step={5} value={draft.hourlyRate} display={`${money(draft.hourlyRate)} / hour`} onChange={hourlyRate => patch({ hourlyRate })} />
                    <RangeField label="Session hours" min={1} max={40} value={draft.mentoringHours} display={`${draft.mentoringHours} hour${draft.mentoringHours === 1 ? '' : 's'}`} onChange={mentoringHours => patch({ mentoringHours })} />
                  </div>
                ) : null}
              </>
            ) : null}

            {stage === 'marketing' ? (
              <><p className="servicesWidgetNote">Your $200 engagement starts with a focused growth plan. Add the tools and content you need.</p>
                <ChoiceCards label="Build your campaign" options={marketingCampaignOptions} selected={draft.marketingOptions} details={marketingDetails} onToggle={value => toggleList('marketingOptions', value)} /></>
            ) : null}

            {stage === 'marketing-tools' ? (
              <ChoiceCards label="Add tools and insights · optional" options={marketingToolOptions} selected={draft.marketingOptions} details={marketingDetails} onToggle={value => toggleList('marketingOptions', value)} />
            ) : null}

            {stage === 'build' ? (
              <ChoiceCards label="Where should your project live?" options={platformOptions} showPrices={false}
                selected={getBuildPlatforms(draft.buildTypes).map(platform => `${platform}-only`)}
                onToggle={value => patch({ buildTypes: toggleValue(getBuildPlatforms(draft.buildTypes).map(platform => `${platform}-only` as 'website-only' | 'mobile-only' | 'game-only'), value as 'website-only' | 'mobile-only' | 'game-only') })} />
            ) : null}
            {stage === 'build-pages' ? (
              <RadioCards<BuildPageCountId> label="Pages // Screens // Views" name={`${id}-pages`} selected={draft.buildPageCount}
                options={buildPageCounts.map(option => ({ ...option, description: `${money(getBuildScopePrice(option.id, draft.buildEffort))} per platform` }))}
                onChange={buildPageCount => patch({ buildPageCount })} />
            ) : null}
            {stage === 'build-detail' ? (
              <RadioCards<BuildEffortId> label="Level of detail" name={`${id}-effort`} selected={draft.buildEffort}
                options={buildEffortLevels} onChange={buildEffort => patch({ buildEffort })} />
            ) : null}
            {stage === 'video' && draft.creativeOptions.video.includes('game') && draft.selectedServices.includes('build') ? <p className="servicesWidgetNote">Your game shares scope and add-ons with your website or app. You’ll choose those together in the steps after Website // App.</p> : null}
            {addOnStep ? <ChoiceCards label="Make it yours · optional add-ons" options={addOnStep.options} selected={draft.buildFeatures} details={buildDetails} onToggle={value => toggleList('buildFeatures', value)} /> : null}
            {stage === 'build-care' ? (
              <RadioCards label="After launch" name={`${id}-care`} selected={draft.maintenance}
                options={[{ id: 'self', label: 'I’ll handle updates', description: 'Simple tools and a handoff. No ongoing care added.' }, { id: 'managed', label: 'Piratechs handles it', description: 'Request ongoing care, quoted separately.' }]}
                onChange={maintenance => patch({ maintenance })} />
            ) : null}

            {stage === 'payment' ? (
              <>
                <RadioCards label="Payment preference" name={`${id}-payment`} selected={draft.paymentMethod}
                  options={estimate.total ? [{ id: 'full', label: 'Pay in full', description: 'The lowest total cost. No financing fee.' }, { id: 'finance', label: 'Explore financing', description: 'See an illustrative payment schedule for review.' }] : [{ id: 'full', label: 'Free consultation', description: 'Talk through your idea with the crew.' }]}
                  onChange={paymentMethod => patch({ paymentMethod })} />
                {draft.paymentMethod === 'finance' ? (
                  <>
                    <div className="servicesWidgetRanges">
                      <RangeField label="Monthly target" min={5} max={350} step={5} value={draft.monthlyTarget} display={`${money(draft.monthlyTarget)} / month`} onChange={monthlyTarget => patch({ monthlyTarget })} />
                      <RangeField label="Down payment" min={0} max={estimate.total} value={draft.downPayment} display={money(draft.downPayment)} onChange={downPayment => patch({ downPayment })} />
                    </div>
                    <RadioCards label="Use my down payment to" name={`${id}-down-mode`} selected={draft.downPaymentMode}
                      options={[{ id: 'finish-sooner', label: 'Finish sooner', description: 'Keep the monthly target and shorten the term.' }, { id: 'lower-monthly', label: 'Lower monthly payments', description: 'Spread the remaining balance over the original term.' }]}
                      onChange={downPaymentMode => patch({ downPaymentMode })} />
                    <dl className="servicesWidgetFacts">
                      <div><dt>Projected payment</dt><dd>{money(payment.monthlyPayment)} / month</dd></div>
                      <div><dt>Term</dt><dd>{payment.months} months</dd></div>
                      <div><dt>Illustrative rate</dt><dd>{payment.interestRate.toFixed(1)}%</dd></div>
                      <div><dt>Financing fee</dt><dd>{money(payment.financeFee)}</dd></div>
                    </dl>
                    <p className="servicesWidgetNote">{payment.customReviewRequired ? 'This term exceeds 60 months and requires a custom payment review. ' : ''}Planning illustration only. Financing and final terms require review and an agreement.</p>
                  </>
                ) : null}
                <p className="servicesWidgetNote">{payment.completionWeeks ? `Projected delivery: ${payment.completionWeeks} weeks after kickoff. ${payment.cadence} updates.` : 'We’ll schedule your first conversation together.'}</p>
              </>
            ) : null}

            {stage === 'review' ? (
              <>
                <div className="servicesWidgetReview">
                  {estimate.groups.length ? estimate.groups.map(group => (
                    <details key={group.service}>
                      <summary>{group.label}<span>{group.items.length} item{group.items.length === 1 ? '' : 's'}</span></summary>
                      <ul>{group.items.map(item => <li key={item.id}>{item.label}</li>)}</ul>
                      {group.service === 'mentoring' && draft.mentoringPricingMode === 'hourly' ? <p>{mentoringTopics.filter(topic => draft.mentoringTopics.includes(topic.id)).map(topic => topic.label).join(' · ')}</p> : null}
                      <button type="button" className="servicesWidgetTextButton" onClick={() => go(group.service)}>Edit selections</button>
                    </details>
                  )) : <p className="servicesWidgetNote">A free consultation to find the right direction for your idea.</p>}
                </div>
                <p className="servicesWidgetNote">{draft.paymentMethod === 'full' ? 'Pay in full · no financing fee.' : `Financing requested · ${money(payment.monthlyPayment)} / month for ${payment.months} months, plus ${money(draft.downPayment)} down. Financing fee: ${money(payment.financeFee)}.`} {draft.maintenance === 'managed' && estimate.platforms.includes('website') ? 'Ongoing website care will be quoted separately.' : ''}</p>
                <label className="servicesWidgetName" htmlFor={`${id}-name`}>
                  <span>What’s your project called?</span>
                  <input id={`${id}-name`} ref={nameRef} name="projectName" autoComplete="off" type="text" required minLength={2} maxLength={80} aria-invalid={Boolean(state.status && draft.projectName.trim().length < 2)}
                    placeholder="e.g. North Star Studio" value={draft.projectName} onChange={event => patch({ projectName: event.target.value })} />
                  <small>One name for everything in this plan.</small>
                </label>
                <p className="servicesWidgetNote">This is a planning estimate. Adding a plan to your cart does not charge you.</p>
              </>
            ) : null}

            {stage === 'cart' ? (
              <>
                <p className="servicesWidgetNote">Saved in this session. Edit a plan to view its estimate and change any selection, or start another.</p>
                <ul className="servicesWidgetCart">
                  {state.cart.map(item => (
                    <li key={item.id}><i className="fa-solid fa-flag" aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.draft.selectedServices.length || 'Free consultation'}{item.draft.selectedServices.length ? ' services' : ''}</small></span>
                      <button type="button" className="servicesWidgetSecondary" onClick={() => dispatch({ type: 'edit', item })}>Edit<span className="servicesWidgetSrOnly"> {item.title}</span></button></li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
        <footer className="servicesWidgetFooter">
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
        </footer>
      </form>
    </section>
  );
}

export default HomeServiceEstimator;
