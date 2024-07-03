/* eslint-disable functional/no-let */

/* eslint-disable functional/immutable-data */
import { clonePseudoElements } from './clone-pseudos';
import type { Options } from './types';
import { createImage, isInstanceOfElement, toArray } from './util';

async function cloneCanvasElement(canvas: HTMLCanvasElement) {
  const dataURL = canvas.toDataURL();
  if (dataURL === 'data:,') {
    return canvas.cloneNode(false) as HTMLCanvasElement;
  }
  return createImage(dataURL);
}

async function cloneSingleNode<T extends HTMLElement>(
  node: T
  // options: Options
): Promise<HTMLElement> {
  if (isInstanceOfElement(node, HTMLCanvasElement)) {
    return cloneCanvasElement(node);
  }

  return node.cloneNode(false) as T;
}

async function cloneChildren<T extends HTMLElement>(
  nativeNode: T,
  clonedNode: T,
  options: Options
): Promise<T> {
  const children: Array<T> = toArray<T>((nativeNode.shadowRoot ?? nativeNode).childNodes);

  if (children.length === 0) {
    return clonedNode;
  }

  await children.reduce(
    (deferred, child) =>
      deferred
        .then(() => cloneNode(child, options))
        .then((clonedChild: HTMLElement | null) => {
          if (clonedChild) {
            clonedNode.appendChild(clonedChild);
          }
        }),
    Promise.resolve()
  );

  return clonedNode;
}

function cloneCSSStyle<T extends HTMLElement>(nativeNode: T, clonedNode: T) {
  const targetStyle = clonedNode.style;
  if (!targetStyle) {
    return;
  }

  const sourceStyle = window.getComputedStyle(nativeNode);
  if (sourceStyle.cssText) {
    targetStyle.cssText = sourceStyle.cssText;
    targetStyle.transformOrigin = sourceStyle.transformOrigin;
  } else {
    toArray<string>(sourceStyle).forEach((name) => {
      let value = sourceStyle.getPropertyValue(name);
      if (name === 'font-size' && value.endsWith('px')) {
        // CUSTOM: we remove from font parameter 2.5 instead of 0.1
        const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 2.5;
        value = `${reducedFont}px`;
      }

      if (name === 'd' && clonedNode.getAttribute('d')) {
        value = `path(${clonedNode.getAttribute('d')})`;
      }

      targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
    });
  }
}

function cloneSelectValue<T extends HTMLElement>(nativeNode: T, clonedNode: T) {
  if (isInstanceOfElement(nativeNode, HTMLSelectElement)) {
    const clonedSelect = clonedNode as any as HTMLSelectElement;
    const selectedOption = Array.from(clonedSelect.children).find(
      (child) => nativeNode.value === child.getAttribute('value')
    );

    if (selectedOption) {
      selectedOption.setAttribute('selected', '');
    }
  }
}

function decorate<T extends HTMLElement>(nativeNode: T, clonedNode: T): T {
  if (isInstanceOfElement(clonedNode, Element)) {
    cloneCSSStyle(nativeNode, clonedNode);
    clonePseudoElements(nativeNode, clonedNode);
    cloneSelectValue(nativeNode, clonedNode);
  }

  return clonedNode;
}

async function ensureSVGSymbols<T extends HTMLElement>(clone: T, options: Options) {
  const uses = clone.querySelectorAll ? clone.querySelectorAll('use') : [];
  if (uses.length === 0) {
    return clone;
  }

  const processedDefs: { [key: string]: HTMLElement } = {};

  uses.forEach(async (use) => {
    const id = use.getAttribute('xlink:href');
    if (id) {
      const exist = clone.querySelector(id);
      const definition = document.querySelector(id) as HTMLElement;
      if (!exist && definition && !processedDefs[id]) {
        // eslint-disable-next-line no-await-in-loop
        processedDefs[id] = (await cloneNode(definition, options, true))!;
      }
    }
  });

  const nodes = Object.values(processedDefs);
  if (nodes.length) {
    const ns = 'http://www.w3.org/1999/xhtml';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('xmlns', ns);
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.overflow = 'hidden';
    svg.style.display = 'none';

    const defs = document.createElementNS(ns, 'defs');
    svg.appendChild(defs);

    nodes.forEach((node) => defs.appendChild(node));

    clone.appendChild(svg);
  }

  return clone;
}

// CUSTOM: we remove classes from the cloned element
function removeClasses<T extends HTMLElement>(clone: T) {
  if (clone.removeAttribute) {
    clone.removeAttribute('class');
  }
  return clone;
}

export async function cloneNode<T extends HTMLElement>(
  node: T,
  options: Options,
  isRoot?: boolean
): Promise<T | null> {
  if (!isRoot && options.filter && !options.filter(node)) {
    return null;
  }

  return Promise.resolve(node)
    .then((clonedNode) => cloneSingleNode(clonedNode) as Promise<T>)
    .then((clonedNode) => cloneChildren(node, clonedNode, options))
    .then((clonedNode) => decorate(node, clonedNode))
    .then((clonedNode) => ensureSVGSymbols(clonedNode, options))
    .then((clonedNode) => removeClasses(clonedNode));
}
