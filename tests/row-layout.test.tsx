import {cleanup, render} from '@testing-library/preact';
import {afterEach, describe, expect, it} from 'vitest';
import {Row} from '../src/components/Row';
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
});
