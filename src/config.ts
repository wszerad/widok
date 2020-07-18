let configurable = true;
const config = {
	dev: true
}

export function configureWidok(options: Partial<typeof config>) {
	if (!configurable) {
		throw new Error('configureWidok hook have to be used before defineWidok hook')
	}

	Object.assign(config, options)
}

export function getConfigWidok() {
	configurable = false;
	return config;
}
