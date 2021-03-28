import * as turf from '@turf/turf'
import { Feature as OLFeature } from 'ol'
import Polygon from 'ol/geom/Polygon'
import { Feature } from '@turf/turf'
import { campCoords, castleCoords, chickenCoords, perimeterCoords } from './data'

export const perimeterLine = new OLFeature(new Polygon([perimeterCoords]).transform('EPSG:4326', 'EPSG:3857'))


/**
 * Calculate the zone from a center point of a zone.
 *
 * On paper you would draw perpendicular lines between a center and neighbor's centers, then connect those lines.
 * In a function it's not so easy to understand who's neighbor, so just draw lines every perpendicular but idea stays.
 */
const getZone = (myCoords: number[]) => campCoords.concat(castleCoords).concat(chickenCoords)
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

export const zones = campCoords.concat(castleCoords).concat(chickenCoords)
    .map((coords, i) => {
        const myZonesRaw = getZone(coords)
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
// export const camps = campCoords
//     .map((coords) => new OLFeature(new LineString(coords).transform('EPSG:4326', 'EPSG:3857')))
