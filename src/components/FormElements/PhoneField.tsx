"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { Select } from "./Select";
import { TextField } from "./TextField";
import { useGeolocation } from "@/context/geolocation";
import { PhoneCode, phoneCodes } from "@/data/countries";
import { Registered } from "@/hooks/useForm";

interface Props extends Registered<string> {
  className?: string;
  innerClassName?: string;
  size?: 3 | 5;
  placeholder?: string;
  name?: string;
  codeWithFlag?: boolean;
  autoFocus?: boolean;
}

export const parsePhone = (phone: string) => {
  const countries = phoneCodes.filter((c) =>
    phone.startsWith(`+${c.phone_code}`)
  );
  const country: PhoneCode | undefined = countries[0];
  const number = phone
    .replace(`+${country?.phone_code}`, "")
    .trim()
    .replace(/[^0-9-+\(\)]/, "");
  const phoneCode: string | undefined = country?.phone_code;
  return {
    countries,
    number,
    phoneCode,
  };
};

export const PhoneField: FC<Props> = ({
  value = "",
  onChange,
  innerClassName,
  size = 5,
  codeWithFlag,
  ...props
}) => {
  const { geolocation } = useGeolocation();

  const possibleCurrentCountries = phoneCodes.filter((country) =>
    value.startsWith(`+${country.phone_code}`)
  );
  const [clickedCountry, setClickedCountry] = useState("");
  const currentCountry =
    possibleCurrentCountries.find((i) => i.country_code === clickedCountry) ??
    possibleCurrentCountries[0];

  const number = value.replace(`+${currentCountry?.phone_code}`, "");

  useEffect(() => {
    if (!geolocation?.country || !geolocation?.country_calling_code || value)
      return;

    onChange(geolocation.country_calling_code);
    setClickedCountry(geolocation.country);
  }, [geolocation]);

  return (
    <TextField
      {...props}
      innerClassName={[size === 5 ? "pl-3" : "", innerClassName].join(" ")}
      size={size}
      value={codeWithFlag ? number : value}
      onChange={(v) => {
        v = v.startsWith("0") ? v.replace("0", "") : v;
        const next = parsePhone(v);
        if (next.number && next.number.length > 11) return;
        if (next.phoneCode)
          onChange(`+${next.phoneCode}${next.number && ` ${next.number}`}`);
        else if (v.startsWith("+")) onChange(v);
        else if (currentCountry)
          onChange(
            `+${currentCountry?.phone_code}${
              next.number && ` ${next.number.replace("+", "")}`
            }`
          );
        else onChange(v);
      }}
      Icon1={
        <div className="-mx-3 border-r h-5 flex items-center my-2">
          <Select
            absoluteDrop
            renderOnlyWhenOpen
            floating
            variant={2}
            emptyState={<div className="text-gray-500">NA</div>}
            options={phoneCodes}
            value={
              currentCountry
                ? `${currentCountry.phone_code}---${currentCountry.country_code}`
                : ""
            }
            identifier={({ item }) =>
              `${item.phone_code}---${item.country_code}`
            }
            onChange={(item) => {
              const [phone_code, country_code] = item.split("---");
              setClickedCountry(country_code);
              onChange(
                currentCountry
                  ? value.replace(
                      `+${currentCountry?.phone_code}`,
                      `+${phone_code}`
                    )
                  : `+${phone_code}${number.replace("+", "")}`
              );
            }}
            RenderSelected={({ item }) => (
              <div className="flex items-center gap-2 min-w-[30px] md:min-w-[60px]">
                <Image
                  unoptimized
                  alt={item.name}
                  width={30}
                  height={15}
                  src={`/flags/${item.country_code.toLowerCase()}.svg`}
                  className="rounded"
                />
                <p className="font-semibold hidden md:flex">
                  {item.country_code}
                </p>
                {codeWithFlag && (
                  <p className="hidden md:flex">+{item.phone_code}</p>
                )}
              </div>
            )}
            Render={({ item }) => (
              <div className="flex items-center gap-2">
                <Image
                  unoptimized
                  alt={item.name}
                  width={30}
                  height={15}
                  src={`/flags/${item.country_code.toLowerCase()}.svg`}
                  className="rounded"
                />
                <p className="whitespace-nowrap">{item.name}</p>
                <p className="whitespace-nowrap">(+{item.phone_code})</p>
              </div>
            )}
            searchBy={({ item }, search) =>
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.country_code.toLowerCase().includes(search.toLowerCase()) ||
              `+${item.phone_code.toLowerCase()}`.includes(search.toLowerCase())
            }
          />
        </div>
      }
    />
  );
};
