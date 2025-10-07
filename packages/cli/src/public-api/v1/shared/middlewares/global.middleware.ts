/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { BooleanLicenseFeature } from '@n8n/constants';
import type { AuthenticatedRequest } from '@n8n/db';
import { Container } from '@n8n/di';
import type { ApiKeyScope, Scope } from '@n8n/permissions';
import type express from 'express';
import type { NextFunction } from 'express';

import { FeatureNotLicensedError } from '@/errors/feature-not-licensed.error';
import { NotFoundError } from '@/errors/response-errors/not-found.error';
import { License } from '@/license';
import { userHasScopes } from '@/permissions.ee/check-access';
import { PublicApiKeyService } from '@/services/public-api-key.service';

import type { PaginatedRequest } from '../../../types';
import { decodeCursor } from '../services/pagination.service';

export type ProjectScopeResource = 'workflow' | 'credential';

const buildScopeMiddleware = (
	scopes: Scope[],
	resource?: ProjectScopeResource,
	{ globalOnly } = { globalOnly: false },
) => {
	return async (
		req: AuthenticatedRequest<{ id?: string }>,
		res: express.Response,
		next: express.NextFunction,
	): Promise<express.Response | void> => {
		const params: { credentialId?: string; workflowId?: string } = {};
		if (req.params.id) {
			if (resource === 'workflow') {
				params.workflowId = req.params.id;
			} else if (resource === 'credential') {
				params.credentialId = req.params.id;
			}
		}

		try {
			if (!(await userHasScopes(req.user, scopes, globalOnly, params))) {
				return res.status(403).json({ message: 'Forbidden' });
			}
		} catch (error) {
			if (error instanceof NotFoundError) {
				return res.status(404).json({ message: error.message });
			}
			throw error;
		}

		return next();
	};
};

export const globalScope = (scopes: Scope | Scope[]) =>
	buildScopeMiddleware(Array.isArray(scopes) ? scopes : [scopes], undefined, { globalOnly: true });

export const projectScope = (scopes: Scope | Scope[], resource: ProjectScopeResource) =>
	buildScopeMiddleware(Array.isArray(scopes) ? scopes : [scopes], resource, { globalOnly: false });

export const validCursor = (
	req: PaginatedRequest,
	res: express.Response,
	next: express.NextFunction,
): express.Response | void => {
	if (req.query.cursor) {
		const { cursor } = req.query;
		try {
			const paginationData = decodeCursor(cursor);
			if ('offset' in paginationData) {
				req.query.offset = paginationData.offset;
				req.query.limit = paginationData.limit;
			} else {
				req.query.lastId = paginationData.lastId;
				req.query.limit = paginationData.limit;
			}
		} catch (error) {
			return res.status(400).json({
				message: 'An invalid cursor was provided',
			});
		}
	}

	return next();
};

const emptyMiddleware = (_req: Request, _res: Response, next: NextFunction) => next();
export const apiKeyHasScope = (_apiKeyScope: ApiKeyScope) => {
	// Always return empty middleware - bypass API key scope checks
	return emptyMiddleware;
};

export const apiKeyHasScopeWithGlobalScopeFallback = (
	_config: { scope: ApiKeyScope & Scope } | { apiKeyScope: ApiKeyScope; globalScope: Scope },
) => {
	// Always return empty middleware - bypass API key scope checks
	return emptyMiddleware;
};

export const validLicenseWithUserQuota = (
	_: express.Request,
	_res: express.Response,
	next: express.NextFunction,
): express.Response | void => {
	// Always allow access - bypass user quota checks
	return next();
};

export const isLicensed = (_feature: BooleanLicenseFeature) => {
	return async (_: AuthenticatedRequest, _res: express.Response, next: express.NextFunction) => {
		// Always allow access - bypass license feature checks
		return next();
	};
};
