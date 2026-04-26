export type OlxConfig = {
  searchParams: Array<{ key: string; value: string }>;
  referer: string;
};

export type OtodomConfig = {
  path: string;
  query: string;
};

export type SearchConfig = {
  type: string; // klucz deduplikacji w DB, np. 'buy', 'rent'
  olx?: OlxConfig;
  otodom?: OtodomConfig;
};

export const searches: SearchConfig[] = [
  {
    type: 'buy',
    olx: {
      searchParams: [
        { key: 'offset', value: '0' },
        { key: 'limit', value: '40' },
        { key: 'query', value: 'jagodno' },
        { key: 'category_id', value: '1307' },
        { key: 'filter_float_m:from', value: '50' },
        { key: 'filter_float_m:to', value: '80' },
        { key: 'suggest_filters', value: 'true' },
      ],
      referer:
        'https://www.olx.pl/nieruchomosci/mieszkania/q-jagodno/?search%5Bfilter_float_m:from%5D=50&search%5Bfilter_float_m:to%5D=80',
    },
    otodom: {
      path: 'sprzedaz/mieszkanie/dolnoslaskie/wroclaw/wroclaw/wroclaw/krzyki/jagodno',
      query:
        'limit=36&ownerTypeSingleSelect=ALL&areaMin=40&roomsNumber=%5BTWO%2CTHREE%5D&priceMin=500000&by=LATEST&direction=DESC&searchingCriteria=sprzedaz&searchingCriteria=mieszkanie&searchingCriteria=dolnoslaskie&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=krzyki&searchingCriteria=jagodno',
    },
  },
  {
    type: 'rent',
    olx: {
      searchParams: [
        { key: 'offset', value: '0' },
        { key: 'limit', value: '40' },
        { key: 'query', value: 'jagodno' },
        { key: 'category_id', value: '15' },
        { key: 'filter_float_m:from', value: '40' },
        { key: 'suggest_filters', value: 'true' },
      ],
      referer: 'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/q-jagodno/?search%5Bfilter_float_m:from%5D=40',
    },
    otodom: {
      path: 'wynajem/mieszkanie/dolnoslaskie/wroclaw/wroclaw/wroclaw/krzyki/jagodno',
      query:
        'limit=36&areaMin=40&roomsNumber=%5BTWO%2CTHREE%5D&priceMin=2500&by=LATEST&direction=DESC&searchingCriteria=wynajem&searchingCriteria=mieszkanie&searchingCriteria=dolnoslaskie&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=krzyki&searchingCriteria=jagodno',
    },
  },
];

