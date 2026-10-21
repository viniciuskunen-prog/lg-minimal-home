import {render, cleanup, fireEvent} from '@testing-library/preact';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {Settings} from '../src/screens/Settings';

function key (type: 'keydown' | 'keyup', keyCode: number): void {
	if (type === 'keydown') fireEvent.keyDown(window, {keyCode});
	else fireEvent.keyUp(window, {keyCode});
}

describe('Settings remote navigation', () => {
	afterEach(cleanup);

	it('selects an app through Down then OK', () => {
		const onToggle = vi.fn();
		render(
			<Settings
				active
				tabs={[{id: 'apps', label: 'Aplicativos', noun: 'aplicativos', items: [{key: 'netflix', label: 'Netflix'}], shown: []}]}
				options={[]}
				onToggle={onToggle}
				onReorder={vi.fn()}
				onOption={vi.fn()}
				onClose={vi.fn()}
			/>
		);
		key('keydown', 40);
		key('keydown', 13);
		key('keyup', 13);
		expect(onToggle).toHaveBeenCalledWith('apps', 'netflix');
	});
});
