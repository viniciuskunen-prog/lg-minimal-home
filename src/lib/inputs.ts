// Sources: Live TV (the tuner, if the TV has one) followed by the external inputs
// (HDMI etc.) from the External Input Manager, which is callable from a web app. EIM
// returns the labels set in the TV's input settings. The app renders authored vector
// glyphs instead of copying LG's input artwork into the distributed package.

import {LUNA, SYSTEM_APP} from '../config/constants';
import {lunaCall, type LunaResponse} from './luna';
import {appExists} from './launch';
import type {GlyphName} from '../components/Glyph';

export interface InputSource {
	id: string;        // e.g. HDMI_1
	appId: string;     // e.g. com.webos.app.hdmi1 — launch this to switch
	label: string;     // user-visible name from the TV's input settings
	port: number;
	connected: boolean;
	glyph: InputGlyph;
}

export type InputGlyph = Extract<GlyphName, 'television' | 'hdmi' | 'usb' | 'antenna' | 'device'>;

interface EimDevice {
	id: string;
	appId: string;
	label: string;
	port: number;
	connected?: boolean;
	icon?: string; // runtime hint only; its file is never read or distributed
}

interface EimResponse extends LunaResponse {
	devices?: EimDevice[];
}

/** Live TV isn't an EIM device, but launching its app switches to the tuner, so it
 *  behaves like any other source. Port 0 sorts it ahead of HDMI 1. */
const LIVE_TV: InputSource = {
	id: 'LIVE_TV',
	appId: SYSTEM_APP.liveTv,
	label: 'Live TV',
	port: 0,
	connected: true,
	glyph: 'television'
};

/** Maps the EIM's string hint to an authored semantic glyph. No LG icon file is read. */
export function inputGlyphForHint (hint: string | undefined): InputGlyph {
	const normalized = (hint || '').toLowerCase();
	if (normalized.indexOf('usb') !== -1) return 'usb';
	if (normalized.indexOf('antenna') !== -1 || normalized.indexOf('satellite') !== -1) return 'antenna';
	if (normalized.indexOf('hdmi') !== -1) return 'hdmi';
	return 'device';
}

export function listInputs (): Promise<InputSource[]> {
	return Promise.all([listExternalInputs(), appExists(LIVE_TV.appId)])
		.then(([external, hasTuner]) => (hasTuner ? [LIVE_TV] : []).concat(external));
}

function listExternalInputs (): Promise<InputSource[]> {
	return lunaCall<EimResponse>(LUNA.inputStatus, {}).then((r) =>
		(r.devices || [])
			.filter((d) => d.appId && d.label)
			.sort((a, b) => a.port - b.port)
			.map((d) => ({
				id: d.id,
				appId: d.appId,
				label: d.label,
				port: d.port,
				connected: d.connected !== false,
				glyph: inputGlyphForHint([d.icon, d.id, d.appId].filter(Boolean).join(' '))
			}))
	);
}

/** Sample data so the layout can be developed in a desktop browser. */
export const MOCK_INPUTS: InputSource[] = [
	LIVE_TV,
	{id: 'HDMI_1', appId: 'com.webos.app.hdmi1', label: 'Streaming Box', port: 1, connected: true, glyph: 'hdmi'},
	{id: 'HDMI_2', appId: 'com.webos.app.hdmi2', label: 'Sound Bar', port: 2, connected: true, glyph: 'hdmi'},
	{id: 'HDMI_3', appId: 'com.webos.app.hdmi3', label: 'Games Console', port: 3, connected: true, glyph: 'hdmi'},
	{id: 'HDMI_4', appId: 'com.webos.app.hdmi4', label: 'HDMI 4', port: 4, connected: false, glyph: 'hdmi'}
];
