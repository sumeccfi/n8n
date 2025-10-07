import type { RequestHandler } from 'express';

export const samlLicensedAndEnabledMiddleware: RequestHandler = (_, _res, next) => {
	// Always allow access - bypass SAML license checks
	next();
};

export const samlLicensedMiddleware: RequestHandler = (_, _res, next) => {
	// Always allow access - bypass SAML license checks
	next();
};
