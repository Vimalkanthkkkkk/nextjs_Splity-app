"use client";

import { useState } from "react";

const currencies = [
  { code: "INR", name: "Indian Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "AED", name: "UAE Dirham" },
  { code: "GBP", name: "British Pound" },
  { code: "AFN", name: "Afghan Afghani" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "QAR", name: "Qatari Riyal" },
];

type CurrencySelectProps = {
  currency?: string;
};

export default function CurrencySelect({ currency: initialCurrency = "INR" }: CurrencySelectProps) {
  const [currency, setCurrency] = useState(initialCurrency);

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-600">
        Home Currency
      </span>

      <input
        type="hidden"
        name="currency"
        value={currency}
      />

      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="
          focus:*:bg-gray-400
          hover:bg-gray-500
          mb-2
          text-center
          duration-400
          px-2
          w-max
          max-h-max
          wrap-anywhere
          bg-gray-300
          text-black
          rounded-sm
          [appearance:base-select]
          [&_::picker(select)]:[appearance:base-select]
        "
      >
        {currencies.map((item) => (
          <option className="text-left text-white" key={item.code} value={item.code}>
            {item.code} — {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}