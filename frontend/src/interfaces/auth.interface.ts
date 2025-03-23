export interface loginForm {
	email: string;
	password: string;
}

export interface registerForm {
	username: string;
	email: string;
	password: string;
	confirm_password: string;
}

export interface authResponse {
	token: string;
	type: string;
	id: number;
}

export interface tokenPayload {
	userId: number;
	sub: string;
	iat: number;
	exp: number;
}
