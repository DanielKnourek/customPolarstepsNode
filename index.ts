import { writeFile } from 'fs';
import { faker } from '@faker-js/faker';
import data from './data.json' assert { type: "json" };

import { buildGPX, GarminBuilder } from 'gpx-builder';

const { Point } = GarminBuilder.MODELS;

console.log('hello 👋');

console.log(data.all_steps[0].location.name);

console.log(faker.internet.exampleEmail());

console.log(`name: ${data.name} | start	: ${data.start_date}`);


// const points = [
//     new Point(51.02832496166229, 15.515156626701355, {
//         ele: 314.715,
//         time: new Date('2018-06-10T17:29:35Z'),
//         hr: 120,
//     }),
//     new Point(51.12832496166229, 15.615156626701355, {
//         ele: 314.715,
//         time: new Date('2018-06-10T17:39:35Z'),
//         hr: 121,
//     }),
// ];
const points = data.all_steps.map((step) => {
    return new Point(step.location.lat, step.location.lon, {
        ele: 0,
        time: new Date(step.start_time * 1000)
    })
})

const gpxData = new GarminBuilder();

gpxData.setSegmentPoints(points);

const out = buildGPX(gpxData.toObject());
console.log('writing out...');

writeFile('data.gpx', out, () => {
    console.log('done!');

})