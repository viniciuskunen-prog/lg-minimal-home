import {cleanup, render} from '@testing-library/preact';
import {afterEach, describe, expect, it} from 'vitest';
import {Tile} from '../src/components/Tile';
import {inputGlyphForHint} from '../src/lib/inputs';
import {appTile, inputTile} from '../src/lib/tiles';

describe('icon-free visual fallbacks', () => {
	afterEach(cleanup);

	it('renders a catalogue app without artwork as a monogram', () => {
		const model = appTile({id: 'example', title: 'Example', color: '#456789'});
		const view = render(<Tile model={model} focused={false} />);
		expect(model.imageUrl).toBeUndefined();
		expect(view.container.querySelector('.tile__monogram')?.textContent).toBe('E');
	});

	it('keeps a runtime-provided app icon without bundling a fallback asset', () => {
		const model = appTile({id: 'runtime', title: 'Runtime', iconUrl: 'data:image/png;base64,AA=='});
		expect(model.imageUrl).toBe('data:image/png;base64,AA==');
		expect(model.glyph).toBeUndefined();
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
