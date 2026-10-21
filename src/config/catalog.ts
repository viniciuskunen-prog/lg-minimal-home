// Catalogue of apps the launcher knows how to show without any privileged access.
//
// A sideloaded web app on webOS 6 is not allowed to list installed apps, and it
// cannot read other apps' icon files. At runtime the catalogue is filtered with
// applicationManager/getAppLoadStatus, which *is* permitted, so only apps that
// actually exist on the TV are offered. Catalogue entries deliberately use a
// monogram instead of redistributing third-party app artwork.
//
// The list is deliberately broad and international: an entry for an app a TV
// doesn't have costs nothing. To add apps, change the defaults, or both, without
// editing this file, create src/config/catalog.local.ts (git-ignored); see
// catalog.local.example.ts.

export interface CatalogApp {
	id: string;
	title: string;
	/** monogram background */
	color?: string;
}

/** Shape of the optional src/config/catalog.local.ts. */
export interface LocalCatalog {
	/** extra apps, or replacements for entries with the same id */
	EXTRA_APPS?: CatalogApp[];
	/** replaces DEFAULT_APP_IDS */
	DEFAULT_APP_IDS?: string[];
}

const BASE_CATALOG: CatalogApp[] = [
	// Household shortcuts
	{id: 'com.iptvsmarters.app', title: 'IPTV Smarters', color: '#4f37e6'},
	{id: 'com.webos.app.lgchannels', title: 'LG Channels', color: '#b1060f'},
	// Global streaming
	{id: 'youtube.leanback.v4', title: 'YouTube', color: '#bb4f56'},
	{id: 'netflix', title: 'Netflix', color: '#b1060f'},
	{id: 'amazon', title: 'Prime Video', color: '#3f7897'},
	{id: 'com.disney.disneyplus-prod', title: 'Disney+', color: '#0f2b6b'},
	{id: 'com.apple.appletv', title: 'Apple TV', color: '#45566d'},
	{id: 'com.wbd.stream', title: 'Max', color: '#002be7'},
	{id: 'cdp-30', title: 'Plex', color: '#875d47'},
	{id: 'spotify-beehive', title: 'Spotify', color: '#1db954'},
	{id: 'tv.twitch.tv.starshot.lg', title: 'Twitch', color: '#6d5d98'},
	// North America
	{id: 'hulu', title: 'Hulu', color: '#1ce783'},
	{id: 'youtube.leanback.ytv.v1', title: 'YouTube TV', color: '#cc0000'},
	{id: 'com.plutotv.app', title: 'Pluto TV', color: '#2b2b2b'},
	{id: 'com.tubitv.ott.tubi', title: 'Tubi', color: '#7408ff'},
	{id: 'com.espn.espnplus-prod', title: 'ESPN', color: '#c8102e'},
	{id: 'vudu', title: 'Fandango at Home', color: '#3399ff'},
	// UK
	{id: 'bbc.iplayer.3.0', title: 'BBC iPlayer', color: '#705c9d'},
	{id: 'bbc.sounds.1.0', title: 'BBC Sounds', color: '#855d70'},
	{id: 'com.fvp.itv', title: 'ITVX', color: '#4a7d82'},
	{id: 'com.fvp.ch4', title: 'Channel 4', color: '#5d8451'},
	{id: 'demand5', title: 'Channel 5', color: '#956d5d'},
	{id: 'com.fvp.uktv', title: 'UKTV Play', color: '#6b698e'},
	{id: 'now.tv', title: 'NOW', color: '#5f6b80'},
	// LG built-ins
	{id: 'com.webos.app.browser', title: 'Navegador', color: '#3f7f8f'},
	{id: 'com.webos.app.mediadiscovery', title: 'Media Player', color: '#69708b'},
	{id: 'com.webos.app.igallery', title: 'Art Gallery', color: '#876b93'},
	{id: 'com.webos.app.homeconnect', title: 'Home Dashboard', color: '#537f76'},
	{id: 'amazon.alexa.view', title: 'Alexa', color: '#507b9a'},
	{id: 'com.palm.app.settings', title: 'LG Settings', color: '#2f3339'},
	// webOS Homebrew
	{id: 'org.webosbrew.hbchannel', title: 'Homebrew Channel', color: '#8b5a8c'},
	{id: 'org.webosbrew.inputhook', title: 'Input Hook', color: '#5d779a'},
	{id: 'org.webosbrew.safeupdate', title: 'HB Updater', color: '#527d68'},
	{id: 'com.lennylxx.iptv', title: 'IPTV Player', color: '#5e6f9c'},
	{id: 'org.jellyfin.webos', title: 'Jellyfin', color: '#00a4dc'}
];

/** Apps shown on a fresh install, in row order. Anything not installed is skipped. */
const BASE_DEFAULT_APP_IDS: string[] = [
	'com.iptvsmarters.app', 'com.webos.app.lgchannels', 'netflix',
	'youtube.leanback.v4', 'com.webos.app.browser', 'org.webosbrew.hbchannel'
];

// Vite resolves this at build time; it's an empty object when the file doesn't exist.
const localModules = import.meta.glob<LocalCatalog>('./catalog.local.ts', {eager: true});
const local: LocalCatalog = localModules['./catalog.local.ts'] || {};

function mergeCatalog (base: CatalogApp[], extra: CatalogApp[]): CatalogApp[] {
	const extraIds = extra.map((a) => a.id);
	return base.filter((a) => extraIds.indexOf(a.id) === -1).concat(extra);
}

export const APP_CATALOG: CatalogApp[] = mergeCatalog(BASE_CATALOG, local.EXTRA_APPS || []);
export const DEFAULT_APP_IDS: string[] = local.DEFAULT_APP_IDS || BASE_DEFAULT_APP_IDS;
