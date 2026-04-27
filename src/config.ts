export type OlxConfig = {
  searchParams: Array<{ key: string; value: string }>;
  referer: string;
};

export type OtodomConfig = {
  path: string;
  query: string;
};

export type SearchConfig = {
  olx?: OlxConfig;
  otodom?: OtodomConfig;
};

export const olxSearches: OlxConfig[] = [
  {
    searchParams: [
      { key: 'offset', value: '0' },
      { key: 'limit', value: '40' },
      { key: 'query', value: 'jagodno mieszkanie' },
      { key: 'category_id', value: '1307' },
      { key: 'region_id', value: '3' },
      { key: 'city_id', value: '19701' },
      { key: 'filter_float_m:from', value: '40' },
      { key: 'filter_float_m:to', value: '80' },
      { key: 'suggest_filters', value: 'true' },
    ],
    referer:
      'https://www.olx.pl/nieruchomosci/mieszkania/q-jagodno/?search%5Bfilter_float_m:from%5D=40&search%5Bfilter_float_m:to%5D=80',
  },
  {
    searchParams: [
      { key: 'offset', value: '0' },
      { key: 'limit', value: '40' },
      { key: 'query', value: 'jagodno mieszkanie' },
      { key: 'category_id', value: '15' },
      { key: 'region_id', value: '3' },
      { key: 'city_id', value: '19701' },
      { key: 'filter_float_m:from', value: '40' },
      { key: 'suggest_filters', value: 'true' },
    ],
    referer: 'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/q-jagodno/?search%5Bfilter_float_m:from%5D=40',
  },
  {
    searchParams: [
      { key: 'offset', value: '0' },
      { key: 'limit', value: '40' },
      { key: 'category_id', value: '1307' },
      { key: 'region_id', value: '3' },
      { key: 'city_id', value: '28743' },
      { key: 'filter_float_m:from', value: '40' },
      { key: 'suggest_filters', value: 'true' },
    ],
    referer: 'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/q-jagodno/?search%5Bfilter_float_m:from%5D=40',
  },
  {
    searchParams: [
      { key: 'offset', value: '0' },
      { key: 'limit', value: '40' },
      { key: 'category_id', value: '2331' },
      { key: 'filter_enum_dogage[0]', value: 'young' },
      { key: 'suggest_filters', value: 'true' },
    ],
    referer: 'https://www.olx.pl/zwierzeta/psy/psy-rasowe/golden-retriever/?search%5Bfilter_enum_dogage%5D%5B0%5D=young',
  },
  {
    searchParams: [
      { key: 'offset', value: '0' },
      { key: 'limit', value: '40' },
      { key: 'category_id', value: '2337' },
      { key: 'filter_enum_dogage[0]', value: 'young' },
      { key: 'suggest_filters', value: 'true' },
    ],
    referer: 'https://www.olx.pl/zwierzeta/psy/psy-rasowe/maltanczyk/?search%5Bfilter_enum_dogage%5D%5B0%5D=young',
  },
];

export const otodomSearches: OtodomConfig[] = [
  {
    path: 'sprzedaz/mieszkanie/dolnoslaskie/wroclaw/wroclaw/wroclaw/krzyki/jagodno',
    query:
      'limit=36&ownerTypeSingleSelect=ALL&areaMin=40&roomsNumber=%5BTWO%2CTHREE%5D&priceMin=500000&by=LATEST&direction=DESC&searchingCriteria=sprzedaz&searchingCriteria=mieszkanie&searchingCriteria=dolnoslaskie&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=krzyki&searchingCriteria=jagodno',
  },
  {
    path: 'wynajem/mieszkanie/dolnoslaskie/wroclaw/wroclaw/wroclaw/krzyki/jagodno',
    query:
      'limit=36&areaMin=40&roomsNumber=%5BTWO%2CTHREE%5D&priceMin=2500&by=LATEST&direction=DESC&searchingCriteria=wynajem&searchingCriteria=mieszkanie&searchingCriteria=dolnoslaskie&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=krzyki&searchingCriteria=jagodno',
  },
  {
    path: 'sprzedaz/mieszkanie/dolnoslaskie/karkonoski/karpacz/karpacz',
    query:
      'ownerTypeSingleSelect=ALL&by=DEFAULT&direction=DESC&searchingCriteria=sprzedaz&searchingCriteria=mieszkanie&searchingCriteria=dolnoslaskie&searchingCriteria=karkonoski&searchingCriteria=karpacz&searchingCriteria=karpacz',
  },
  {
    path: 'wynajem/mieszkanie/dolnoslaskie/karkonoski/karpacz/karpacz',
    query:
      'by=DEFAULT&direction=DESC&searchingCriteria=wynajem&searchingCriteria=mieszkanie&searchingCriteria=dolnoslaskie&searchingCriteria=karkonoski&searchingCriteria=karpacz&searchingCriteria=karpacz',
  },
];

export const searches: SearchConfig[] = [
  ...olxSearches.map(olx => ({ olx })),
  ...otodomSearches.map(otodom => ({ otodom })),
];

