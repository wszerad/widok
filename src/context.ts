interface Context {
	name: string;
	state: any;
	mutation: boolean;
	getter: boolean;
}

let context: Context = null;

export function setContext(name: string) {
	context = {
		name,
		state: null,
		mutation: false,
		getter: false
	};
}

export function getContext() {
	return context;
}