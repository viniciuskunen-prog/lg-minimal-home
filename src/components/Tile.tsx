import {useState} from 'preact/hooks';
import {imageBackground} from '../lib/iconBackground';
import {CheckMark, Glyph, type GlyphName} from './Glyph';

/** Everything a tile needs to draw itself; rows and grids build these from app/input data. */
export interface TileModel {
	key: string;
	label: string;
	/** Runtime artwork read from the owner's TV, never bundled with the app. */
	imageUrl?: string;
	/** built-in, authored vector icon */
	glyph?: GlyphName;
	/** monogram background when there is no artwork */
	color?: string;
	/** Deliberate background for this app card, with or without artwork. */
	cardBackground?: string;
	cardForeground?: string;
}

interface Props {
	model: TileModel;
	focused: boolean;
	/** picked up in re-order mode */
	lifted?: boolean;
	/** shown with a tick badge (settings picker) */
	checked?: boolean;
	/** greyed out (settings picker: not on the home screen) */
	dimmed?: boolean;
	onHover?: () => void;
	onActivate?: () => void;
}

export function Tile ({model, focused, lifted, checked, dimmed, onHover, onActivate}: Props) {
	const [artwork, setArtwork] = useState<{url: string; background?: string; failed?: boolean}>({url: ''});
	const hasImage = Boolean(model.imageUrl && !(artwork.url === model.imageUrl && artwork.failed));
	const background = model.cardBackground
		|| (hasImage && artwork.url === model.imageUrl ? artwork.background : undefined)
		|| model.color;
	const classes = ['tile', focused && 'tile--focused', lifted && 'tile--lifted', dimmed && 'tile--dimmed'].filter(Boolean).join(' ');
	return (
		<div class={classes} onMouseEnter={onHover} onClick={onActivate}>
			<div class="tile__box" style={background ? {background} : undefined}>
				{hasImage
					? <img class="tile__image" src={model.imageUrl} alt="" onLoad={(event) => {
						const image = event.currentTarget;
						if (model.imageUrl) setArtwork({url: model.imageUrl, background: imageBackground(image)});
					}} onError={() => {
						if (model.imageUrl) setArtwork({url: model.imageUrl, failed: true});
					}} />
					: model.glyph
							? <Glyph name={model.glyph} />
							: <div class="tile__monogram" style={model.cardForeground ? {color: model.cardForeground} : undefined}>{model.label.charAt(0).toUpperCase()}</div>}
				{checked && <div class="tile__badge"><CheckMark /></div>}
			</div>
			<div class="tile__label">{model.label}</div>
		</div>
	);
}
