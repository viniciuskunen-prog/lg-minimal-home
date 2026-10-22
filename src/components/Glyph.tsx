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
					{/* One continuous toothed outline, rather than sun-like separate rays. */}
					<path d="M10 2h4l.5 2.1c.7.2 1.4.5 2 .9l2-.9 2.8 2.8-.9 2c.4.6.7 1.3.9 2l2.1.5v4l-2.1.5c-.2.7-.5 1.4-.9 2l.9 2-2.8 2.8-2-.9c-.6.4-1.3.7-2 .9L14 23h-4l-.5-2.1c-.7-.2-1.4-.5-2-.9l-2 .9-2.8-2.8.9-2c-.4-.6-.7-1.3-.9-2L.6 14v-4l2.1-.5c.2-.7.5-1.4.9-2l-.9-2 2.8-2.8 2 .9c.6-.4 1.3-.7 2-.9L10 2Z" />
					<circle cx="12" cy="12" r="3.2" />
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
