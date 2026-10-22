import {render, cleanup, fireEvent} from '@testing-library/preact';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {Home, type HomeRow} from '../src/screens/Home';

const rows: HomeRow[] = [
	{id: 'apps', label: 'Aplicativos', items: [{key: 'netflix', label: 'Netflix'}]},
	{id: 'sources', label: 'Fontes', items: [{key: 'hdmi1', label: 'HDMI 1'}]},
	{id: 'misc', label: 'Mais', items: [{key: 'settings', label: 'Ajustes'}]}
];

function keyDown (keyCode: number): void {
	fireEvent.keyDown(window, {keyCode});
}

describe('Home remote navigation', () => {
	afterEach(cleanup);

	it('opens the initially focused app with OK', () => {
		const onActivate = vi.fn();
		render(<Home rows={rows} active onActivate={onActivate} />);
		keyDown(13);
		expect(onActivate).toHaveBeenCalledWith('apps', rows[0].items[0]);
	});

	it('maps Up to the row visually above the bottom app rail', () => {
		const onActivate = vi.fn();
		render(<Home rows={rows} active onActivate={onActivate} />);
		keyDown(38);
		keyDown(13);
		expect(onActivate).toHaveBeenCalledWith('sources', rows[1].items[0]);
	});

	it('does not move below the bottom app rail when Down is pressed', () => {
		const onActivate = vi.fn();
		render(<Home rows={rows} active onActivate={onActivate} />);
		keyDown(40);
		keyDown(13);
		expect(onActivate).toHaveBeenCalledWith('apps', rows[0].items[0]);
	});
});
