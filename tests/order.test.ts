import {describe, expect, it} from 'vitest';
import {moveItem} from '../src/lib/order';

describe('moveItem', () => {
	it('moves an item without mutating the input', () => {
		const original = ['iptv', 'netflix', 'youtube'];
		expect(moveItem(original, 0, 2)).toEqual(['netflix', 'youtube', 'iptv']);
		expect(original).toEqual(['iptv', 'netflix', 'youtube']);
	});

	it('clamps invalid positions safely', () => {
		expect(moveItem(['a', 'b', 'c'], -9, 99)).toEqual(['b', 'c', 'a']);
	});
});
