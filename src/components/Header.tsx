import {greeting} from '../lib/clock';

export function Header ({now}: {now: Date}) {
	return (
		<header class="header">
			<div class="header__brand"><span class="header__brand-mark">✦</span> MINIMAL HOME</div>
			<h1 class="header__greeting">{greeting(now)}</h1>
		</header>
	);
}
