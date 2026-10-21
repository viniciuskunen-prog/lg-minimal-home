import {beforeEach, describe, expect, it} from 'vitest';
import {DEFAULT_CONFIG, loadConfig, saveConfig} from '../src/lib/storage';
import {STORAGE_KEY} from '../src/config/constants';

describe('home configuration', () => {
	beforeEach(() => localStorage.clear());

	it('keeps Homebrew root integration off for a fresh installation', () => {
		expect(DEFAULT_CONFIG.useHomebrew).toBe(false);
		expect(loadConfig().useHomebrew).toBe(false);
	});

	it('preserves an existing opt-in stored by a prior installation', () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({
			appIds: ['netflix'], sourceIds: null, useHomebrew: true
		}));
		expect(loadConfig()).toMatchObject({appIds: ['netflix'], useHomebrew: true});
	});

	it('persists an explicit opt-in', () => {
		saveConfig({...DEFAULT_CONFIG, useHomebrew: true});
		expect(loadConfig().useHomebrew).toBe(true);
	});
});
