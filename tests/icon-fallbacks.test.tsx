import {cleanup, fireEvent, render} from '@testing-library/preact';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {Tile} from '../src/components/Tile';
import {inputGlyphForHint} from '../src/lib/inputs';
import {edgeBackground} from '../src/lib/iconBackground';
import {appTile, inputTile} from '../src/lib/tiles';

describe('icon-free visual fallbacks', () => {
	afterEach(() => { cleanup(); vi.restoreAllMocks(); });

	it('renders a catalogue app without artwork as a monogram', () => {
		const model = appTile({id: 'example', title: 'Example', color: '#456789'});
		const view = render(<Tile model={model} focused={false} />);
		expect(model.imageUrl).toBeUndefined();
		expect(view.container.querySelector('.tile__monogram')?.textContent).toBe('E');
	});

	it('keeps a runtime-provided app icon without bundling a fallback asset', () => {
		const model = appTile({id: 'runtime', title: 'Runtime', iconUrl: 'data:image/png;base64,AA==', color: '#123456'});
		expect(model.imageUrl).toBe('data:image/png;base64,AA==');
		expect(model.glyph).toBeUndefined();
		const view = render(<Tile model={model} focused={false} />);
		expect(view.container.querySelector('.tile__image')?.getAttribute('src')).toBe(model.imageUrl);
		expect(view.container.querySelector('.tile__box')?.getAttribute('style')).toContain('rgb(18, 52, 86)');
		fireEvent.error(view.container.querySelector('.tile__image') as HTMLImageElement);
		expect(view.container.querySelector('.tile__image')).toBeNull();
		expect(view.container.querySelector('.tile__monogram')?.textContent).toBe('R');
	});

	it('matches a uniformly coloured TV icon edge, without retaining the artwork', () => {
		const pixels = new Uint8ClampedArray(40 * 40 * 4);
		for (let i = 0; i < pixels.length; i += 4) {
			pixels[i] = 21; pixels[i + 1] = 40; pixels[i + 2] = 88; pixels[i + 3] = 255;
		}
		expect(edgeBackground(pixels, 40, 40)).toBe('rgb(21, 40, 88)');
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
			drawImage: () => undefined,
			getImageData: () => ({data: pixels})
		} as unknown as CanvasRenderingContext2D);
		const view = render(<Tile model={appTile({id: 'tv', title: 'TV', iconUrl: 'data:image/png;base64,AA=='})} focused={true} />);
		fireEvent.load(view.container.querySelector('.tile__image') as HTMLImageElement);
		expect(view.container.querySelector('.tile__box')?.getAttribute('style')).toContain('rgb(21, 40, 88)');
	});

	it('keeps the project fallback for transparent or mixed-colour icon edges', () => {
		const transparent = new Uint8ClampedArray(40 * 40 * 4);
		expect(edgeBackground(transparent, 40, 40)).toBeUndefined();
		const mixed = new Uint8ClampedArray(40 * 40 * 4);
		for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) {
			const i = (y * 40 + x) * 4;
			mixed[i] = x < 20 ? 255 : 0;
			mixed[i + 2] = x < 20 ? 0 : 255;
			mixed[i + 3] = 255;
		}
		expect(edgeBackground(mixed, 40, 40)).toBeUndefined();
	});

	it('maps runtime input hints to authored glyphs instead of image paths', () => {
		expect(inputGlyphForHint('HDMI_1.png')).toBe('hdmi');
		expect(inputGlyphForHint('streamingbox.png HDMI_1 com.webos.app.hdmi1')).toBe('hdmi');
		expect(inputGlyphForHint('usb-port.png')).toBe('usb');
		expect(inputGlyphForHint('antenna.png')).toBe('antenna');
		expect(inputGlyphForHint(undefined)).toBe('device');

		const model = inputTile({
			id: 'HDMI_1', appId: 'com.webos.app.hdmi1', label: 'HDMI 1',
			port: 1, connected: true, glyph: 'hdmi'
		});
		expect(model).toMatchObject({glyph: 'hdmi'});
		expect(model.imageUrl).toBeUndefined();
	});
});
