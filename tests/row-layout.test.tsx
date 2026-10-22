import {cleanup, render} from '@testing-library/preact';
import {afterEach, describe, expect, it} from 'vitest';
import {Row, appTileWidth} from '../src/components/Row';
import {LAYOUT} from '../src/theme/tokens';
import {Glyph} from '../src/components/Glyph';
import type {TileModel} from '../src/components/Tile';

const items: TileModel[] = [
	{key: 'one', label: 'One'},
	{key: 'two', label: 'Two'}
];

describe('home row structure', () => {
	afterEach(cleanup);

	it('keeps the app rail accessible while removing its visible heading', () => {
		const view = render(<Row rowId="apps" label="Aplicativos" items={items} focused selected={0} onSelect={() => undefined} onActivate={() => undefined} />);
		expect(view.container.querySelector('section')?.getAttribute('aria-label')).toBe('Aplicativos');
		expect(view.container.querySelector('.row__label')).toBeNull();
		expect(view.container.querySelector('.row__track--centered')).not.toBeNull();
	});

	it('aligns compact tiles with the row heading instead of centering them', () => {
		for (const rowId of ['sources', 'misc']) {
			const view = render(<Row rowId={rowId} label={rowId} items={items} focused={false} selected={0} onSelect={() => undefined} onActivate={() => undefined} />);
			expect(view.container.querySelector('.row__label')?.textContent).toBe(rowId);
			expect(view.container.querySelector('.row__track--centered')).toBeNull();
			view.unmount();
		}
	});

	it('grows app cards as apps are removed, with an upper bound', () => {
		expect(appTileWidth(6)).toBe(234);
		expect(appTileWidth(5)).toBe(286);
		expect(appTileWidth(4)).toBe(300);
		expect(appTileWidth(1)).toBe(300);
	});

	it('keeps each fitting app set within the padded rail', () => {
		const safeWidth = LAYOUT.screenWidth - 2 * LAYOUT.edgePadding - 58 - 64;
		for (let count = 1; count <= 9; count++) {
			const width = appTileWidth(count);
			const occupied = count * width + (count - 1) * LAYOUT.tileGap;
			if (occupied > safeWidth) break; // larger collections scroll instead
			expect(occupied).toBeLessThanOrEqual(safeWidth);
			const entries = Array.from({length: count}, (_, i) => ({key: `${i}`, label: `App ${i}`}));
			const view = render(<Row rowId="apps" label="Aplicativos" items={entries} focused selected={0} onSelect={() => undefined} onActivate={() => undefined} />);
			expect(view.container.querySelector('.row__track--centered')).not.toBeNull();
			expect((view.container.querySelector('section') as HTMLElement).style.getPropertyValue('--app-tile-width')).toBe(`${width}px`);
			view.unmount();
		}
	});

	it('scrolls instead of shrinking cards below the minimum', () => {
		const entries = Array.from({length: 12}, (_, i) => ({key: `${i}`, label: `App ${i}`}));
		const view = render(<Row rowId="apps" label="Aplicativos" items={entries} focused selected={11} onSelect={() => undefined} onActivate={() => undefined} />);
		expect(appTileWidth(entries.length)).toBe(150);
		expect(view.container.querySelector('.row__track--centered')).toBeNull();
		expect((view.container.querySelector('.row__track') as HTMLElement).style.transform).toMatch(/translateX\(-\d+px\)/);
	});

	it('renders settings as a toothed gear rather than radial rays', () => {
		const view = render(<Glyph name="gear" />);
		const paths = view.container.querySelectorAll('path');
		expect(paths).toHaveLength(1);
		expect(paths[0].getAttribute('d')).toMatch(/Z$/);
		expect(view.container.querySelector('circle')).not.toBeNull();
	});
});
