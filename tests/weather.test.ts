import {describe, expect, it} from 'vitest';
import {parseWeather, weatherLabel, weatherScene} from '../src/lib/weather';

describe('weather response and artwork', () => {
	it('accepts a complete current-weather response', () => {
		expect(parseWeather({current: {temperature_2m: 18.6, weather_code: 3, is_day: 0}}))
			.toEqual({temperature: 19, code: 3, isDay: false});
	});

	it('omits malformed weather instead of displaying invented values', () => {
		expect(parseWeather({current: {temperature_2m: null, weather_code: 0, is_day: 1}})).toBeNull();
		expect(parseWeather({current: {temperature_2m: 20, weather_code: 0}})).toBeNull();
	});

	it('uses daylight and condition for the artwork', () => {
		expect(weatherScene(0, true)).toBe('sun');
		expect(weatherScene(0, false)).toBe('moon');
		expect(weatherScene(3, false)).toBe('cloud');
		expect(weatherScene(61, true)).toBe('rain');
		expect(weatherLabel(3)).toBe('Nublado');
	});
});
