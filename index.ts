import { writeFile } from 'fs';
import { faker } from '@faker-js/faker';
import data from './data.json' assert { type: "json" };
import tokml from 'tokml';
import togeojson from '@mapbox/togeojson';
import { DOMParser } from 'xmldom'

import { buildGPX, GarminBuilder, BaseBuilder } from 'gpx-builder';

const { Point, Track, Segment } = GarminBuilder.MODELS;


console.log('hello 👋');

console.log(data.all_steps[0].location.name);

const stepChunksArray: [typeof data.all_steps[]] = [[]];
// add step type definition
const steps_paths = data.all_steps.reduce((stepChunks, step) => {
    if ('media' in step) {
        stepChunks.at(-1).push(step);
        stepChunks.push([]);
    }
    stepChunks.at(-1).push(step);

    return stepChunks;
}, [[]])

const gpxData = new GarminBuilder();
let tracks: InstanceType<typeof Track>[] = [];

steps_paths.forEach(stepArr => {
    // add step type definition
    const points = stepArr.map((step) => {
        return new Point(step.location.lat, step.location.lon, {
            ele: 0,
            time: new Date(step.start_time * 1000),
        })
    })
    tracks.push(new Track([new Segment(points)], {
        name: `${stepArr.at(0)?.name} -> ${stepArr.at(-1)?.name}`
    }))
})

gpxData.setTracks(tracks);

const out = buildGPX(gpxData.toObject());
console.log('writing out...');

writeFile('data.gpx', out, () => {
    console.log('data.gpx done!');

})

const rawData = new DOMParser().parseFromString(out);
const kml = tokml(togeojson.gpx(rawData));

writeFile('data.kml', kml, () => {
    console.log('data.kml done!');

})