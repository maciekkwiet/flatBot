import fetch from "node-fetch"
import * as fs from 'fs'
import * as TelegramBot from 'node-telegram-bot-api';
import * as winston from 'winston'

const getOtodomData = async (logger: winston.Logger) => {
  try {
    const responseOtodom = await fetch("https://www.otodom.pl/_next/data/BQYrPyhzIUlk1YK9rR-JO/pl/oferty/wynajem/mieszkanie/wroclaw.json?distanceRadius=0&page=1&limit=36&market=ALL&ownerTypeSingleSelect=ALL&priceMin=2500&priceMax=3000&areaMin=40&locations=%5Bcities_6-39%5D&by=DEFAULT&direction=DESC&viewType=listing&lang=pl&searchingCriteria=wynajem&searchingCriteria=mieszkanie&searchingCriteria=wroclaw", {
      "headers": {
        "accept": "*/*",
        "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
        "baggage": "sentry-environment=otodompl-prd,sentry-release=re-frontend-platform%402023-01-09_14.01-otodompl,sentry-transaction=%2F%5Blang%5D%2Foferty%2F%5B%5B...searchingCriteria%5D%5D,sentry-public_key=a87771f160f04e019f364675c25c0588,sentry-trace_id=a22a77d493bd4a34a2718f3aacbee100,sentry-sample_rate=0.0001",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sentry-trace": "a22a77d493bd4a34a2718f3aacbee100-a0d2c04ed218d698-0",
        "cookie": "laquesisff=gre-12226#rer-165#rer-166#rst-73#rst-74; OptanonAlertBoxClosed=2022-10-19T18:42:38.638Z; OTAdditionalConsentString=1~89.2008.2072.2322.2465.2501.2999.3028.3225.3226.3231.3232.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3257.3260.3268.3270.3272.3281.3288.3290.3292.3293.3295.3296.3300.3306.3307.3308.3314.3315.3316.3318.3324.3327.3328.3330; _gcl_au=1.1.1122860254.1666204959; st_userID=GA1.2.1507911430.1666204959__unlogged; __gads=ID=4ffd260220d3f372:T=1666204958:S=ALNI_MZVANYH2eH0z-Z2o4VyrWgWESUP7g; laquesissu=294@survey_answer|1#314@ad_page|1#314@listing|1; _ga_MNTL052JB4=GS1.1.1671139974.9.0.1671139974.60.0.0; lang=pl; eupubconsent-v2=CPhF1LAPhF1LAAcABBENCyCsAP_AAH_AAAYgJFNf_X__b2_r-_5_f_t0eY1P9_7__-0zjhfdl-8N3f_X_L8X52M7vF36tq4KuR4ku3LBIUdlHOHcTUmw6okVryPsbk2cr7NKJ7PEmnMbOydYGH9_n1_z-ZKY7___f_7z_v-v___3____7-3f3__5___-__e_V__9zfn9_____9vP___9v-_9__________3_7997BIgAkw1biALsyxwZtowigRAjCsJDqBQAUUAwtEBhA6uCnZXAT6wgQAIBQBOBECHAFGDAIAABIAkIiAkCPBAIACIBAACABUIhAAxsAgsALAwCAAUA0LFGKAIQJCDIgIilMCAqRIKCeyoQSg_0NMIQ6ywAoNH_FQgI1kDFYEQkLByHBEgJeLJA8xRvkAIwQoBRKhWogAAA.f_gAD_gAAAAA; observed5_id_clipboard=63bc1c8d39b0f; observed5_sec_clipboard=lz1I2QndlnJH3c%2BOM9lp3Jf6lAS6a5Z5; _gid=GA1.2.1219320400.1673207269; ln_or=eyIxODYxOTA4IjoiZCJ9; __gfp_64b=a9UnyjjWEvuZprnegmOaC_VzmXpdMgkwdCG9PZ8tXjf.S7|1666204959; laquesis=remt-288@a#remt-395@a#remt-448@a#remt-457@b#remt-458@b#remt-507@c#see-1171@c#see-1189@a#see-1294@c#smr-1387@b#smr-1388@c#smr-1481@b#smr-1486@b#smr-954@b; PHPSESSID=4nov7815vjsdsvmi8egqgfn9i2; mobile_default=desktop; ninja_user_status=unlogged; optimizelyEndUserId=oeu1673282248579r0.02918823203480203; lastCatType=2; __gpi=UID=00000b758bdb18e9:T=1666204958:RT=1673299821:S=ALNI_MbPq1EmHjTrUzTyVHsWByhxBhughA; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Jan+09+2023+22%3A31%3A48+GMT%2B0100+(czas+%C5%9Brodkowoeuropejski+standardowy)&version=6.32.0&isIABGlobal=false&hosts=&genVendors=V9%3A0%2C&consentId=b8d02efa-bf8a-432a-be63-a0ece378b77a&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2Cgad%3A1%2CSTACK42%3A1&geolocation=PL%3B02&AwaitingReconsent=false; _uetsid=1f209b30902511ed9757d15a99df2773; _uetvid=49d60080f57311ec998793fab994f6ba; _ga=GA1.2.1025374861.1666205631; _ga_MJFMKPTTMP=GS1.1.1673299789.5.1.1673299921.30.0.0; lqstatus=1673302560|18598708711x755b042e|see-1189#see-1294#smr-1481#smr-1486#remt-448#remt-457#remt-507|1670445309|314; _gat_UA-124076552-11=1; _gat_clientNinja=1; onap=183f18df57cx8ec294a-12-18598708711x755b042e-179-1673303179; _ga_HL51DW3Q97=GS1.1.1673299789.13.1.1673301379.54.0.0",
        "Referer": "https://www.otodom.pl/pl/oferty/wynajem/mieszkanie/wroclaw?distanceRadius=0&page=1&limit=36&market=ALL&ownerTypeSingleSelect=ALL&priceMin=2500&priceMax=3000&areaMin=40&locations=%5Bcities_6-39%5D&by=DEFAULT&direction=DESC&viewType=listing",
        "Referrer-Policy": "no-referrer-when-downgrade"
      },
      "body": undefined,
      "method": "GET"
    });

    const resultOtodom = await responseOtodom?.json() ?? {}
    const urlsOtodom = resultOtodom.pageProps?.data?.searchAds?.items?.map((option: any) => `https://www.otodom.pl/pl/oferta/${option.slug.toString()}`)
    
    return urlsOtodom ?? []
  } catch {
    logger.info('Request to otodom failed...')
    return []
  }
}

const getOlxData = async (logger: winston.Logger) => {
  try {
    const responseOLX = await fetch("https://www.olx.pl/api/v1/offers/?offset=0&limit=50&category_id=15&region_id=3&city_id=19701&sort_by=created_at%3Adesc&filter_enum_rooms%5B0%5D=two&filter_enum_rooms%5B1%5D=three&filter_float_m%3Afrom=40&filter_float_price%3Afrom=2500&filter_float_price%3Ato=3000&filter_refiners=spell_checker&facets=%5B%7B%22field%22%3A%22district%22%2C%22fetchLabel%22%3Atrue%2C%22fetchUrl%22%3Atrue%2C%22limit%22%3A30%7D%2C%7B%22field%22%3A%22category_without_exclusions%22%2C%22fetchLabel%22%3Atrue%2C%22fetchUrl%22%3Atrue%2C%22limit%22%3A10%7D%5D&sl=183f1984023x39a26426", {
      "headers": {
        "accept": "*/*",
        "accept-language": "pl",
        "authorization": "Bearer fe22560b2ff790b963a6cfeaf9a768b532117e9a",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-client": "DESKTOP",
        "x-device-id": "76f7df06-34de-4424-a9f0-6ea2b847ab4d",
        "x-platform-type": "mobile-html5",
        "cookie": "observed_aui=6d3b05712a3a4b27a8d421b658dd9601; dfp_user_id=e91dd61d-a3c0-4b25-830c-06c13410e114-ver2; user_adblock_status=false; OptanonAlertBoxClosed=2022-10-19T18:53:57.887Z; OTAdditionalConsentString=1~89.2008.2072.2322.2465.2501.2999.3028.3225.3226.3231.3232.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3257.3260.3268.3270.3272.3281.3288.3290.3292.3293.3295.3296.3300.3306.3307.3308.3314.3315.3316.3318.3324.3327.3328.3330; _gcl_au=1.1.1899540019.1666205638; __gsas=ID=b1b2934d12e66883:T=1666205638:S=ALNI_MYyZ3TiLnxgNMRZuhSjBy82Rim1_Q; __gads=ID=09983120769ae8a9:T=1666205638:S=ALNI_MatrFjB0mLi4RBk_NttM17wTy-CnA; lister_lifecycle=1666205658; WPabs=826c76; deviceGUID=76f7df06-34de-4424-a9f0-6ea2b847ab4d; _hjSessionUser_1685071=eyJpZCI6IjMzZTcxMzJlLWEwOGQtNTM2NS1iNTlhLWQyYmY3ZDFkYzcxMyIsImNyZWF0ZWQiOjE2NjYyMDU2MzA3MDMsImV4aXN0aW5nIjp0cnVlfQ==; _ga_YFPJ6DNP92=GS1.1.1668886607.6.1.1668887475.0.0.0; __utma=221885126.1025374861.1666205631.1666205638.1671133765.2; __utmz=221885126.1671133765.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); a_refresh_token=2ccf6c2607c89800e32799a1ad85cec1282d348b; a_grant_type=device; user_id=1352706890; user_business_status=private; ldTd=true; laquesisff=a2b-000#aut-388#buy-2279#buy-2489#buy-2811#dat-2874#decision-256#do-2963#do-3418#euonb-114#euweb-1372#euweb-451#grw-124#kuna-307#kuna-554#kuna-603#mou-1052#oesx-1437#oesx-1643#oesx-645#oesx-867#olxeu-0000#psm-308#psm-402#psm-457#psm-574#sd-570#srt-1289#srt-1346#srt-1434#srt-1593#srt-1758#srt-683; laquesissu=; mobile_default=desktop; eupubconsent-v2=CPhIs1zPhIs1zAcABBENCyCsAP_AAH_AAAYgJFNf_X__b2_r-_5_f_t0eY1P9_7__-0zjhfdl-8N3f_X_L8X52M7vF36tq4KuR4ku3LBIUdlHOHcTUmw6okVryPsbk2cr7NKJ7PEmnMbOydYGH9_n1_z-ZKY7___f_7z_v-v___3____7-3f3__5___-__e_V__9zfn9_____9vP___9v-_9__________3_7997BIQAkw1biALsSxwJtowigRAjCsJDqBQAUUAwtEBhA6uCnZXAT6wgQAIBQBGBECHAFGDAIAAAIAkIiAkCPBAIACIBAACABUIhAARsAgoALAwCAAUA0LFGKAIQJCDIgIilMCAiRIKCeyoQSg_0NMIQ6ywAoNH_FQgIlACFYEQkLByHBEgJeLJAsxRvkAIwQoBRKhWoAAAA.f_gAD_gAAAAA; a_access_token=fe22560b2ff790b963a6cfeaf9a768b532117e9a; _gid=GA1.2.1219320400.1673207269; laquesis=cars-33613@b#euads-3574@a#jobs-4078@a#jobs-4633@b#jobs-4643@a#jobs-4757@a#jobs-4782@d#oesx-2305@b#oesx-2313@b#oesx-2322@c#oeu2u-2588@b#olxeu-40144@b#olxeu-40264@a#ser-30@b; __gfp_64b=05PMsay9GVYeN0Z3nMlj.Qya1yzjnthpcLoaj46MVqP.G7|1666205638; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Jan+09+2023+09%3A46%3A29+GMT%2B0100+(czas+%C5%9Brodkowoeuropejski+standardowy)&version=6.19.0&isIABGlobal=false&hosts=&genVendors=V9%3A0%2C&consentId=605370d9-fe0b-4d6d-ba0f-ebdb2b349fca&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2Cgad%3A1%2CSTACK42%3A1&geolocation=PL%3B02&AwaitingReconsent=false; sbjs_migrations=1418474375998%3D1; sbjs_current_add=fd%3D2023-01-09%2009%3A46%3A29%7C%7C%7Cep%3Dhttps%3A%2F%2Fwww.olx.pl%2Fd%2Fnieruchomosci%2Fmieszkania%2Fwynajem%2Fwroclaw%2F%7C%7C%7Crf%3D%28none%29; sbjs_first_add=fd%3D2023-01-09%2009%3A46%3A29%7C%7C%7Cep%3Dhttps%3A%2F%2Fwww.olx.pl%2Fd%2Fnieruchomosci%2Fmieszkania%2Fwynajem%2Fwroclaw%2F%7C%7C%7Crf%3D%28none%29; sbjs_current=typ%3Dtypein%7C%7C%7Csrc%3D%28direct%29%7C%7C%7Cmdm%3D%28none%29%7C%7C%7Ccmp%3D%28none%29%7C%7C%7Ccnt%3D%28none%29%7C%7C%7Ctrm%3D%28none%29; sbjs_first=typ%3Dtypein%7C%7C%7Csrc%3D%28direct%29%7C%7C%7Cmdm%3D%28none%29%7C%7C%7Ccmp%3D%28none%29%7C%7C%7Ccnt%3D%28none%29%7C%7C%7Ctrm%3D%28none%29; sbjs_udata=vst%3D1%7C%7C%7Cuip%3D%28none%29%7C%7C%7Cuag%3DMozilla%2F5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F108.0.0.0%20Safari%2F537.36; newrelic_cdn_name=CF; dfp_segment=%5B%5D; PHPSESSID=hatbc5evtrsh9km7i90vhqf5io; __gpi=UID=00000b758cd8a54f:T=1666205638:RT=1673253990:S=ALNI_Mama0UJ1I6xwc8GdFIDbojdRRux9A; _hjIncludedInSessionSample=0; _hjSession_1685071=eyJpZCI6IjUwOWRjM2RiLWU4ODUtNDVjOS1iYzIxLWFmZGFmMTBlNGMzOCIsImNyZWF0ZWQiOjE2NzMyNTM5OTAwMjYsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=1; cto_bundle=gzCmlV9IJTJCV0Rjb2VMNlZ4dW9OY1dMWUxPNmVMJTJGRWFuVktCdVN6eUxNelloejR2ZGIlMkYxcGZjZ05Ubk1uMXl4cUZZMGdxSjFNY3VqQSUyQnM2c0MlMkZBa3FZMndESnZFZ3FSQkN3eDREV1JCNzhPYjBpN1NxdDJPMm82SzJUNmhqVk1vQWpVbCUyRkY1ZWVSMk1LRzFwWkc2M2ZIODZ4R1dwSlJDNTFTYXQ3dzJPdEx6azhGbGdmVWdINnRWcDVwJTJCWUpwZWNxaFZpVg; _ga=GA1.1.1025374861.1666205631; lqstatus=1673255251|18595b5affex13194907|euads-3574#jobs-4633||; _gat_clientNinja=1; _ga_V1KE40XCLR=GS1.1.1673253990.17.1.1673254182.60.0.0; _ga_MNTL052JB4=GS1.1.1673253990.13.1.1673254183.60.0.0; session_start_date=1673255988156; onap=183f1984023x39a26426-14-18595b5affex13194907-37-1673255988; sbjs_session=pgs%3D11%7C%7C%7Ccpg%3Dhttps%3A%2F%2Fwww.olx.pl%2Fd%2Fnieruchomosci%2Fmieszkania%2Fwynajem%2Fwroclaw%2F%3Fsearch%255Border%255D%3Dcreated_at%3Adesc%26search%255Bfilter_float_price%3Afrom%255D%3D2500%26search%255Bfilter_float_price%3Ato%255D%3D3000%26search%255Bfilter_float_m%3Afrom%255D%3D40%26search%255Bfilter_enum_rooms%255D%255B0%255D%3Dtwo%26search%255Bfilter_enum_rooms%255D%255B1%255D%3Dthree",
        "Referer": "https://www.olx.pl/d/nieruchomosci/mieszkania/wynajem/wroclaw/?search%5Border%5D=created_at:desc&search%5Bfilter_float_price:from%5D=2500&search%5Bfilter_float_price:to%5D=3000&search%5Bfilter_float_m:from%5D=40&search%5Bfilter_enum_rooms%5D%5B0%5D=two&search%5Bfilter_enum_rooms%5D%5B1%5D=three",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": undefined,
      "method": "GET"
    });

    const resultOLX = await responseOLX?.json() ?? {}
    const urlsOLX = resultOLX.data?.map((option: any) => option.url.toString())

    return urlsOLX ?? []
  } catch {
    logger.info('Request to olx failed...')
    return []
  }
}

export const getNewFlatOffers = async (TelegramBot: TelegramBot, logger: winston.Logger, whatsAppClient: any) => {
    const urlsOLX = await getOlxData(logger) ?? []
    const urlsOtodom = await getOtodomData(logger) ?? []

    const newUrls = [...urlsOLX, ...urlsOtodom]

    fs.writeFile('oldFlatOffers.json', JSON.stringify(newUrls), () => {})
    fs.writeFile('newFlatOffers.json', JSON.stringify(newUrls), () => {})
  
    logger.info('Sending first message...')
    TelegramBot.sendMessage(-1001870792878, 'Bot uruchomiony poprawnie')

    setInterval(async () => {
      const urlsOLX = await getOlxData(logger) ?? []
      const urlsOtodom = await getOtodomData(logger) ?? []

      const newUrls = [...urlsOLX, ...urlsOtodom]

      const newFlatOffers = await fs.readFileSync('newFlatOffers.json', 'utf8')
      const oldFlatOffers = await fs.readFileSync('oldFlatOffers.json', 'utf8')
      const parsedNewFlatOffers = JSON.parse(newFlatOffers)
      const parsedOldFlatOffers = JSON.parse(oldFlatOffers)

      const newOldFlatOffers = [...new Set([...parsedNewFlatOffers, ...parsedOldFlatOffers])] as string[]

      fs.writeFile('oldFlatOffers.json', JSON.stringify(newOldFlatOffers), () => {})
      fs.writeFile('newFlatOffers.json', JSON.stringify(newUrls), () => {})

      const newOffers = newUrls.filter((url: string) => !newOldFlatOffers.includes(url)) ?? []

      if (newOffers.length > 0) {
        logger.info(`Znaleziono nowe mieszkanie: ${newOffers.toString()}`)
        TelegramBot.sendMessage(-1001870792878, newOffers.toString())
        whatsAppClient.sendMessage('120363056103366568@g.us', newOffers.toString());
      } else {
        logger.info(`Brak nowych mieszkań`)
      }

    } , 10 * 1000)
}
