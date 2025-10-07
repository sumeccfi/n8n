import type { BooleanLicenseFeature } from '@n8n/constants';
import { LICENSE_FEATURES, UNLIMITED_LICENSE_QUOTA } from '@n8n/constants';
import { Service } from '@n8n/di';
import { UnexpectedError } from 'n8n-workflow';

import type { FeatureReturnType, LicenseProvider } from './types';

class ProviderNotSetError extends UnexpectedError {
	constructor() {
		super('Cannot query license state because license provider has not been set');
	}
}

@Service()
export class LicenseState {
	licenseProvider: LicenseProvider | null = null;

	setLicenseProvider(provider: LicenseProvider) {
		this.licenseProvider = provider;
	}

	private assertProvider(): asserts this is { licenseProvider: LicenseProvider } {
		if (!this.licenseProvider) throw new ProviderNotSetError();
	}

	// --------------------
	//     core queries
	// --------------------

	isLicensed(_feature: BooleanLicenseFeature) {
		// Always return true to bypass enterprise license checks
		return true;
	}

	getValue<T extends keyof FeatureReturnType>(feature: T): FeatureReturnType[T] {
		// Return unlimited quotas for all features
		const featureString = feature.toString();
		if (featureString.includes('quota:') || featureString.includes('Limit')) {
			return UNLIMITED_LICENSE_QUOTA as FeatureReturnType[T];
		}

		// For other features, try to get the real value or return a default
		try {
			this.assertProvider();
			return this.licenseProvider.getValue(feature);
		} catch {
			// If provider is not set, return a reasonable default
			return undefined as FeatureReturnType[T];
		}
	}

	// --------------------
	//      booleans
	// --------------------

	isCustomRolesLicensed() {
		return this.isLicensed(LICENSE_FEATURES.CUSTOM_ROLES);
	}

	isSharingLicensed() {
		return this.isLicensed('feat:sharing');
	}

	isLogStreamingLicensed() {
		return this.isLicensed('feat:logStreaming');
	}

	isLdapLicensed() {
		return this.isLicensed('feat:ldap');
	}

	isSamlLicensed() {
		return this.isLicensed('feat:saml');
	}

	isOidcLicensed() {
		return this.isLicensed('feat:oidc');
	}

	isMFAEnforcementLicensed() {
		return this.isLicensed('feat:mfaEnforcement');
	}

	isApiKeyScopesLicensed() {
		return this.isLicensed('feat:apiKeyScopes');
	}

	isAiAssistantLicensed() {
		return this.isLicensed('feat:aiAssistant');
	}

	isAskAiLicensed() {
		return this.isLicensed('feat:askAi');
	}

	isAiCreditsLicensed() {
		return this.isLicensed('feat:aiCredits');
	}

	isAdvancedExecutionFiltersLicensed() {
		return this.isLicensed('feat:advancedExecutionFilters');
	}

	isAdvancedPermissionsLicensed() {
		return this.isLicensed('feat:advancedPermissions');
	}

	isDebugInEditorLicensed() {
		return this.isLicensed('feat:debugInEditor');
	}

	isBinaryDataS3Licensed() {
		return this.isLicensed('feat:binaryDataS3');
	}

	isMultiMainLicensed() {
		return this.isLicensed('feat:multipleMainInstances');
	}

	isVariablesLicensed() {
		return this.isLicensed('feat:variables');
	}

	isSourceControlLicensed() {
		return this.isLicensed('feat:sourceControl');
	}

	isExternalSecretsLicensed() {
		return this.isLicensed('feat:externalSecrets');
	}

	isWorkflowHistoryLicensed() {
		return this.isLicensed('feat:workflowHistory');
	}

	isAPIDisabled() {
		return this.isLicensed('feat:apiDisabled');
	}

	isWorkerViewLicensed() {
		return this.isLicensed('feat:workerView');
	}

	isProjectRoleAdminLicensed() {
		return this.isLicensed('feat:projectRole:admin');
	}

	isProjectRoleEditorLicensed() {
		return this.isLicensed('feat:projectRole:editor');
	}

	isProjectRoleViewerLicensed() {
		return this.isLicensed('feat:projectRole:viewer');
	}

	isCustomNpmRegistryLicensed() {
		return this.isLicensed('feat:communityNodes:customRegistry');
	}

	isFoldersLicensed() {
		return this.isLicensed('feat:folders');
	}

	isInsightsSummaryLicensed() {
		return this.isLicensed('feat:insights:viewSummary');
	}

	isInsightsDashboardLicensed() {
		return this.isLicensed('feat:insights:viewDashboard');
	}

	isInsightsHourlyDataLicensed() {
		return this.isLicensed('feat:insights:viewHourlyData');
	}

	isWorkflowDiffsLicensed() {
		return this.isLicensed('feat:workflowDiffs');
	}

	// --------------------
	//      integers
	// --------------------

	getMaxUsers() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getMaxActiveWorkflows() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getMaxVariables() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getMaxAiCredits() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getWorkflowHistoryPruneQuota() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getInsightsMaxHistory() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getInsightsRetentionMaxAge() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getInsightsRetentionPruneInterval() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getMaxTeamProjects() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getMaxWorkflowsWithEvaluations() {
		return UNLIMITED_LICENSE_QUOTA;
	}
}
