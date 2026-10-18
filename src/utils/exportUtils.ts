import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Character, StudioScene } from '../types';

/** true cuando la app corre dentro del APK de Android/iOS (Capacitor). */
const isNative = (): boolean => Capacitor.isNativePlatform();

/** Convierte un nombre libre en un nombre de archivo seguro (sin acentos ni símbolos). */
function toSafeFileName(name: string, extension: string): string {
  const base =
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 60) || 'chibiverse';
  return `${base}.${extension}`;
}

/**
 * Guarda un archivo en el almacenamiento del dispositivo (carpeta Chibiverse)
 * y abre el diálogo de Android para compartirlo/guardarlo en otra app.
 * Se intenta primero Documentos y, si el sistema lo bloquea, la caché interna.
 */
async function saveFileNative(fileName: string, data: string, isBase64: boolean): Promise<string> {
  const folders = [Directory.Documents, Directory.Cache];
  let savedUri = '';
  let lastError: unknown;

  for (const directory of folders) {
    try {
      const result = await Filesystem.writeFile({
        path: `Chibiverse/${fileName}`,
        data,
        directory,
        recursive: true,
        // Sin `encoding` el plugin interpreta `data` como base64 (PNG);
        // con UTF8 lo escribe como texto plano (JSON).
        ...(isBase64 ? {} : { encoding: Encoding.UTF8 }),
      });
      savedUri = result.uri;
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!savedUri) {
    throw lastError instanceof Error ? lastError : new Error('No se pudo guardar el archivo en el dispositivo.');
  }

  try {
    await Share.share({
      title: fileName,
      url: savedUri,
      dialogTitle: 'Guardar o compartir',
    });
  } catch {
    // El usuario canceló el diálogo o no hay apps compatibles.
    // El archivo igualmente quedó guardado en la carpeta Chibiverse.
  }

  return savedUri;
}

/** Extrae el contenido base64 de un data URL (image/png;base64,...). */
function dataUrlToBase64(dataUrl: string): string {
  const separator = dataUrl.indexOf(',');
  return separator >= 0 ? dataUrl.slice(separator + 1) : dataUrl;
}

/** Descarga un archivo desde el navegador (versión web). */
function downloadInBrowser(fileName: string, href: string): void {
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports a character data object as a JSON file or provides shareable JSON string.
 */
export async function exportCharacterJSON(character: Character): Promise<void> {
  const fileName = toSafeFileName(`${character.name}_chibi`, 'json');
  const jsonStr = JSON.stringify(character, null, 2);

  if (isNative()) {
    await saveFileNative(fileName, jsonStr, false);
    return;
  }

  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadInBrowser(fileName, url);
  URL.revokeObjectURL(url);
}

/**
 * Exports an SVG element to high-res PNG
 */
export async function exportSvgToPng(svgElement: SVGSVGElement, fileName: string, width = 800, height = 960): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);

      // Add namespaces if missing
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/^<svg[^>]+xmlns\:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw transparent or pastel background
        ctx.drawImage(img, 0, 0, width, height);

        const pngUrl = canvas.toDataURL('image/png');

        if (isNative()) {
          saveFileNative(toSafeFileName(fileName, 'png'), dataUrlToBase64(pngUrl), true)
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          downloadInBrowser(`${fileName}.png`, pngUrl);
          resolve();
        }

        URL.revokeObjectURL(url);
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Exports entire Studio Scene HTML container (characters, speech bubbles, stickers, background) as PNG
 */
export async function exportStudioScene(sceneContainer: HTMLElement, sceneName: string): Promise<void> {
  // Capture HTML container to canvas
  const canvas = document.createElement('canvas');
  const rect = sceneContainer.getBoundingClientRect();
  const width = 1280;
  const height = 720;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background gradient or color
  ctx.fillStyle = '#FFF0F5';
  ctx.fillRect(0, 0, width, height);

  // Read svg elements inside sceneContainer and draw them
  const svgs = sceneContainer.querySelectorAll('svg');
  const promises: Promise<void>[] = [];

  svgs.forEach((svg) => {
    const p = new Promise<void>((resolve) => {
      const svgRect = svg.getBoundingClientRect();
      const relX = ((svgRect.left - rect.left) / rect.width) * width;
      const relY = ((svgRect.top - rect.top) / rect.height) * height;
      const relW = (svgRect.width / rect.width) * width;
      const relH = (svgRect.height / rect.height) * height;

      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        ctx.drawImage(img, relX, relY, relW, relH);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      img.src = url;
    });
    promises.push(p);
  });

  await Promise.all(promises);

  // Draw text bubbles from HTML
  const bubbles = sceneContainer.querySelectorAll('.studio-bubble');
  bubbles.forEach((b) => {
    const bRect = b.getBoundingClientRect();
    const bx = ((bRect.left - rect.left) / rect.width) * width;
    const by = ((bRect.top - rect.top) / rect.height) * height;
    const bw = (bRect.width / rect.width) * width;
    const bh = (bRect.height / rect.height) * height;

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#4A3B52';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#3D344B';
    ctx.font = 'bold 20px Quicksand, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((b.textContent || '').trim(), bx + bw / 2, by + bh / 2, bw - 20);
    ctx.restore();
  });

  const pngUrl = canvas.toDataURL('image/png');
  const fileName = toSafeFileName(`${sceneName}_escena`, 'png');

  if (isNative()) {
    await saveFileNative(fileName, dataUrlToBase64(pngUrl), true);
    return;
  }

  downloadInBrowser(fileName, pngUrl);
}
