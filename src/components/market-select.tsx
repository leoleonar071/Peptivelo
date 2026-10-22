"use client";
import { useState } from "react";
import Image from "next/image";
import { markets, type Market } from "@/lib/offers";

export function MarketSelect({ initialMarket }: { initialMarket: Market }) {
  const [market, setMarket] = useState(initialMarket);
  return (
    <div className="offer-field">
      <label htmlFor="offer-market">Delivery destination</label>
      <div className="offer-market-select">
        <Image src={`/images/flags/${market.toLowerCase()}.svg`} width={24} height={18} alt="" aria-hidden="true" unoptimized />
        <select id="offer-market" name="market" value={market} onChange={(event) => setMarket(event.target.value as Market)}>
          {Object.entries(markets).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
        </select>
      </div>
    </div>
  );
}
