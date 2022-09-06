import argv from 'minimist';
import axios from 'axios';
import { joinImages } from 'join-images';

const {
    greeting = 'Hello',
    who = 'You',
    width = 400,
    height = 500,
    color = 'pink',
    size = 100,
} = argv;

const domain = 'https://cataas.com/cat/says/';
const details = `?width=${width}&height=${height}&color=${color}&s=${size}`;
const encoding = 'binary';
const outputName = 'cat-card.jpg';
const firstUrl = domain + greeting + details;
const secondUrl = domain + who + details;
const firstRequest = axios.get(firstUrl, { responseEncoding: encoding });
const secondRequest = axios.get(secondUrl, { responseEncoding: encoding });

Promise.all([firstRequest, secondRequest])
    .then((responses) => {
        const firstResponse = responses[0].data;
        const secondResponse = responses[1].data;
        const firstBuffer = Buffer.from(firstResponse, encoding);
        const secondBuffer = Buffer.from(secondResponse, encoding);

        joinImages([
            { src: firstBuffer, offsetX: 0, offsetY: 0 },
            { src: secondBuffer, offsetX: width, offsetY: 0 },
        ])
            .then((image) => image.toFile(outputName))
            .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
