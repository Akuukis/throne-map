import '../static/styles.css'
import 'ol/ol.css'

import FillPattern from 'ol-ext/style/FillPattern'
import { defaults as defaultControls, ScaleLine } from 'ol/control'
import MousePosition from 'ol/control/MousePosition'
import { Extent, getCenter } from 'ol/extent'
import Feature, { FeatureLike } from 'ol/Feature'
import { Vector as VectorLayer } from 'ol/layer'
import BaseLayer from 'ol/layer/Base'
import ImageLayer from 'ol/layer/Image'
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import { transform } from 'ol/proj'
import { OSM, Vector as VectorSource } from 'ol/source'
import ImageStatic from 'ol/source/ImageStatic'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import View from 'ol/View'

import throneMap2020 from '../static/throne7.png'
import { perimeterLine, zones } from './zones'
import { captureTime, extent } from './data'

//                   kreisi  apaksa  labi    augsa
// console.log(getCenter(throne7Extent))

const opacity = 0.6

const style = new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.6)',
      width: 5,
    }),
    image: new Circle({
      radius: 12,
      stroke: new Stroke({
        color: '#fff'
      }),
      fill: new Fill({
        color: '#aaa'
      })
    }),
  })

export const styleFunction = (feature: FeatureLike) => {
    const id = feature.getId();
    console.log(id)
    const myCaptureTime = captureTime[id]
    if(!myCaptureTime) return [
        new Style({
            fill: new Fill({
                color: `rgba(0, 0, 0, ${opacity/2})`,
            }),
            geometry: (feature: Feature) => feature.getGeometry(),
        }),
    ]

    const spacing = 10
    const scale = 1
    const fill = new Fill({color: 'rgba(255, 0, 0, 0)'})
    const sizeBlue = spacing * myCaptureTime.blue / (480 - myCaptureTime.grey)
    const sizeGreen = spacing * myCaptureTime.green / (480 - myCaptureTime.grey)
    const sizeWhite = spacing * myCaptureTime.white / (480 - myCaptureTime.grey)
    const sizeYellow = spacing * myCaptureTime.yellow / (480 - myCaptureTime.grey)
    console.log(sizeBlue, sizeGreen, sizeWhite, sizeYellow)
    const styles = [
        new Style({
            fill: new FillPattern({
                pattern: 'hatch',
                color: `rgba(33, 150, 243, ${opacity})`,
                fill,
                size: sizeBlue,
                spacing,
                angle: 0,
                offset: (0) + sizeBlue / 2,
                scale,
            }),
        }),
        new Style({
            fill: new FillPattern({
                pattern: 'hatch',
                color: `rgba(76, 175, 80, ${opacity})`,
                fill,
                size: sizeGreen,
                spacing,
                angle: 0,
                offset: (sizeBlue) + sizeGreen / 2,
                scale,
            }),
        }),
        new Style({
            fill: new FillPattern({
                pattern: 'hatch',
                color: `rgba(255,255,255, ${opacity})`,
                fill,
                size: sizeWhite,
                spacing,
                angle: 0,
                offset: (sizeBlue + sizeGreen) + sizeWhite / 2,
                scale,
            }),
        }),
        new Style({
            fill: new FillPattern({
                pattern: 'hatch',
                color: `rgba(255, 235, 59, ${opacity})`,
                fill,
                size: sizeYellow,
                spacing,
                angle: 0,
                offset: (sizeBlue + sizeGreen + sizeWhite) + sizeYellow / 2,
                scale,
            }),
        }),
    ]

    return styles
}

;
(async () => {
    const imageLayer = new ImageLayer({
        source: new ImageStatic({
            imageExtent: extent,
            projection: 'EPSG:4326',
            url: throneMap2020,
        }),
    })
    imageLayer.setOpacity(opacity/2);
    const source = new VectorSource({wrapX: false});

    const layers = [
        new TileLayer({
            source: new OSM(),
        }),
        imageLayer,
        // new VectorLayer({
        //     source: new VectorSource({features: zones}),
        //     style: styleFunction,
        // }),
        new VectorLayer({
            source: new VectorSource({features: zones}),
            style,
        }),
        new VectorLayer({
            source: new VectorSource({features: [perimeterLine]}),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 1)',
                    width: 5,
                }),
            }),
        }),
        new VectorLayer({
            source: source,
        }),
    ] as BaseLayer[]

    // https://openlayers.org/en/latest/examples/mouse-position.html?q=mouse
    const mousePositionControlLatLong = new MousePosition({
        className: 'custom-mouse-position-latlong',
        coordinateFormat: ([x, y]) => `Lat.Long.: ${Math.floor(x * 10000) / 10000}, ${Math.floor(y * 10000) / 10000}`,
        projection: 'EPSG:4326',
        target: document.getElementById('mouse-position-latlong'),
        undefinedHTML: '&nbsp;',
    })

    const map = new Map({
        controls: defaultControls().extend([
            new ScaleLine({
            }),
            mousePositionControlLatLong,
        ]),
        layers,
        target: 'map',
        view: new View({
            center: transform(getCenter(extent), 'EPSG:4326', 'EPSG:3857'),
            // extent: coe.extent,
            // projection: coe.projection,
            zoom: 16.4,
        }),
    })

    map.on('click', function(event) {
        const text = JSON.stringify(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
            .map((coord) => Number(coord.toFixed(4))))
        alert(text);
    });

    console.info('Done!')
})()
    .catch((err) => console.error(err))

