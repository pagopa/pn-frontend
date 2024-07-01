/*
The code into the folder Screenshot is taken from the library https://github.com/bubkoo/html-to-image/releases/tag/v1.11.11.
We has removed all that code that useless, and we have added some custom code.
The custom code has been targetted with the label CUSTOM.
---------
Andrea Cimini - 1/07/2024 
*/

/* eslint-disable functional/immutable-data */
import { applyStyle } from './apply-style';
import { cloneNode } from './clone-node';
import { embedImages } from './embed-images';
import { embedWebFonts } from './embed-webfonts';
import { Options } from './types';
import {
  checkCanvasDimensions,
  createImage,
  getImageSize,
  getPixelRatio,
  nodeToDataURL,
} from './util';

async function toSvg<T extends HTMLElement>(node: T, options: Options = {}): Promise<string> {
  const { width, height } = getImageSize(node);
  const clonedNode = await cloneNode(node, options, true);
  if (!clonedNode) {
    console.debug('No node cloned');
    return Promise.resolve('');
  }
  await embedWebFonts(clonedNode, options);
  await embedImages(clonedNode, options);
  applyStyle(clonedNode, options);
  return await nodeToDataURL(clonedNode, width, height);
}

async function toCanvas<T extends HTMLElement>(
  node: T,
  options: Options = {}
): Promise<HTMLCanvasElement> {
  const { width, height } = getImageSize(node);
  const svg = await toSvg(node, options);
  const img = await createImage(svg);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const ratio = getPixelRatio();
  const canvasWidth = width;
  const canvasHeight = height;

  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;

  if (!options.skipAutoScale) {
    checkCanvasDimensions(canvas);
  }
  canvas.style.width = `${canvasWidth}`;
  canvas.style.height = `${canvasHeight}`;

  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
}

export async function toJpeg<T extends HTMLElement>(
  node: T,
  options: Options = {}
): Promise<string> {
  const canvas = await toCanvas(node, options);
  return canvas.toDataURL('image/jpeg', options.quality ?? 1);
}
