import * as turf from '@turf/turf'
import { Feature as OLFeature } from 'ol'
import Polygon from 'ol/geom/Polygon'
import { Feature } from '@turf/turf'
import { allCoords, campCoords, castleCoords, chickenCoords, perimeterCoords } from './data'

export const perimeterLine = new OLFeature(new Polygon([perimeterCoords]).transform('EPSG:4326', 'EPSG:3857'))


/**
 * Calculate the zone from a center point of a zone.
 *
 * On paper you would draw perpendicular lines between a center and neighbor's centers, then connect those lines.
 * In a function it's not so easy to understand who's neighbor, so just draw lines every perpendicular but idea stays.
 */
const getZone = (myCoords: number[]) => allCoords
    .map((toCoords) => {
        const myPoint = turf.point(myCoords);
        const toPoint = turf.point(toCoords);

        const midpoint = turf.midpoint(myPoint, toPoint);
        const line = turf.lineString([myPoint.geometry.coordinates,toPoint.geometry.coordinates]);
        const rotatedPoly = turf.transformRotate(line, 90, {pivot:midpoint});
        const scaledPoly = turf.transformScale(rotatedPoly, 3, {origin:midpoint});

        // Draw a line "at the back", 3 times further than the middle line.
        const mirror = turf.transformRotate(scaledPoly, 180, {pivot:toPoint});
        const mirrorAway = turf.transformRotate(mirror, 180, {pivot:myPoint});

        const poly = turf.polygon([[
            ...scaledPoly.geometry.coordinates,
            ...mirrorAway.geometry.coordinates.reverse(),
            scaledPoly.geometry.coordinates[0],
        ]])
        // const intersection = turf.intersect(poly, turf.polygon([perimeterCoords])) as Feature<turf.helpers.Polygon, {}>
        // return intersection.geometry.coordinates
        return poly
    })
    .reduce(
        (remainder, mask, j) => turf.intersect(remainder, mask) as Feature<turf.helpers.Polygon, {}> || remainder,
        turf.polygon([perimeterCoords])
    )

export const zones = allCoords
    .map((coords, i) => getZone(coords))
    .map((feature, i) => {
        const olFeature = new OLFeature(new Polygon(feature.geometry.coordinates).transform('EPSG:4326', 'EPSG:3857'))
        olFeature.setId(i + 1);
        return olFeature
    })

// export const debug = new OLFeature(new Polygon(area1).transform('EPSG:4326', 'EPSG:3857'))
// export const camps = campCoords
//     .map((coords) => new OLFeature(new LineString(coords).transform('EPSG:4326', 'EPSG:3857')))
