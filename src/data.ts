/**
 * The frame for viewport.
 */
export const extent = [24.7866, 57.1161, 24.8025, 57.126] as [number, number, number, number]

export enum TYPE {
    CASTLE = 'castle',
    CAMP = 'camp',
    MARKET = 'market',
}

export enum CASTLE_VARIANT {
    BLUE = 'blue',
    YELLOW = 'yellow',
    RED = 'red',
    GREEN = 'green',
}

export enum CAMP_VARIANT {
    IRON = 'iron',
    COAL = 'coal',
    FOOD = 'food',
    CHICKEN = 'chicken',
}

export type POI =
    | POI.Market
    | POI.Castle
    | POI.Camp

export namespace POI {
    interface Base {
        id: number,
        type: TYPE
        variant?: CASTLE_VARIANT | CAMP_VARIANT
        point: [number, number]
    }

    export interface Market extends Base {
        type: TYPE.MARKET
    }

    export interface Castle extends Base {
        type: TYPE.CASTLE
        variant: CASTLE_VARIANT
    }

    export interface Camp extends Base {
        type: TYPE.CAMP
        variant: CAMP_VARIANT
    }
}

export const PERIMETER = [
    [24.796223698425297, 57.12385721570766],
    [24.795966206359864, 57.124835614328106],
    [24.792618809509282, 57.124474541656355],
    [24.791910706329347, 57.12406687473103],
    [24.791996537017823, 57.12356602065046],
    [24.787919579315187, 57.12135286338679],
    [24.791138230133058, 57.1164368515156],
    [24.79184633331299, 57.116623252491564],
    [24.798004685211183, 57.11740379639076],
    [24.800365029144288, 57.117613491948845],
    [24.800236283111577, 57.11896483484736],
    [24.796223698425297, 57.12385721570766],  // repeated
]

export const DATA: POI[] = [
    {id:  0, type: TYPE.MARKET,                                 point: [24.7945, 57.1194] },
    {id:  1, type: TYPE.CAMP  , variant: CAMP_VARIANT.IRON    , point: [24.7990, 57.1184] },
    {id:  2, type: TYPE.CAMP  , variant: CAMP_VARIANT.COAL    , point: [24.7992, 57.1194] },
    {id:  3, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7957, 57.1194] },
    {id:  4, type: TYPE.CAMP  , variant: CAMP_VARIANT.IRON    , point: [24.7963, 57.1203] },
    {id:  5, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7946, 57.1204] },
    {id:  6, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7962, 57.1227] },
    {id:  7, type: TYPE.CAMP  , variant: CAMP_VARIANT.COAL    , point: [24.7947, 57.1235] },
    {id:  8, type: TYPE.CAMP  , variant: CAMP_VARIANT.COAL    , point: [24.7954, 57.1214] },
    {id:  9, type: TYPE.CAMP  , variant: CAMP_VARIANT.IRON    , point: [24.7929, 57.1241] },
    {id: 10, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7933, 57.1231] },
    {id: 11, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7933, 57.1221] },
    {id: 12, type: TYPE.CAMP  , variant: CAMP_VARIANT.IRON    , point: [24.7922, 57.1211] },
    {id: 13, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7895, 57.1211] },
    {id: 14, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7922, 57.1200] },
    {id: 15, type: TYPE.CAMP  , variant: CAMP_VARIANT.COAL    , point: [24.7931, 57.1188] },
    {id: 16, type: TYPE.CAMP  , variant: CAMP_VARIANT.COAL    , point: [24.7915, 57.1186] },
    {id: 17, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7910, 57.1179] },
    {id: 18, type: TYPE.CAMP  , variant: CAMP_VARIANT.IRON    , point: [24.7921, 57.1170] },
    {id: 19, type: TYPE.CAMP  , variant: CAMP_VARIANT.FOOD    , point: [24.7940, 57.1169] },
    {id: 20, type: TYPE.CAMP  , variant: CAMP_VARIANT.COAL    , point: [24.7928, 57.1178] },
    {id: 21, type: TYPE.CAMP  , variant: CAMP_VARIANT.IRON    , point: [24.7948, 57.1182] },
    {id: 22, type: TYPE.CAMP  , variant: CAMP_VARIANT.COAL    , point: [24.7981, 57.1177] },
    {id: 80, type: TYPE.CAMP  , variant: CAMP_VARIANT.CHICKEN , point: [24.7902, 57.1203], },
    {id: 81, type: TYPE.CAMP  , variant: CAMP_VARIANT.CHICKEN , point: [24.7936, 57.1214], },
    {id: 82, type: TYPE.CAMP  , variant: CAMP_VARIANT.CHICKEN , point: [24.7973, 57.1191], },
    {id: 83, type: TYPE.CAMP  , variant: CAMP_VARIANT.CHICKEN , point: [24.7923, 57.1184], },
    {id: 90, type: TYPE.CASTLE, variant: CASTLE_VARIANT.GREEN , point: [24.7960, 57.1176] },
    {id: 91, type: TYPE.CASTLE, variant: CASTLE_VARIANT.BLUE  , point: [24.7904, 57.1192] },
    {id: 92, type: TYPE.CASTLE, variant: CASTLE_VARIANT.YELLOW, point: [24.7910, 57.1225] },
    {id: 93, type: TYPE.CASTLE, variant: CASTLE_VARIANT.RED   , point: [24.7975, 57.1212] },
]

export const captureTime = {
     1: {white: 22 , yellow: 344, grey: 29 , blue: 0  , green: 83 },
     2: {white: 0  , yellow: 256, grey: 40 , blue: 0  , green: 183},
     3: {white: 85 , yellow: 213, grey: 6  , blue: 0  , green: 172},
     4: {white: 2  , yellow: 13 , grey: 62 , blue: 0  , green: 402},
     5: {white: 170, yellow: 151, grey: 7  , blue: 4  , green: 146},
     6: {white: 34 , yellow: 12 , grey: 77 , blue: 4  , green: 351},
     7: {white: 0  , yellow: 0  , grey: 32 , blue: 18 , green: 429},
     8: {white: 15 , yellow: 0  , grey: 8  , blue: 420, green: 36 },
     9: {white: 31 , yellow: 0  , grey: 4  , blue: 415, green: 29 },
    10: {white: 0  , yellow: 0  , grey: 8  , blue: 431, green: 40 },
    11: {white: 11 , yellow: 0  , grey: 71 , blue: 364, green: 32 },
    12: {white: 248, yellow: 0  , grey: 0  , blue: 218, green: 11 },
    13: {white: 390, yellow: 0  , grey: 25 , blue: 61 , green: 1  },
    14: {white: 357, yellow: 0  , grey: 36 , blue: 75 , green: 10 },
    15: {white: 423, yellow: 0  , grey: 41 , blue: 0  , green: 15 },
    16: {white: 444, yellow: 17 , grey: 2  , blue: 0  , green: 15 },
    17: {white: 401, yellow: 0  , grey: 78 , blue: 0  , green: 0  },
    18: {white: 446, yellow: 32 , grey: 1  , blue: 0  , green: 0  },
    19: {white: 32 , yellow: 413, grey: 13 , blue: 0  , green: 20 },
    20: {white: 97 , yellow: 355, grey: 6  , blue: 7  , green: 12 },
    21: {white: 32 , yellow: 391, grey: 30 , blue: 0  , green: 24 },
    22: {white: 22 , yellow: 404, grey: 27 , blue: 0  , green: 25 },
}
