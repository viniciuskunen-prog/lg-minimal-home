import {LAYOUT} from '../theme/tokens';
import {clamp} from '../hooks/useKeys';
import {Tile, type TileModel} from './Tile';

interface Props {
	rowId: string;
	label: string;
	items: TileModel[];
	focused: boolean;
	selected: number;
	emptyText?: string;
	onSelect: (index: number) => void;
	onActivate: (index: number) => void;
}

const APP_VIEWPORT_WIDTH = LAYOUT.screenWidth - 2 * LAYOUT.edgePadding - 58;
const APP_TILE_WIDTH = 190;
const COMPACT_TILE_WIDTH = 96;

function tileWidthFor (rowId: string): number {
	if (rowId === 'apps') return APP_TILE_WIDTH;
	if (rowId === 'sources' || rowId === 'misc') return COMPACT_TILE_WIDTH;
	return LAYOUT.tileSize;
}

function viewportWidthFor (rowId: string): number {
	if (rowId === 'apps') return APP_VIEWPORT_WIDTH;
	if (rowId === 'sources') return 654;
	if (rowId === 'misc') return 244;
	return APP_VIEWPORT_WIDTH;
}

/** Horizontal strip of tiles. Centred when it fits; otherwise a carousel that keeps
 *  the selected tile in the middle (clamped at the ends). */
export function Row ({rowId, label, items, focused, selected, emptyText, onSelect, onActivate}: Props) {
	const tileWidth = tileWidthFor(rowId);
	const viewportWidth = viewportWidthFor(rowId);
	const step = tileWidth + LAYOUT.tileGap;
	const total = items.length * step - LAYOUT.tileGap;
	const fits = total <= viewportWidth;
	const offset = fits ? 0 : clamp(selected * step + tileWidth / 2 - viewportWidth / 2, 0, total - viewportWidth);

	return (
		<section class={`row row--${rowId}${focused ? ' row--focused' : ''}`} aria-label={label}>
			{rowId !== 'apps' && <h2 class="row__label">{label}</h2>}
			<div class="row__viewport">
				{items.length === 0
					? <div class="row__empty">{emptyText || 'Nothing here yet'}</div>
					: <div class={`row__track${rowId === 'apps' && fits ? ' row__track--centered' : ''}`} style={{transform: `translateX(${-offset}px)`}}>
						{items.map((item, i) => (
							<Tile
								key={item.key}
								model={item}
								focused={focused && i === selected}
								onHover={() => onSelect(i)}
								onActivate={() => onActivate(i)}
							/>
						))}
					</div>}
			</div>
		</section>
	);
}
