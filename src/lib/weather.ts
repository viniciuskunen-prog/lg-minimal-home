export interface WeatherLocation {
	name: string;
	latitude: number;
	longitude: number;
}

export interface WeatherSnapshot {
	temperature: number;
	code: number;
	isDay: boolean;
}

export type WeatherScene = 'sun' | 'moon' | 'cloud' | 'rain';

/** A private build may provide a city; the open-source build has no household location. */
export function configuredWeatherLocation (): WeatherLocation | null {
	const name = import.meta.env.VITE_WEATHER_CITY;
	const rawLatitude = import.meta.env.VITE_WEATHER_LAT;
	const rawLongitude = import.meta.env.VITE_WEATHER_LON;
	if (!name || !rawLatitude || !rawLongitude) return null;
	const latitude = Number(rawLatitude);
	const longitude = Number(rawLongitude);
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
		Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
	return {name, latitude, longitude};
}

export function weatherScene (code: number, isDay: boolean): WeatherScene {
	if (code === 0) return isDay ? 'sun' : 'moon';
	if (code >= 1 && code <= 3 || code === 45 || code === 48) return 'cloud';
	return 'rain';
}

export function weatherLabel (code: number): string {
	if (code === 0) return 'Céu limpo';
	if (code === 1 || code === 2) return 'Parcialmente nublado';
	if (code === 3) return 'Nublado';
	if (code === 45 || code === 48) return 'Neblina';
	if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return 'Chuva';
	if (code >= 71 && code <= 77 || code === 85 || code === 86) return 'Neve';
	if (code >= 95 && code <= 99) return 'Tempestade';
	return 'Condição variável';
}

/** The forecast endpoint returns current conditions for one configured city. */
export function parseWeather (value: unknown): WeatherSnapshot | null {
	if (!value || typeof value !== 'object' || !('current' in value)) return null;
	const current = (value as {current?: unknown}).current;
	if (!current || typeof current !== 'object') return null;
	const item = current as {temperature_2m?: unknown; weather_code?: unknown; is_day?: unknown};
	if (typeof item.temperature_2m !== 'number' || !Number.isFinite(item.temperature_2m) ||
		typeof item.weather_code !== 'number' || !Number.isInteger(item.weather_code) ||
		(item.is_day !== 0 && item.is_day !== 1)) return null;
	return {temperature: Math.round(item.temperature_2m), code: item.weather_code, isDay: item.is_day === 1};
}

export async function fetchWeather (location: WeatherLocation): Promise<WeatherSnapshot> {
	const query = `latitude=${encodeURIComponent(location.latitude)}&longitude=${encodeURIComponent(location.longitude)}` +
		'&current=temperature_2m,weather_code,is_day&timezone=auto&forecast_days=1';
	const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`);
	if (!response.ok) throw new Error('Weather service unavailable');
	const parsed = parseWeather(await response.json());
	if (!parsed) throw new Error('Invalid weather response');
	return parsed;
}
