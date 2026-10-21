import {dateText, dayName, timeParts, type TimeFormat} from '../lib/clock';

export function Clock ({now, format}: {now: Date; format: TimeFormat}) {
	const {time, period} = timeParts(now, format);
	return (
		<div class="clock">
			<div class="clock__time">
				{time}
				{period && <span class="clock__period">{period}</span>}
			</div>
			<div class="clock__meta"><span>{dayName(now)}</span><span>{dateText(now)}</span></div>
		</div>
	);
}
