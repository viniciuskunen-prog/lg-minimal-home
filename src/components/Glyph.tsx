// Inline SVG line icons used by the Misc row and the settings badge.

export type GlyphName = 'house' | 'gear' | 'television' | 'hdmi' | 'usb' | 'antenna' | 'device';

export function Glyph ({name}: {name: GlyphName}) {
	return (
		<svg class="tile__glyph" viewBox="0 0 24 24" aria-hidden="true">
			{name === 'house'
				? <path d="M3 11.5 12 4l9 7.5M5.5 9.8V20h13V9.8M10 20v-6h4v6" />
				: name === 'television'
					? <><rect x="3.5" y="5.5" width="17" height="11.5" rx="1.5" /><path d="M9 20h6M12 17v3" /></>
					: name === 'hdmi'
						? <><path d="M7 4h10v5l2 2v5H5v-5l2-2V4Z" /><path d="M9 4v5M15 4v5M8 13h8" /></>
						: name === 'usb'
							? <><path d="M12 20V5M12 5 9 8M12 5l3 3M12 10h4v4M12 14H8v3" /><circle cx="16" cy="15.5" r="1.5" /><path d="M8 17h0" /></>
							: name === 'antenna'
								? <><path d="m8 19 4-8 4 8M5 19h14M12 5v2M7.8 7.5l1.4 1.4M16.2 7.5l-1.4 1.4" /><path d="M9.5 14h5" /></>
								: name === 'device'
									? <><rect x="5" y="6" width="14" height="12" rx="2" /><path d="M8 10h8M8 14h4" /></>
									: <>
					<circle cx="12" cy="12" r="3.2" />
					<path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
				</>}
		</svg>
	);
}

export function CheckMark () {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M5 12.5l4.5 4.5L19 7.5" />
		</svg>
	);
}
