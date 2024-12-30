import fetch from 'node-fetch';
import * as fs from 'fs';
import * as TelegramBot from 'node-telegram-bot-api';
import * as winston from 'winston';
import axios from 'axios';

const getOtodomData = async (logger: winston.Logger) => {
  try {
    const resultOtodom = await axios.get(
      'https://www.otodom.pl/_next/data/pFx1cgV3zL9qP8GwC-zOz/pl/wyniki/wynajem/mieszkanie/dolnoslaskie/wroclaw/wroclaw/wroclaw/krzyki/jagodno.json?limit=48&roomsNumber=%5BTWO%2CTHREE%5D&areaMin=35&by=LATEST&direction=DESC&viewType=listing&searchingCriteria=wynajem&searchingCriteria=mieszkanie&searchingCriteria=dolnoslaskie&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=wroclaw&searchingCriteria=krzyki&searchingCriteria=jagodno',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept-Language': 'en-US,en;q=0.9',
          Accept: 'application/json, text/plain, */*',
          Referer: 'https://www.otodom.pl/',
          Origin: 'https://www.otodom.pl',
          Connection: 'keep-alive',
        },
      }
    );

    const urlsOtodom = resultOtodom.data.pageProps?.data?.searchAds?.items?.map(
      (option: any) => `https://www.otodom.pl/pl/oferta/${option.slug.toString()}`
    );

    return urlsOtodom ?? [];
  } catch (err) {
    logger.info('Request to otodom failed...', err?.message);
    return [];
  }
};

const getOlxData = async (logger: winston.Logger) => {
  try {
    const responseOLX = await fetch(
      'https://www.olx.pl/api/v1/offers/?offset=0&limit=40&query=jagodno&category_id=15&region_id=3&city_id=19701&sort_by=created_at%3Adesc&filter_enum_rooms%5B0%5D=two&filter_enum_rooms%5B1%5D=three&filter_float_m%3Afrom=35&filter_refiners=spell_checker&suggest_filters=true&sl=1937f878dd9x6a9927eb',
      {
        headers: {
          accept: '*/*',
          'accept-language': 'pl',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          priority: 'u=1, i',
          'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-client': 'DESKTOP',
          'x-device-id': '9a2807bd-e10a-47fd-8717-f2238a843644',
          'x-fingerprint':
            'fbdc4f53959cdb4af9c2a8983d0ffab85c6324e638a283d8d11dae88fc3236ac3fef60c9cf99daeee8380ebb100f22a6faed307981c3a6ca4e1f7a2acddfea3393ba89d2bc096e2900d2d70001a8f4553fef60c9cf99daee9437bcd7a2768f44b497a357830277b800d2d70001a8f45500d2d70001a8f4559c3027904b07e5707dcebc9bff1a2a525a1778be62509b00e8380ebb100f22a6d35402d4882fb624a18f252f90584f1ff6e9813aa2a88b6b2aa98c6b03d84b2aaa6925b0558d723aa2dab357225d0511272ec8e83d084c3e29b755643a58ca1b6255da105753936400ab77cc9433c49756b16d11aecc8186de4a68aa4d5cf2873a80c6b77256f11a3a4962d8c4406b9a99adb47c7fb9b45e77bbf249a5dea7997e29dd87eedfb91793d10f1cc7e40c4448756dc8ca513af7aa89f99d0a92705581cea512963862be1fa7f0020eee7e44d5e3a2df978cc98281c4694103397b84007c3963de1362e7d8b7668586e5befd9a7cce06fbd6049945ec0f1d83431de81fa7f0020eee7e44e4788261c6c83237',
          'x-platform-type': 'mobile-html5',
          cookie:
            'deviceGUID=9a2807bd-e10a-47fd-8717-f2238a843644; OptanonAlertBoxClosed=2024-12-01T00:03:29.509Z; eupubconsent-v2=CQI8_lgQI8_lgAcABBENBSF8AP_gAAAAAAYgKENV_G_fbXlj8X50aftkeY1f99h7rsQxBhfJk-4FyLuW_JwX32EzNA16pqYKmRIAu3TBIQFlGIDUBUCgaogVrTDMaECEgTNKJ6BEiFMRc2dYCFxvmwFD-QCY5tpt91d52Ret7dr83dzyy4Rnn3Kp_2S1WJCdA5cgAAAAAAAAAAAAAAAQAAAAAAAAAQAIAAAAAAAAAAAAAAAAAAAAF_cAAAAPnAAAAUEggAAIAAXABQAFQAOAAeABBAC8ANQAeABEACYAFUAN4AegA_ACEgEMARIAjgBLACaAFaAMAAYcAygDLAGyAOeAdwB3wD2APiAfYB-wD_AQAAikBFwEYAI0ASWAn4CgwFQAVcAuYBegDFAGiANoAbgA4kCPQJEATsAocBR4CkQFsALkAXeAvMBhsDIwMkAZOAy4BmYDOYGrgayA2MBt4DdQHBAOTAcuEAKgAOABIAEcAg4BHACaAF9ASsAm0BSACwgFiALyAYgAxYBkIDRgGpgNoAbcA3QcAoAARAA4ADwALgAkAB-AEcANAAjgByAEAgIOAhABEQCOAE0AKgAdIBKwCYgEygJtAUmArsBYgC1AF0AMEAYgAxYBkIDJgGjANTAa8A2gBtgDbgG6AOPActA50Dnx0EoABcAFAAVAA4ACCAFwAagA8ACIAEwAKsAXABdADEAG8APQAfoBDAESAJYATQAowBWgDAAGGAMoAaIA2QBzwDuAO8Ae0A-wD9AH_ARQBGICOgJLAT8BQYCogKuAWIAucBeQF6AMUAbQA3ABxADqAH2ARfAj0CRAEyAJ2AUPAo8CkAFNAKsAWKAtgBboC4AFyALtAXeAvMBfQDDQGPQMjAyQBk4DKoGWAZcAzMBnIDTYGrgawA28BuoDiwHJgOXIAFAAEAAPADQAOQAjgBYgC-gJtAUmAsQBeQDBAGeANGAamA2wBtwDdAHLAOfIQIAAFgAUABcADUAKoAXAAxABvAD0AI4AYAA54B3AHeAP8AigBKQCgwFRAVcAuYBigDaAHUAR6ApoBVgCxQFogLgAXIAyMBk4DOSUCIABAACwAKAAcAB4AEQAJgAVQAuABigEMARIAjgBRgCtAGAANkAd4A_ICogKuAXMAxQB1AETAIvgR6BIgCjwFigLYAXnAyMDJAGTgM5AawA28kARAAuAEcAdwBAACDgEcAKgAlYBMQCbQFJgMWAZYAzwBuQDdAHLFIHQAC4AKAAqABwAEAANAAeABEACYAFUAMQAfoBDAESAKMAVoAwABlADRAGyAOcAd8A_AD9AIsARiAjoCSgFBgKiAq4BcwC8gGKANoAbgA6gB7QD7AImARfAj0CRAE7AKHAUgAqwBYoC2AFwALkAXaAvMBfQDDYGRgZIAyeBlgGXAM5gawBrIDbwG6gOCAcmUAPgAXABIAC4AGQARwBHADkAHcAPsAgABBwCxAF1ANeAdsA_4CYgE2gKkAV2AugBeQDBAGLAMmAZ4A0YBqYDXgG6AOWA.f_wAAAAAAAAA; OTAdditionalConsentString=1~89.318.320.1421.1423.1659.1985.1987.2008.2072.2135.2322.2465.2501.2958.2999.3028.3225.3226.3231.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3257.3260.3270.3272.3281.3288.3290.3292.3293.3296.3299.3300.3306.3307.3309.3314.3315.3316.3318.3324.3328.3330.3331.3531.3731.3831.4131.4531.4631.4731.4831.5231.6931.7235.7831.7931.8931.9731.10231.10631.10831.11031.11531.12831.13632.13731.14237.14332.15731.16831.16931.21233.23031.25131.25731.25931.26031.26831.27731.27831.28031.28731.28831.29631.31631.32531.33631.34231.34631.36831; __gsas=ID=94e50a79e2a3b659:T=1733011410:RT=1733011410:S=ALNI_MYMCxBreKmK6f9bqQu-i_XDLSjnVA; _cc_id=897e025c272cf1bc6a6a4d951abbc909; laquesisff=a2b-000#aut-1425#aut-388#bl-2928#buy-2279#buy-2489#buy-4410#cou-1670#dat-2874#de-1927#de-1928#de-2170#de-2547#de-2559#de-2724#decision-256#do-2963#do-3418#euit-2250#euonb-114#f8nrp-1779#grw-124#jobs-7611#kuna-307#kuna-554#kuna-603#mart-1341#mou-1052#oesx-1437#oesx-2063#oesx-2798#oesx-2864#oesx-2926#oesx-3069#oesx-3150#oesx-3713#oesx-4295#oesx-645#oesx-867#olxeu-0000#psm-308#psm-402#psm-457#psm-574#rm-28#rm-707#rm-780#rm-824#rm-852#sd-2240#sd-2759#sd-3192#sd-570#srt-1289#srt-1346#srt-1434#srt-1593#srt-1758#srt-683#uacc-529#uacc-561#ul-3512#ul-3704#up-90; _gcl_au=1.1.315365657.1733011416; _hjSessionUser_1685071=eyJpZCI6ImVmODYxYjVkLTU0OGMtNTUwZi05YzgzLWIwODQ0NGVjMTYxNiIsImNyZWF0ZWQiOjE3MzMwMTE0MTAyNTcsImV4aXN0aW5nIjp0cnVlfQ==; _ga_6PZTQNYS5C=GS1.1.1733015868.2.0.1733015868.60.0.0; _ga_1MNBX75RRH=GS1.1.1733015868.2.0.1733015868.0.0.0; __gfp_64b=SIfBnKa03KZOuLHn55alabYCd24z9A8EykvC_XDlijz..7|1733011410|2|||8,2,32; _gid=GA1.2.390903142.1735506341; WPabs=bf37d8; panoramaId_expiry=1736164027841; panoramaId=7315334f19e56dab36d71cad9da0c8bd038a0966e5b2248e8d6d08e9424d9a31; panoramaIdType=panoIndiv; PHPSESSID=lnhif71emj5ui3cndut4qf941k; laquesis=aut-3337@c#dc-18@b#dc-263@b#de-3014@a#dv-2942@a#erm-1868@a#erm-1921@b#eupp-3050@b#jobs-8352@a#jobs-8616@a#oecs-688@b#oecs-809@c#oesx-4266@b#oesx-4408@b#olxeu-42214@c#olxeu-42241@b#search-1289@a#search-1534@d#ser-1093@a#ser-1209@b; session_start_date=1735572092901; _hjSession_1685071=eyJpZCI6IjBhY2U3MWUxLTIzZjgtNDRjZi04ZjU5LTc4MTFlMGIxMjJjMSIsImMiOjE3MzU1NzAyOTMxMDUsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; __gads=ID=3af2b1da1247cd4d:T=1733011410:RT=1735570293:S=ALNI_MaoR9be0zX16t9yoqyMpUKBw8NwJQ; __gpi=UID=00000f5e19791664:T=1733011410:RT=1735570293:S=ALNI_MZr6KCsGsPv0vyXngnkoSnNuODcyg; __eoi=ID=baacc93a50c65121:T=1733011410:RT=1735570293:S=AA-Afja3BcSsHtc03TUs6FkLVZIK; ab.storage.deviceId.535b859e-9238-4873-a90e-4c76b15ce078=%7B%22g%22%3A%225746eb6b-9473-763b-d8d0-c437acb9cfc0%22%2C%22c%22%3A1703214675539%2C%22l%22%3A1735570293869%7D; __rtbh.uid=%7B%22eventType%22%3A%22uid%22%2C%22id%22%3A%22undefined%22%2C%22expiryDate%22%3A%222025-12-30T14%3A51%3A34.087Z%22%7D; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Dec+30+2024+15%3A51%3A54+GMT%2B0100+(czas+%C5%9Brodkowoeuropejski+standardowy)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&genVendors=V10%3A0%2C&consentId=638a3a9d-811b-4b15-a3fe-f86c77794664&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2Cgad%3A1&geolocation=PL%3B02&AwaitingReconsent=false; lqstatus=1735571494|194180d042ax24037611|dv-2942#ser-1093#jobs-8616#ser-1209#search-1534|||0; ab.storage.sessionId.535b859e-9238-4873-a90e-4c76b15ce078=%7B%22g%22%3A%22ec4abec0-6cc2-d630-0201-51059b5231eb%22%2C%22e%22%3A1735572115911%2C%22c%22%3A1735570293866%2C%22l%22%3A1735570315911%7D; _ga=GA1.1.85651948.1733011411; __rtbh.lid=%7B%22eventType%22%3A%22lid%22%2C%22id%22%3A%22BqaM1f8VrwvI8jPwZDHJ%22%2C%22expiryDate%22%3A%222025-12-30T14%3A51%3A56.092Z%22%7D; _ga_V1KE40XCLR=GS1.1.1735570294.8.1.1735570420.58.0.0; cto_bundle=6voQi19LeEYxTU1VbkgxelVGUk5BYXFZeGxyeEZDTWR0QndYc3ZDUUR2S2lFNmd3ZXR5a0xQVjFoOG4yd043bTdZZjdnRjhmOElJOXpGMyUyQnI5ZGh3SWwlMkJqZ240YTZoWWZQS0hSMUwwVjlsVjI1NjZnOXBMM0FNeXdWZzhpZW9RYnN0bG1nY0oxTkFTS2JxWVp2b3VMdm4xWmhycXdRNWduRlJaMDBRakFIYUVrMWppTnJtdzFKbUhkemhHMU5wcXU0NmlN; onap=1937f878dd9x6a9927eb-6-194180d042ax24037611-56-1735572338',
          Referer:
            'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/wroclaw/q-jagodno/?search%5Border%5D=created_at:desc&search%5Bfilter_float_m:from%5D=35&search%5Bfilter_enum_rooms%5D%5B0%5D=two&search%5Bfilter_enum_rooms%5D%5B1%5D=three',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        method: 'GET',
      }
    );

    const resultOLX = (await responseOLX?.json()) ?? {};
    const urlsOLX = resultOLX.data?.map((option: any) => option.url.toString());

    return urlsOLX ?? [];
  } catch {
    logger.info('Request to olx failed...');
    return [];
  }
};

export const getNewFlatOffers = async (TelegramBot: TelegramBot, logger: winston.Logger, whatsAppClient?: any) => {
  const urlsOLX = (await getOlxData(logger)) ?? [];
  const urlsOtodom = (await getOtodomData(logger)) ?? [];

  const newUrls = [...urlsOLX, ...urlsOtodom];

  fs.writeFile('oldFlatOffers.json', JSON.stringify(newUrls), () => {});
  fs.writeFile('newFlatOffers.json', JSON.stringify(newUrls), () => {});

  logger.info('Sending first message...');
  TelegramBot.sendMessage(-1001870792878, 'Bot uruchomiony poprawnie');

  setInterval(async () => {
    const urlsOLX = (await getOlxData(logger)) ?? [];
    const urlsOtodom = (await getOtodomData(logger)) ?? [];

    const newUrls = [...urlsOLX, ...urlsOtodom];

    const newFlatOffers = await fs.readFileSync('newFlatOffers.json', 'utf8');
    const oldFlatOffers = await fs.readFileSync('oldFlatOffers.json', 'utf8');
    const parsedNewFlatOffers = JSON.parse(newFlatOffers);
    const parsedOldFlatOffers = JSON.parse(oldFlatOffers);

    const newOldFlatOffers = [...new Set([...parsedNewFlatOffers, ...parsedOldFlatOffers])] as string[];

    fs.writeFile('oldFlatOffers.json', JSON.stringify(newOldFlatOffers), () => {});
    fs.writeFile('newFlatOffers.json', JSON.stringify(newUrls), () => {});

    const newOffers = newUrls.filter((url: string) => !newOldFlatOffers.includes(url)) ?? [];

    if (newOffers.length > 0) {
      logger.info(`Znaleziono nowe mieszkanie: ${newOffers.toString()}`);
      TelegramBot.sendMessage(-1001870792878, newOffers.toString());
      if (whatsAppClient) {
        whatsAppClient.sendMessage('120363056103366568@g.us', newOffers.toString());
      }
    } else {
      logger.info(`Brak nowych mieszkań`);
    }
  }, 30 * 1000);
};

