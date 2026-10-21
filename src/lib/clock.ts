// Time-of-day text. Pure functions so they are trivially testable.

export type TimeFormat = '12h' | '24h';

const DAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export function greeting (date: Date): string {
	const h = date.getHours();
	if (h < 12) return 'Bom dia';
	if (h < 18) return 'Boa tarde';
	return 'Boa noite';
}

export function dayName (date: Date): string {
	return DAYS[date.getDay()];
}

/** "23 de setembro" */
export function dateText (date: Date): string {
	return `${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

export interface TimeParts {
	/** "15:42" or "3:42" */
	time: string;
	/** "AM" / "PM" in 12-hour format, otherwise empty */
	period: string;
}

export function timeParts (date: Date, format: TimeFormat): TimeParts {
	const h = date.getHours();
	const m = pad(date.getMinutes());
	if (format === '24h') return {time: `${pad(h)}:${m}`, period: ''};
	return {time: `${h % 12 || 12}:${m}`, period: h < 12 ? 'AM' : 'PM'};
}

function pad (n: number): string {
	return n < 10 ? `0${n}` : String(n);
}
