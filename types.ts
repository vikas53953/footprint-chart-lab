export type Side = "buy" | "sell"; // aggressor side

export interface PriceLevel {
  price: number; // tick-rounded
  buyVol: number; // market buys hitting the ask
  sellVol: number; // market sells hitting the bid
  trades: number;
}

export interface FootprintBar {
  symbol: string;
  tfMs: number; // bar length in ms, e.g. 60000
  openTime: number; // epoch ms, bar start
  open: number;
  high: number;
  low: number;
  close: number;
  levels: Map<number, PriceLevel>; // key = price
  delta: number; // sum(buyVol - sellVol)
  totalVol: number;
  closed: boolean;
}

export function onTrade(bar: FootprintBar, p: number, q: number, side: Side): void {
  const lv = bar.levels.get(p) ?? { price: p, buyVol: 0, sellVol: 0, trades: 0 };
  if (side === "buy") lv.buyVol += q;
  else lv.sellVol += q;
  lv.trades++;
  bar.levels.set(p, lv);
  bar.delta += side === "buy" ? q : -q;
  bar.totalVol += q;
  bar.high = Math.max(bar.high, p);
  bar.low = Math.min(bar.low, p);
  bar.close = p;
}
