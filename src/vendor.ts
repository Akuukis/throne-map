import * as turf from '@turf/turf'
import { Feature as OLFeature } from 'ol'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
import { Feature } from '@turf/turf'

const castleCoords = [
    [24.79607349472046, 57.11766009080054],
    [24.790408669281007, 57.119279364483475],
    [24.79105239944458, 57.122552644002496],
    [24.79755407409668, 57.12128297205581],
    [24.7945, 57.1194]
]

const perimeterCoords = [
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
    [24.801995812225343, 57.11790473381015],
    [24.800236283111577, 57.11896483484736],
    [24.796223698425297, 57.12385721570766],  // repeated
]

export const perimeterLine = new OLFeature(new Polygon([perimeterCoords]).transform('EPSG:4326', 'EPSG:3857'))

const campCoords = [
    [24.79909902648926, 57.11848721066298],  // 01
    [24.799270687866212, 57.11946575115559],  // 02
    [24.795773087310792, 57.119430803726004],  // 03
    [24.796309529113774, 57.120362723897074],  // 04
    [24.79463583068848, 57.120409319290104],  // 05
    [24.796288071441655, 57.12272736609256],  // 07
    [24.794721661376954, 57.123554372800584],  // 08
    [24.79542976455689, 57.12146934864532],  // 08
    [24.79291921691895, 57.124194999105384],  // 09
    [24.793305455017094, 57.12318163966896],  // 10
    [24.79339128570557, 57.12219154907089],  // 11
    [24.792232571411137, 57.12115483760647],  // 12
    [24.789550362396245, 57.12116648621108],  // 13
    [24.792211113739018, 57.120024905544426],  // 14
    [24.793155251312257, 57.1188599910418],  // 15
    [24.79139572219849, 57.11869690008771],  // 16
    [24.791009484100346, 57.11792803306011],  // 17
    [24.79214674072266, 57.117031001356395],  // 18
    [24.794013558197026, 57.116984401713296],  // 19
    [24.792811928558354, 57.11785813526623],  // 20
    [24.79489332275391, 57.118254221021004],  // 21
    [24.7981334312439, 57.117764938002495],  // 22
]


/**
 * Calculate the zone from a center point of a zone.
 *
 * On paper you would draw perpendicular lines between a center and neighbor's centers, then connect those lines.
 * In a function it's not so easy to understand who's neighbor, so just draw lines every perpendicular but idea stays.
 */
const getZone = (myCoords: number[]) => campCoords.concat(castleCoords)
    .map((toCoords) => {
        var point1 = turf.point(myCoords);
        var point2 = turf.point(toCoords);

        var midpoint = turf.midpoint(point1, point2);
        var line = turf.lineString([point1.geometry.coordinates,point2.geometry.coordinates]);
        var rotatedPoly = turf.transformRotate(line, 90, {pivot:midpoint});
        var scaledPoly = turf.transformScale(rotatedPoly, 3, {origin:midpoint});


        var mirror = turf.transformRotate(scaledPoly, 180, {pivot:point2});
        var mirrorAway = turf.transformRotate(mirror, 180, {pivot:point1});
        var poly = turf.polygon([scaledPoly.geometry.coordinates.concat(mirrorAway.geometry.coordinates.reverse(), [scaledPoly.geometry.coordinates[0]])])
        var intersection = turf.intersect(poly, turf.polygon([perimeterCoords])) as Feature<turf.helpers.Polygon, {}>
        // return intersection.geometry.coordinates
        return poly
    });

export const zones = campCoords
    .map((coords, i) => {
        const myZonesRaw = getZone(coords)
        console.log(myZonesRaw)
        return myZonesRaw
            .reduce(
                (remainder, mask, j) => turf.intersect(remainder, mask) as Feature<turf.helpers.Polygon, {}> || remainder,
                turf.polygon([perimeterCoords])
            )
            .geometry
            .coordinates
    })
    .map((coords, i) => {
        const feat = new OLFeature(new Polygon(coords).transform('EPSG:4326', 'EPSG:3857'))
        feat.setId(i + 1);
        return feat
    })

// export const debug = new OLFeature(new Polygon(area1).transform('EPSG:4326', 'EPSG:3857'))

export const camps = campCoords
    .map((coords) => new OLFeature(new LineString(coords).transform('EPSG:4326', 'EPSG:3857')))

export const captureTime = {
     1: {'white': 22,'yellow': 344,'grey': 29,'blue': 0,'green': 83},
     2: {'white': 0,'yellow': 256,'grey': 40,'blue': 0,'green': 183},
     3: {'white': 85,'yellow': 213,'grey': 6,'blue': 0,'green': 172},
     4: {'white': 2,'yellow': 13,'grey': 62,'blue': 0,'green': 402},
     5: {'white': 170,'yellow': 151,'grey': 7,'blue': 4,'green': 146},
     6: {'white': 34,'yellow': 12,'grey': 77,'blue': 4,'green': 351},
     7: {'white': 0,'yellow': 0,'grey': 32,'blue': 18,'green': 429},
     8: {'white': 15,'yellow': 0,'grey': 8,'blue': 420,'green': 36},
     9: {'white': 31,'yellow': 0,'grey': 4,'blue': 415,'green': 29},
    10: {'white': 0,'yellow': 0,'grey': 8,'blue': 431,'green': 40},
    11: {'white': 11,'yellow': 0,'grey': 71,'blue': 364,'green': 32},
    12: {'white': 248,'yellow': 0,'grey': 0,'blue': 218,'green': 11},
    13: {'white': 390,'yellow': 0,'grey': 25,'blue': 61,'green': 1},
    14: {'white': 357,'yellow': 0,'grey': 36,'blue': 75,'green': 10},
    15: {'white': 423,'yellow': 0,'grey': 41,'blue': 0,'green': 15},
    16: {'white': 444,'yellow': 17,'grey': 2,'blue': 0,'green': 15},
    17: {'white': 401,'yellow': 0,'grey': 78,'blue': 0,'green': 0},
    18: {'white': 446,'yellow': 32,'grey': 1,'blue': 0,'green': 0},
    19: {'white': 32,'yellow': 413,'grey': 13,'blue': 0,'green': 20},
    20: {'white': 97,'yellow': 355,'grey': 6,'blue': 7,'green': 12},
    21: {'white': 32,'yellow': 391,'grey': 30,'blue': 0,'green': 24},
    22: {'white': 22,'yellow': 404,'grey': 27,'blue': 0,'green': 25},
}
