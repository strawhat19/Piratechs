import { money } from './service-estimator-model';

export default function ServicePrice({ amount, plus = true }: { amount: number; plus?: boolean }) {
  return (
    <span className={`servicePrice`} title={plus ? `Planning estimate; final price may be higher` : undefined}>
      <span className={`gradientTextColor`}>$</span><span className={`servicePriceAmount`}>{money(amount).replace(`$`, ``)}</span>
      {plus ? <i className={`fa-solid fa-plus gradientTextColor servicePricePlus`} aria-hidden={`true`} /> : null}
    </span>
  );
}

export const ServicePriceText = ({ text }: { text: string }) => (
  <>{text.split(/(\$\d[\d,]*(?:\.\d+)?(?:\s*\+)?)/g).map((part, index) => part.startsWith(`$`)
    ? <ServicePrice key={index} amount={Number(part.replace(/[^\d.]/g, ``))} />
    : part)}</>
);
