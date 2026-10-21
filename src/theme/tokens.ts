// Design tokens: the single source of truth for colour, spacing, type and motion.
// `applyTokens()` exposes them as CSS custom properties so the stylesheet and the
// components read the same values.

export const COLOR = {
	bg: '#080b16',
	bgGradientInner: '#27315e',
	bgGradientMid: '#131b35',
	bgGradientOuter: '#080b16',
	textPrimary: '#f6f7ff',
	textSecondary: '#d0d7ed',
	textMuted: '#94a0c1',
	tileBg: 'rgba(255, 255, 255, 0.10)',
	tileBgFocus: 'rgba(255, 255, 255, 0.18)',
	tileBorder: 'rgba(255, 255, 255, 0.14)',
	tileBorderFocus: '#ffffff',
	badge: '#ffffff',
	badgeText: '#13182a',
	liftShadow: 'rgba(0, 0, 0, 0.42)',
	buttonBorder: 'rgba(255, 255, 255, 0.28)',
	buttonActiveBg: '#f3f5ff',
	buttonActiveText: '#151a2d',
	switchTrack: 'rgba(255, 255, 255, 0.18)',
	switchTrackOn: '#9ec0ff',
	switchKnob: '#aeb9d5',
	switchKnobOn: '#17213d',
	danger: '#e0564f'
} as const;

export const FONT = {
	family: '"Inter Variable", "LG Smart UI", "Helvetica Neue", Arial, sans-serif',
	greeting: 92,
	clock: 32,
	clockTime: 44,
	rowLabel: 18,
	tileLabel: 19,
	settingsTitle: 40,
	settingsTab: 26,
	settingsButton: 22,
	optionLabel: 26,
	optionDescription: 20,
	clockPeriod: 22,
	toast: 24
} as const;

export const LAYOUT = {
	screenWidth: 1920,
	screenHeight: 1080,
	edgePadding: 136,
	headerTop: 94,
	rowsTop: 396,
	tileSize: 138,
	tileGap: 24,
	tileRadius: 28,
	rowLabelGap: 14,        // gap between a row's subheader and its tiles
	rowGap: 18,
	gridColumns: 9          // settings picker grid
} as const;

export const MOTION = {
	focusMs: 180,
	scrollMs: 300,
	focusScale: 1.10,
	liftScale: 1.2,         // a tile picked up in re-order mode
	unfocusedRowOpacity: 0.55
} as const;

/** Writes every token onto :root as --color-*, --font-*, --layout-*, --motion-*. */
export function applyTokens (root: HTMLElement = document.documentElement): void {
	const groups: Record<string, Record<string, string | number>> = {color: COLOR, font: FONT, layout: LAYOUT, motion: MOTION};
	for (const group in groups) {
		const values = groups[group];
		for (const key in values) {
			const value = values[key];
			const unit = typeof value === 'number' && !/scale|opacity|columns/i.test(key) ? (key.endsWith('Ms') ? 'ms' : 'px') : '';
			root.style.setProperty(`--${group}-${kebab(key)}`, `${value}${unit}`);
		}
	}
}

function kebab (s: string): string {
	return s.replace(/([A-Z])/g, '-$1').toLowerCase();
}
