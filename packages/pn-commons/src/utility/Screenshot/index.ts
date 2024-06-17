/* eslint-disable functional/immutable-data */
import { applyStyle } from './apply-style';
import { cloneNode } from './clone-node';
import { embedImages } from './embed-images';
import {
  embedWebFonts, // getWebFontCSS
} from './embed-webfonts';
import { Options } from './types';
import {
  // canvasToBlob,
  checkCanvasDimensions,
  createImage,
  getImageSize,
  getPixelRatio,
  nodeToDataURL,
} from './util';

export async function toSvg<T extends HTMLElement>(
  node: T,
  options: Options = {}
): Promise<string> {
  const { width, height } = getImageSize(node, options);
  const clonedNode = (await cloneNode(node, options, true)) as HTMLElement;
  await embedWebFonts(clonedNode, options);
  await embedImages(clonedNode, options);
  applyStyle(clonedNode, options);
  return await nodeToDataURL(clonedNode, width, height);
}

export async function toCanvas<T extends HTMLElement>(
  node: T,
  options: Options = {}
): Promise<HTMLCanvasElement> {
  const { width, height } = getImageSize(node, options);
  const svg = await toSvg(node, options);
  const img = await createImage(svg);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const ratio = options.pixelRatio ?? getPixelRatio();
  const canvasWidth = options.canvasWidth ?? width;
  const canvasHeight = options.canvasHeight ?? height;

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
