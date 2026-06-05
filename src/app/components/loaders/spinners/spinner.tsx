import { CircularProgress } from '@mui/material';

export default function Spinner({ ...params }: any) {
  return (
    <div className={`spinnerComponent`} style={{ maxHeight: params?.size ?? 0 }}>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={`var(--piratechsTeal)`} />
            <stop offset="100%" stopColor={`var(--piratechsNeon)`} />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        {...params}
        aria-label={`Loading…`}
        sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
      />
    </div>
  );
}