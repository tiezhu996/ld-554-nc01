export function money(value: number | string) {
  return Number(value).toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' });
}

export function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}
