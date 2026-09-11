'use client';

import ElementReveal from '../effects/element-reveal';
import ServicePrice, { ServicePriceText } from './service-price';
import { useEffect, useId, useReducer, useRef, useState, type CSSProperties, type FormEvent, type ReactNode, type KeyboardEvent } from 'react';
import {
  buildFeatures, marketingOptions, buildEffortLevels, buildPageCounts, creativeOptions,
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

const EstimatorIcon = ({ icon }: { icon: string }) => (
  <i className={icon === `piratechs-drone` ? `piratechsDroneIcon` : `fa-solid gradientTextColor ${icon}`} aria-hidden={`true`} />
);

const getBreakdownIcon = (service: ServiceId, itemId: string) => {
  const options: readonly ServiceOption[] = service === `mentoring` ? mentoringTopics : service === `marketing` ? marketingOptions
    : service === `build` ? buildFeatures : isCreativeService(service) ? [...creativeOptions[service], ...buildFeatures] : [];
  const details = service === `mentoring` ? mentoringDetails : service === `marketing` ? marketingDetails : creativeDetails;
  if (itemId === `hourly-engagement`) return `fa-clock`;
  return options.find(option => option.id === itemId)?.icon ?? (details[itemId]?.[0] ? `fa-${details[itemId][0]}` : serviceCards.find(card => card.id === service)?.icon ?? `fa-layer-group`);
};

const PageGraphic = ({ pages }: { pages: number }) => {
  const columns = pages === 1 ? 1 : pages === 3 ? 3 : 4;
  const rows = Math.ceil(pages / columns);
  const width = (40 - (columns - 1) * 3) / columns;
  const height = Math.min(26, (32 - (rows - 1) * 3) / rows);
  const top = (36 - (rows * height + (rows - 1) * 3)) / 2;
  return (
    <svg className={`servicesWidgetPageGraphic`} viewBox={`0 0 44 36`} fill={`none`} aria-hidden={`true`} focusable={`false`}>
      {Array.from({ length: pages }, (_, index) => {
        const x = 2 + (index % columns) * (width + 3);
        const y = top + Math.floor(index / columns) * (height + 3);
        return <g key={index} stroke={`currentColor`} strokeWidth={1.2}>
          <rect x={x} y={y} width={width} height={height} rx={1.2} />
          <path d={`M${x} ${y + 3}h${width}`} opacity={0.5} />
        </g>;
      })}
    </svg>
  );
};

function ChoiceCards({
  label, heading, options, selected, onToggle, onSelectionChange, included = [], details = {}, showPrices = true, pricePrefix = '+', stage,
}: {
  label: string; heading: ReactNode; options: readonly ServiceOption[]; selected: readonly string[]; stage?: any;
  onToggle: (id: string) => void; onSelectionChange: (ids: string[]) => void; details?: Record<string, readonly [string, string]>;
  showPrices?: boolean; pricePrefix?: string; included?: readonly string[];
}) {
  const selectableIds = options.filter(option => !included.includes(option.id)).map(option => option.id);
  const retainedIds = selected.filter(id => !selectableIds.includes(id));
  const allOptionsSelected = selectableIds.length > 0 && selectableIds.every(id => selected.includes(id));
  const toggledIds = allOptionsSelected ? selectableIds.filter(id => selected.includes(id)) : selectableIds.filter(id => !selected.includes(id));
  const toggledCost = showPrices ? options.filter(option => toggledIds.includes(option.id)).reduce((total, option) => total + (option.price ?? 0), 0) : 0;
  return (
    <>
      <header className={`servicesWidgetStageHeading`}>
        {heading}
      <div className="servicesWidgetChoiceActions" aria-label={`${label} selection controls`}>
        <button type="button" aria-pressed={allOptionsSelected} disabled={!selectableIds.length}
          onClick={() => onSelectionChange(allOptionsSelected ? retainedIds : [...new Set([...retainedIds, ...selectableIds])])}>
          <i className={`fa-solid gradientTextColor ${allOptionsSelected ? `fa-xmark` : `fa-check-double`}`} aria-hidden="true" />
          <span>{allOptionsSelected ? `Deselect all` : `Select all`}</span>
          <strong className="servicesWidgetChoiceCost" data-direction={allOptionsSelected ? `remove` : `add`}>
            {allOptionsSelected ? `-${money(toggledCost)}` : `+${money(toggledCost)}`}
          </strong>
        </button>
      </div>
      </header>
      <fieldset className="servicesWidgetChoices">
        <legend className={`servicesWidgetInstruction`}>{label}</legend>
      <div className={`servicesWidgetCards serviceCards_${stage ? ` ${stage}` : ``}`} data-count={options.length}>
        {options.map(option => {
          const detail = details[option.id];
          const isIncluded = included.includes(option.id);
          return (
            <label className="servicesWidgetCard" data-selected={isIncluded || selected.includes(option.id)} data-included={isIncluded} aria-disabled={isIncluded} key={option.id}>
              <input type="checkbox" disabled={isIncluded} checked={isIncluded || selected.includes(option.id)} onChange={() => onToggle(option.id)} />
              <span className="servicesWidgetCardIcon" aria-hidden="true">
                <EstimatorIcon icon={option.icon ?? `fa-${detail?.[0] ?? `wand-magic-sparkles`}`} />
              </span>
              <span className="servicesWidgetCardCopy">
                <strong>{option.label}</strong>
                <span className={`servicesWidgetInstruction`}><ServicePriceText text={option.description ?? detail?.[1] ?? ``} /></span>
                {isIncluded ? <small>Included in plan</small> : showPrices && typeof option.price === `number` ? <small>{pricePrefix === `+` ? null : pricePrefix}<ServicePrice amount={option.price} /></small> : null}
              </span>
              <span className="servicesWidgetCheck" aria-hidden="true">
                <i className="fa-solid fa-check" />
              </span>
            </label>
          );
        })}
      </div>
      </fieldset>
    </>
  );
}

function RadioCards<Value extends string>({ label, name, options, selected, onChange, className, stage, heading }: {
  heading?: ReactNode;
  name: string; label: string; className?: string; selected: Value | null; onChange: (value: Value) => void; stage?: any;
  options: readonly { id: Value; label: string; icon?: string; pages?: number; description?: string }[];
}) {
  return (
    <fieldset className="servicesWidgetChoices">
      <legend className={heading ? `servicesWidgetSrOnly` : undefined}>{label}</legend>
      {heading ? <header className={`servicesWidgetStageHeading`}>
        {heading}
        <span className={`servicesWidgetStageLabel`} aria-hidden={`true`}>{label}</span>
      </header> : null}
      <div className={`servicesWidgetRadioCards stageRadios_${stage ?? ``} radios_${className ?? ``}`} data-count={options.length}>
        {options.map(option => (
          <label className="servicesWidgetRadio" data-selected={selected === option.id} key={option.id}>
            <input type="radio" name={name} checked={selected === option.id} onChange={() => onChange(option.id)} />
            <span className={`servicesWidgetRadioGraphic`} aria-hidden={`true`}>
              {option.pages ? <PageGraphic pages={option.pages} /> : <EstimatorIcon icon={option.icon ?? `fa-layer-group`} />}
            </span>
            <span className={`servicesWidgetRadioCopy`}><strong>{option.label}</strong>{option.description ? <small><ServicePriceText text={option.description} /></small> : null}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RangeField({ label, value, min, max, step = 1, prefix = ``, suffix = ``, icon = `fa-sliders`, disabled = false, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; prefix?: string; suffix?: string; icon?: string; disabled?: boolean; onChange: (value: number) => void;
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
        <label htmlFor={`${id}-value`}><EstimatorIcon icon={icon} />{label}</label>
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

export function HomeServiceEstimator({ instructions = false, initialItem, onAddToCart, onUpdateCart, renderServiceSelection, onStageChange }: HomeServiceEstimatorProps = {}) {
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
      dispatch({ type: 'status', message: `Project Name` });
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

  const panelTitle = stage === `cart` ? `Your saved plans` : instructions ? currentStep?.title : currentStep?.label;
  const radioStage = [`build-care`, `build-pages`, `build-detail`, `mentoring-session`].includes(stage);
  const choiceStage = isCreativeService(stage) || [`services`, `mentoring`, `marketing`, `marketing-tools`].includes(stage) || Boolean(addOnStep);
  const stageHeading = <h3 ref={headingRef} tabIndex={-1}><EstimatorIcon icon={currentStep?.icon ?? `fa-cart-shopping`} /><span>{panelTitle}</span></h3>;
  const toggleService = (service: ServiceId) => patch({ selectedServices: toggleValue(draft.selectedServices, service) });

  if (stage === 'services' && renderServiceSelection) {
    return renderServiceSelection({ selectedServices: draft.selectedServices, onToggle: toggleService, onStart: () => go(flow[1].id) });
  }

  return (
    <section className="servicesWidget" data-instructions={instructions} aria-label="Service estimator">
      <header className="servicesWidgetHeader">
        {/* <div className="servicesWidgetBrand">
          <i className={`piratechsSailIcon`} aria-hidden={`true`} />
          <span>
            Estimator
            <small className={`servicesWidgetInstruction`}>
              {selectedCards.length ? `${selectedCards.length} service${selectedCards.length === 1 ? '' : 's'} selected` : 'Choose Services'}
            </small>
          </span>
        </div> */}
        <div className="servicesWidgetTabs" role="tablist" aria-label="Project steps" ref={tabsRef}>
          {tabs.map((tab, index) => (
            <button type="button" role="tab" id={`${id}-tab-${tab.id}`} aria-controls={`${id}-panel-${tab.id}`}
              aria-selected={stage === tab.id} tabIndex={stage === tab.id ? 0 : -1} key={tab.id}
              onClick={() => go(tab.id)} onKeyDown={event => onTabKeyDown(event, index)}>
              <EstimatorIcon icon={tab.icon} />{tab.label}
            </button>
          ))}
        </div>
        <div className="servicesWidgetEstimate">
          <span>Price</span>
          <output aria-live="polite" aria-atomic="true" aria-label="Planning estimate; final price may be higher">
            <ServicePrice amount={estimate.total} />
          </output>
        </div>
      </header>

      <form className="servicesWidgetForm" onSubmit={submit} noValidate>
        <div className="servicesWidgetScroll" ref={scrollRef}>
          <div className={`servicesWidgetStage stage_${stage ?? ``}`} role="tabpanel" id={`${id}-panel-${stage}`} aria-labelledby={`${id}-tab-${stage}`} key={stage}>
            {!choiceStage && !radioStage && <header className={`servicesWidgetStageHeading`}>{stageHeading}</header>}

            {stage === 'services' ? (
              <ChoiceCards stage={stage} heading={stageHeading} label="Select your services" options={serviceCards} selected={draft.selectedServices} pricePrefix="From "
                onToggle={value => toggleService(value as ServiceId)} onSelectionChange={selectedServices => patch({ selectedServices: selectedServices as ServiceId[] })} />
            ) : null}

            {isCreativeService(stage) ? (
              <ChoiceCards stage={stage} heading={stageHeading} label="Choose what you need" options={creativeOptions[stage]} selected={draft.creativeOptions[stage]} details={creativeDetails} pricePrefix="" included={getIncludedServiceOptions(draft, stage)}
                onToggle={value => patch({ creativeOptions: { ...draft.creativeOptions, [stage]: toggleValue(draft.creativeOptions[stage as CreativeServiceId], value) } })}
                onSelectionChange={values => patch({ creativeOptions: { ...draft.creativeOptions, [stage]: values } })} />
            ) : null}

            {stage === 'mentoring' ? (
              <ChoiceCards stage={stage} heading={stageHeading} label="What would you like to learn?" options={mentoringTopics} selected={draft.mentoringTopics} details={mentoringDetails}
                showPrices={draft.mentoringPricingMode === 'package'} onToggle={value => toggleList('mentoringTopics', value)}
                onSelectionChange={values => patch({ mentoringTopics: values as ServiceEstimatorDraft['mentoringTopics'] })} />
            ) : null}

            {stage === 'mentoring-session' ? (
              <>
                <RadioCards stage={stage} heading={stageHeading} label="Session pricing" name={`${id}-mentoring-mode`} selected={draft.mentoringPricingMode}
                  options={[{ id: `hourly`, icon: `fa-clock`, label: `By the hour`, description: `Topics included` }, { id: `package`, icon: `fa-box-open`, label: `Project package`, description: `$100 + selected topics` }]}
                  onChange={mentoringPricingMode => patch({ mentoringPricingMode })} />
                {draft.mentoringPricingMode === 'hourly' ? (
                  <div className="servicesWidgetRanges">
                    <RangeField label="Hourly rate" icon={`fa-coins`} min={20} max={50} step={5} value={draft.hourlyRate} prefix="$" suffix="/ hr" onChange={hourlyRate => patch({ hourlyRate })} />
                    <RangeField label="Session hours" icon={`fa-clock`} min={1} max={40} value={draft.mentoringHours} onChange={mentoringHours => patch({ mentoringHours })} />
                  </div>
                ) : null}
              </>
            ) : null}

            {stage === 'marketing' ? (
              <><ChoiceCards stage={stage} heading={stageHeading} label="Build your campaign" options={marketingCampaignOptions} selected={draft.marketingOptions} details={marketingDetails} included={getIncludedServiceOptions(draft, 'marketing')}
                  onToggle={value => toggleList('marketingOptions', value)} onSelectionChange={values => patch({ marketingOptions: values as ServiceEstimatorDraft['marketingOptions'] })} />
                <p className="servicesWidgetNote"><ServicePrice amount={200} /> base engagement</p></>
            ) : null}

            {stage === 'marketing-tools' ? (
              <ChoiceCards stage={stage} heading={stageHeading} label="Add tools and insights · optional" options={marketingToolOptions} selected={draft.marketingOptions} details={marketingDetails} included={getIncludedServiceOptions(draft, 'marketing')}
                onToggle={value => toggleList('marketingOptions', value)} onSelectionChange={values => patch({ marketingOptions: values as ServiceEstimatorDraft['marketingOptions'] })} />
            ) : null}

            {stage === 'build-pages' ? (
              <RadioCards<BuildPageCountId> stage={stage} heading={stageHeading} label="Pages // Screens // Views" name={`${id}-pages`} selected={draft.buildPageCount}
                options={buildPageCounts.map(option => ({ ...option, description: `${money(getBuildScopePrice(option.id, draft.buildEffort, draft.buildPackage))}` }))}
                onChange={buildPageCount => patch({ buildPageCount })} className={`webAppServices`} />
            ) : null}
            {stage === 'build-detail' ? (
              <>
                <RadioCards<BuildEffortId> stage={stage} heading={stageHeading} label="Level of detail" name={`${id}-effort`} selected={draft.buildEffort}
                  options={buildEffortLevels.map(option => ({ ...option, description: instructions ? option.description : undefined }))} onChange={buildEffort => patch({ buildEffort })} />
                <RadioCards<BuildPackageId> stage={stage} label="Your package" name={`${id}-package`} selected={draft.buildPackage ?? 'essential'}
                  options={buildPackages.map(option => ({ ...option, description: `${money(getBuildScopePrice(draft.buildPageCount, draft.buildEffort, option.id))}${option.id === 'complete' && draft.buildEffort !== 'simple' ? '+' : ''} · ${getIncludedBuildFeatures({ ...draft, buildPackage: option.id }).length} included features` }))}
                  onChange={buildPackage => patch({ buildPackage })} />
                <p className={`servicesWidgetNote servicesWidgetInstruction`}>Package prices reflect your selected page count. Included features are ready in the following tabs. Mobile App is an optional flat $150 add-on. Other optional extras add to the estimate; ongoing services are quoted separately.</p>
              </>
            ) : null}
            {stage === 'video' && draft.creativeOptions.video.includes('game') && draft.selectedServices.includes('build') ? <p className={`servicesWidgetNote servicesWidgetInstruction`}>Your game shares scope and add-ons with your website or app. You’ll choose those together in Pages, Detail, and the add-on tabs.</p> : null}
            {addOnStep ? <ChoiceCards stage={stage} heading={stageHeading} label="Make it yours · optional add-ons" options={addOnStep.options} selected={draft.buildFeatures} included={getIncludedBuildFeatures(draft)} details={buildDetails}
              onToggle={value => toggleList('buildFeatures', value)} onSelectionChange={values => patch({ buildFeatures: values as ServiceEstimatorDraft['buildFeatures'] })} /> : null}
            {stage === 'build-care' ? (
              <RadioCards stage={stage} heading={stageHeading} label="After launch" name={`${id}-care`} selected={draft.maintenance} className="servicesWidgetCareChoices"
                options={[{ id: `self`, icon: `fa-user-gear`, label: `I’ll handle updates`, description: `No ongoing care added` }, { id: `managed`, icon: `fa-life-ring`, label: `Piratechs handles it`, description: `Ongoing care · Quoted separately` }]}
                onChange={maintenance => patch({ maintenance })} />
            ) : null}

            {stage === 'payment' ? (
              <>
                {estimate.total ? (
                  <>
                    <div className={`servicesWidgetRanges servicesWidgetPaymentRanges`}>
                      <RangeField label="Term (months)" icon={`fa-calendar-days`} min={payment.principal ? 2 : 0} max={120} value={payment.months} disabled={!payment.principal}
                        onChange={financeTermMonths => patch({ financeTermMonths, financingControl: 'term' })} />
                      <RangeField label="Monthly payment" icon={`fa-wallet`} min={payment.principal ? 1 : 0} max={payment.principal} step={0.01} value={payment.monthlyPayment} prefix="$" disabled={!payment.principal}
                        onChange={monthlyTarget => patch({ monthlyTarget, financingControl: 'monthly' })} />
                      <RangeField label="Down payment" icon={`fa-coins`} min={0} max={estimate.total} value={draft.downPayment} prefix="$"
                        onChange={downPayment => patch({ downPayment })} />
                    </div>
                    <p className={`servicesWidgetNote servicesWidgetInstruction`}>Drag a slider or type an exact value, then press Enter or leave the field to recalculate. Move the down payment to the full estimate to pay in full with no financing fee. Maximum financed term: 120 months (10 years).</p>
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
                    <div className={`servicesWidgetReviewItem`} key={group.service}>
                      <details>
                        <summary>
                          <ServicePrice amount={group.total} />
                          <span className={`servicesWidgetReviewTitle`}>
                            <span className={`servicesWidgetReviewService`}><EstimatorIcon icon={serviceCards.find(service => service.id === group.service)?.icon ?? `fa-layer-group`} /><strong>{group.label}</strong></span>
                            <small>{group.items.length} item{group.items.length === 1 ? `` : `s`}</small>
                          </span>
                          <button type={`button`} className={`servicesWidgetTextButton servicesWidgetReviewEdit`} aria-label={`Edit ${group.label}`} onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            go(group.service);
                          }}><EstimatorIcon icon={`fa-pen`} />Edit</button>
                          <i className={`fa-solid fa-chevron-down gradientTextColor servicesWidgetReviewChevron`} aria-hidden={`true`} />
                        </summary>
                        <ul className={`servicesWidgetReviewLines`}>{group.items.map(item => (
                          <li key={item.id}>
                            <span className={`servicesWidgetReviewLineLabel`}>
                              <span className={`servicesWidgetReviewLineIcon`} aria-hidden={`true`}>
                                {item.id === `website-package` ? <PageGraphic pages={buildPageCounts.find(option => option.id === draft.buildPageCount)?.pages ?? 1} /> : <EstimatorIcon icon={getBreakdownIcon(group.service, item.id)} />}
                              </span>
                              <span>{item.label}</span>
                            </span>
                            <span>{item.amount === 0 ? `Included` : <ServicePrice amount={item.amount} />}</span>
                          </li>
                        ))}</ul>
                        {group.service === `mentoring` && draft.mentoringPricingMode === `hourly` ? <div className={`servicesWidgetReviewTopics`}>
                          {mentoringTopics.filter(topic => draft.mentoringTopics.includes(topic.id)).map(topic => <span key={topic.id}><EstimatorIcon icon={getBreakdownIcon(`mentoring`, topic.id)} />{topic.label}</span>)}
                        </div> : null}
                      </details>
                    </div>
                  )) : <p className="servicesWidgetNote">A free consultation to find the right direction for your idea.</p>}
                </div>
                <p className="servicesWidgetNote">{estimate.isFreeConsultation ? 'Free consultation · no payment needed.' : payment.method === 'full' ? 'Pay in full · no financing fee.' : `Financing requested · ${paymentMoney(payment.monthlyPayment)} / month for ${payment.months} months, plus ${money(draft.downPayment)} down. Financing fee: ${money(payment.financeFee)}.`} {draft.maintenance === 'managed' && estimate.platforms.includes('website') ? 'Ongoing website care will be quoted separately.' : ''}</p>
                <label className="servicesWidgetName" htmlFor={`${id}-name`}>
                  <span>What’s your project called?</span>
                  <input id={`${id}-name`} ref={nameRef} name="projectName" autoComplete="off" type="text" required minLength={2} maxLength={80} aria-invalid={Boolean(state.status && draft.projectName.trim().length < 2)}
                    placeholder="e.g. North Star Studio or n/a" value={draft.projectName} onChange={event => patch({ projectName: event.target.value })} />
                  <small className={`servicesWidgetInstruction`}>One name for everything in this plan. Enter n/a if you don’t have one yet.</small>
                </label>
                <p className="servicesWidgetNote">This is a planning estimate. Adding a plan to your cart does not charge you.</p>
              </>
            ) : null}

            {stage === 'cart' ? (
              <>
                <p className={`servicesWidgetNote servicesWidgetInstruction`}>Saved in this session. Edit a plan to view its estimate and change any selection, or start another.</p>
                <ul className="servicesWidgetCart">
                  {state.cart.map(item => (
                    <li key={item.id}>
                      <details>
                        <summary>
                          <i className={`fa-solid fa-flag gradientTextColor`} aria-hidden={`true`} />
                          <span className={`servicesWidgetCartTitle`}>
                            <strong>{item.title}</strong>
                            <small>{item.estimate.groups.map(group => group.label).join(` · `) || `Free consultation`}</small>
                          </span>
                          <strong className={`servicesWidgetCartPrice`}><ServicePrice amount={item.estimate.total} /></strong>
                          <i className={`fa-solid fa-chevron-down servicesWidgetCartChevron`} aria-hidden={`true`} />
                        </summary>
                        <div className={`servicesWidgetCartDetails`}>
                          {item.estimate.groups.length ? item.estimate.groups.map(group => (
                            <section className={`servicesWidgetCartGroup`} key={group.service} aria-label={group.label}>
                              <h4>{group.label}<ServicePrice amount={group.total} /></h4>
                              <ul>{group.items.map(selection => (
                                <li key={selection.id}><span>{selection.label}</span><span>{selection.amount ? <ServicePrice amount={selection.amount} /> : `Included`}</span></li>
                              ))}</ul>
                              {group.service === `mentoring` ? <p>{mentoringTopics.filter(topic => item.draft.mentoringTopics.includes(topic.id)).map(topic => topic.label).join(` · `)}</p> : null}
                              {!group.items.length ? <p>A free conversation to plan your next steps.</p> : null}
                            </section>
                          )) : <p className={`servicesWidgetNote`}>A free consultation to find the right direction for your idea.</p>}
                          <dl className={`servicesWidgetFacts`}>
                            <div><dt>Payment</dt><dd>{!item.estimate.total ? `Free consultation` : item.payment.method === `full` ? `Pay in full` : `${paymentMoney(item.payment.monthlyPayment)} / month for ${item.payment.months} months`}</dd></div>
                            {item.payment.method === `finance` ? <div><dt>Down payment · Financing fee</dt><dd>{money(item.draft.downPayment)} · {paymentMoney(item.payment.financeFee)}</dd></div> : null}
                            {item.estimate.platforms.includes(`website`) ? <div><dt>After launch</dt><dd>{item.draft.maintenance === `managed` ? `Managed care · Quoted separately` : `Self-managed`}</dd></div> : null}
                          </dl>
                          <button type={`button`} className={`servicesWidgetSecondary`} onClick={() => dispatch({ type: `edit`, item })}>
                            <i className={`fa-solid fa-pen gradientTextColor`} aria-hidden={`true`} /> Edit selections<span className={`servicesWidgetSrOnly`}> for {item.title}</span>
                          </button>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
        <ElementReveal onScroll as={`footer`} y={10} delay={0.04} duration={0.42} className={`servicesWidgetFooter`}>
          <p className="servicesWidgetStatus" role="status" aria-live="polite">{state.status || (stage === 'cart' ? `${state.cart.length} saved plan${state.cart.length === 1 ? '' : 's'}` : `Step ${stageIndex + 1} of ${flow.length}${state.editingId ? ' · Editing plan' : ''}`)}</p>
          <div className="servicesWidgetActions">
            {stage === 'cart' ? <button type="button" className={`servicesWidgetPrimary serviceLiquidButton`} data-ready={true} onClick={() => dispatch({ type: 'new' })}>Create another plan<i className="fa-solid fa-plus" aria-hidden="true" /></button> : (
              <>
                {stageIndex > 0 ? <button type="button" className={`servicesWidgetSecondary serviceLiquidButton`} data-ready={true} onClick={() => go(flow[stageIndex - 1].id)} aria-label="Previous step"><i className={`fa-solid fa-chevron-left gradientTextColor`} aria-hidden="true" /></button>
                  : <button type="button" className={`servicesWidgetSecondary serviceLiquidButton`} data-ready={true} onClick={() => dispatch({ type: 'new' })} aria-label="Clear selections and start over"><i className="fa-solid fa-rotate-left" aria-hidden="true" /></button>}
                {stage === 'review' ? <button type="submit" className={`servicesWidgetPrimary serviceLiquidButton`} data-ready={true}><i className="fa-solid fa-cart-plus" aria-hidden="true" />{state.editingId ? 'Update Cart' : 'Add to Cart'}</button>
                  : <button type="button" className={`servicesWidgetPrimary serviceLiquidButton`} data-ready={true} onClick={() => go(flow[stageIndex + 1].id)}>{stage === 'services' && estimate.isFreeConsultation ? 'Free consultation' : stage === 'payment' ? 'Review plan' : 'Continue'}<i className={`fa-solid fa-chevron-right gradientTextColor`} aria-hidden="true" /></button>}
              </>
            )}
          </div>
        </ElementReveal>
      </form>
    </section>
  );
}

export default HomeServiceEstimator;
