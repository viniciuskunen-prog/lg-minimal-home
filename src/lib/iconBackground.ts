/**
 * Match a wide app card to the nearly solid edge of an icon supplied by the TV.
 * Only pixels from the running TV are inspected; no logo or sampled colour is
 * bundled with the app. A transparent or busy edge has no reliable colour.
 */
export function edgeBackground (data: Uint8ClampedArray, width: number, height: number): string | undefined {
	if (width < 8 || height < 8 || data.length < width * height * 4) return undefined;
	const colors: [number, number, number][] = [];
	const xs = [0.12, 0.3, 0.5, 0.7, 0.88];
	const ys = [0.12, 0.3, 0.5, 0.7, 0.88];
	for (const x of xs) {
		for (const y of ys) {
			if (x !== xs[0] && x !== xs[xs.length - 1] && y !== ys[0] && y !== ys[ys.length - 1]) continue;
			const i = (Math.floor(y * height) * width + Math.floor(x * width)) * 4;
			if (data[i + 3] >= 240) colors.push([data[i], data[i + 1], data[i + 2]]);
		}
	}
	if (colors.length < 10) return undefined;
	let best: [number, number, number][] = [];
	for (const candidate of colors) {
		const group = colors.filter((sample) => Math.max(
			Math.abs(sample[0] - candidate[0]),
			Math.abs(sample[1] - candidate[1]),
			Math.abs(sample[2] - candidate[2])
		) <= 18);
		if (group.length > best.length) best = group;
	}
	if (best.length < Math.ceil(colors.length * 0.7)) return undefined;
	const average = (channel: number) => Math.round(best.reduce((sum, rgb) => sum + rgb[channel], 0) / best.length);
	return `rgb(${average(0)}, ${average(1)}, ${average(2)})`;
}

export function imageBackground (image: HTMLImageElement): string | undefined {
	try {
		const canvas = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 40;
		const context = canvas.getContext('2d');
		if (!context) return undefined;
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		return edgeBackground(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
	} catch {
		// A cross-origin image or unsupported canvas must not break navigation.
		return undefined;
	}
}
