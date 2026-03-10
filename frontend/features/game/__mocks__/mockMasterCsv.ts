/**
 * テスト用モックマスターCSVデータ。
 * initializeMasterRegistry の fetcher に渡す。
 */

export const PRODUCTION_MASTER_CSV = `id,name,maxLevel,yieldType,baseYield,yieldGrowth,yieldTable,baseCycleMs,cycleReduceRate,costType,baseCost,costGrowth,costTable,qrUnlockEnabled,encyclopediaId,imageSrc
farm,畑,10,growth,1,0.5,,5000,1,growth,10,1.5,,false,enc_farm,/img/farm.png
factory,工場,10,growth,5,2,,10000,0.95,growth,100,2,,false,enc_factory,/img/factory.png
plant,発電所,10,growth,20,8,,30000,0.9,growth,500,2.5,,false,enc_plant,/img/plant.png`;

export const BONUS_MASTER_CSV = `id,name,maxLevel,targetType,targetId,effectType,valueType,baseValue,valueGrowth,valueTable,costType,baseCost,costGrowth,costTable,qrUnlockEnabled,encyclopediaId,imageSrc
tap,タップ強化,5,tap,,tapMultiplier,growth,2,1,,growth,50,2,,false,enc_tap,/img/tap.png`;

/** イベントは今回テスト対象外のため空 */
export const EVENT_MASTER_CSV = `id,name,spawnWeight,effectType,targetType,targetId,value,durationMs,flavorText,encyclopediaId,imageSrc`;

export const ENCYCLOPEDIA_MASTER_CSV = `id,title,shortText,detailText,sourceType,sourceId,imageSrc
enc_farm,畑,農作物を育てる,野菜を育てて収益を得る,production,farm,/img/farm.png
enc_factory,工場,製品を製造する,製品を製造して収益を得る,production,factory,/img/factory.png
enc_plant,発電所,電力を発電する,電力を生産して収益を得る,production,plant,/img/plant.png
enc_tap,タップ強化,タップ収益アップ,タップで得られる金額を増やす,bonus,tap,/img/tap.png`;

/** initializeMasterRegistry に渡す fetcher */
export const mockCsvFetcher = async (name: string): Promise<string> => {
  switch (name) {
    case "/master/data/productionMaster.csv":
      return PRODUCTION_MASTER_CSV;
    case "/master/data/bonusMaster.csv":
      return BONUS_MASTER_CSV;
    case "/master/data/eventMaster.csv":
      return EVENT_MASTER_CSV;
    case "/master/data/encyclopediaMaster.csv":
      return ENCYCLOPEDIA_MASTER_CSV;
    default:
      throw new Error(`Unknown master: ${name}`);
  }
};

/** テスト用の初期解放施設ID一覧 */
export const INITIAL_PRODUCTION_IDS = ["farm", "factory", "plant"] as const;
