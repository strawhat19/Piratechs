import { getRandomColor } from '../common/database/constants';

export const usedColorNames = new Set<string>();

export const colors = {
  info: { name: `info`, color: `var(--primary)`, type: `dark`, },
  error: { name: `error`, color: `var(--error)`, type: `dark`, },
  success: { name: `success`, color: `var(--success)`, type: `dark`, },
  warning: { name: `warning`, color: `var(--warning)`, type: `light`, },
  disabled: { name: `disabled`, color: `var(--disabled)`, type: `light`, },
}

export const getRandomUnusedColor = (array: any[] = Object.values(colors)) => {
  if (!array?.length) return null;
  if (usedColorNames.size >= array.length) {
    usedColorNames.clear();
  }
  const availableColors = array.filter(color => !usedColorNames.has(color?.name));
  const selectedColor = getRandomColor(availableColors);
  if (selectedColor?.name) {
    usedColorNames.add(selectedColor.name);
  }
  return selectedColor;
};