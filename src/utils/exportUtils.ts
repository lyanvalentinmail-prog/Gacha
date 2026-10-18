import { Character, StudioScene } from '../types';

/**
 * Downloads a character data object as a JSON file or provides shareable JSON string.
 */
export function exportCharacterJSON(character: Character) {
  const jsonStr = JSON.stringify(character, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name.toLowerCase().replace(/\s+/g, '_')}_chibi.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${fileName}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        resolve();
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

  // Download
  const pngUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = pngUrl;
  a.download = `${sceneName.toLowerCase().replace(/\s+/g, '_')}_escena.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
