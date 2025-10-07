import type { RequestHandler } from 'express';

export const sourceControlLicensedAndEnabledMiddleware: RequestHandler = (_req, _res, next) => {
	// Always allow access - bypass source control license checks
	next();
};

export const sourceControlLicensedMiddleware: RequestHandler = (_req, _res, next) => {
	// Always allow access - bypass source control license checks
	next();
};
