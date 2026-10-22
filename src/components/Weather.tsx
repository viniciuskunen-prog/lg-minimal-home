import {useEffect, useState} from 'preact/hooks';
import {configuredWeatherLocation, fetchWeather, weatherLabel, weatherScene, type WeatherScene, type WeatherSnapshot} from '../lib/weather';

const LOCATION = configuredWeatherLocation();
const REFRESH_MS = 30 * 60 * 1000;

function WeatherArtwork ({scene}: {scene: WeatherScene}) {
	return (
		<svg class={`weather__art weather__art--${scene}`} viewBox="0 0 112 112" aria-hidden="true">
			{scene === 'sun' && <g class="weather__sun"><circle cx="56" cy="56" r="20" fill="#ffe4aa"/><circle cx="56" cy="56" r="30" fill="none" stroke="#ffe4aa" stroke-width="2" stroke-dasharray="4 10"/></g>}
			{scene === 'moon' && <g class="weather__moon"><path d="M70 22a35 35 0 1 0 23 64A39 39 0 0 1 70 22Z" fill="#f9e8e0"/><circle cx="30" cy="26" r="2" fill="#fff"/><circle cx="86" cy="25" r="1.5" fill="#fff"/></g>}
			{scene === 'cloud' && <g class="weather__cloud"><path d="M31 77c-11 0-18-7-18-17 0-10 8-17 18-17 3-14 14-23 29-23 13 0 24 7 29 19 11 0 19 8 19 19 0 11-8 19-20 19Z" fill="#d9d5f6" opacity=".92"/></g>}
			{scene === 'rain' && <g class="weather__rain"><path d="M29 68c-10 0-16-7-16-16 0-9 7-16 16-16 3-13 14-21 27-21 13 0 23 7 28 18 10 0 17 8 17 18 0 10-7 17-18 17Z" fill="#d9d5f6" opacity=".9"/><path d="m35 79-6 12m28-12-6 12m28-12-6 12" fill="none" stroke="#9ac7ff" stroke-width="5" stroke-linecap="round"/></g>}
		</svg>
	);
}

export function Weather () {
	const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
	useEffect(() => {
		if (!LOCATION) return;
		let active = true;
		const refresh = () => {
			if (document.hidden) return;
			fetchWeather(LOCATION).then((next) => { if (active) setWeather(next); })
				.catch(() => { if (active) setWeather(null); });
		};
		refresh();
		const timer = window.setInterval(refresh, REFRESH_MS);
		const onVisible = () => { if (!document.hidden) refresh(); };
		document.addEventListener('visibilitychange', onVisible);
		return () => {
			active = false;
			window.clearInterval(timer);
			document.removeEventListener('visibilitychange', onVisible);
		};
	}, []);
	if (!LOCATION || !weather) return null;
	return (
		<div class="weather" aria-label={`Clima em ${LOCATION.name}: ${weather.temperature} graus, ${weatherLabel(weather.code)}`}>
			<WeatherArtwork scene={weatherScene(weather.code, weather.isDay)} />
			<div class="weather__copy">
				<div class="weather__place">{LOCATION.name}</div>
				<div class="weather__temperature">{weather.temperature}<span>°</span></div>
				<div class="weather__condition">{weatherLabel(weather.code)}</div>
				<div class="weather__credit">Dados: Open-Meteo.com</div>
			</div>
		</div>
	);
}
