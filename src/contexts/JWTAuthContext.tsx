import { createContext, FC, ReactNode, useEffect, useReducer } from 'react';
import { OwnUser, UserResponseDTO } from 'src/models/user';
import api, { authHeader } from 'src/utils/api';
import { JWT_SECRET, verify } from 'src/utils/jwt';
import PropTypes from 'prop-types';
import {
  getCompanySettings,
  getUserInfos,
  getUserSettings
} from '../utils/userApi';
import UserSettings from 'src/models/owns/userSettings';
import CompanySettings from 'src/models/owns/companySettings';
import { GeneralPreferences } from '../models/owns/generalPreferences';
import internationalization from '../i18n/i18n';
import {
  FieldConfiguration,
  FieldType
} from '../models/owns/fieldConfiguration';
import { Company } from '../models/owns/company';
import { PermissionEntity } from 'src/models/owns/role';
import { Audit } from 'src/models/owns/audit';
import OwnSubscription from '../models/owns/ownSubscription';
import { PlanFeature } from '../models/owns/subscriptionPlan';
import { IField } from '../content/own/type';

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserResponseDTO | null;
  company: Company | null;
  userSettings: UserSettings | null;
  companySettings: CompanySettings | null;
}
export type FieldConfigurationsType = 'workOrder' | 'request';

interface AuthContextValue extends AuthState {
  method: 'JWT';
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    password: string,
    role: number | undefined
  ) => Promise<boolean>;
  getInfos: () => void;
  patchUserSettings: (values: Partial<UserSettings>) => Promise<void>;
  patchUser: (values: Partial<OwnUser>) => Promise<void>;
  patchSubscription: (values: Partial<OwnSubscription>) => Promise<void>;
  patchCompany: (values: Partial<Company>) => Promise<void>;
  updatePassword: (values: {
    oldPassword: string;
    newPassword: string;
  }) => Promise<boolean>;
  fetchUserSettings: () => Promise<void>;
  fetchCompanySettings: () => Promise<void>;
  fetchCompany: () => Promise<void>;
  patchGeneralPreferences: (
    values: Partial<GeneralPreferences>
  ) => Promise<void>;
  patchFieldConfiguration: (
    fieldName: string,
    fieldType: FieldType,
    fieldConfigurationsType: FieldConfigurationsType
  ) => Promise<void>;
  hasViewPermission: (permission: PermissionEntity) => boolean;
  hasFeature: (feature: PlanFeature) => boolean;
  hasCreatePermission: (permission: PermissionEntity) => boolean;
  hasEditPermission: <Entity extends Audit>(
    permission: PermissionEntity,
    entity: Entity
  ) => boolean;
  hasDeletePermission: <Entity extends Audit>(
    permission: PermissionEntity,
    entity: Entity
  ) => boolean;
  getFilteredFields: (fields: Array<IField>) => Array<IField>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: UserResponseDTO | null;
    companySettings: CompanySettings | null;
    company: Company | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: UserResponseDTO;
    companySettings: CompanySettings;
    company: Company;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
  payload: {
    user: UserResponseDTO;
    companySettings: CompanySettings;
    company: Company;
  };
};
type PatchUserSettingsAction = {
  type: 'PATCH_USER_SETTINGS';
  payload: {
    userSettings: UserSettings;
  };
};
type PatchUserAction = {
  type: 'PATCH_USER';
  payload: {
    user: UserResponseDTO;
  };
};
type PatchSubscriptionAction = {
  type: 'PATCH_SUBSCRIPTION';
  payload: {
    subscription: OwnSubscription;
  };
};
type PatchCompanyAction = {
  type: 'PATCH_COMPANY';
  payload: {
    company: Company;
  };
};
type FetchUserSettingsAction = {
  type: 'GET_USER_SETTINGS';
  payload: {
    userSettings: UserSettings;
  };
};
type FetchCompanySettingsAction = {
  type: 'GET_COMPANY_SETTINGS';
  payload: {
    companySettings: CompanySettings;
  };
};
type FetchCompanyAction = {
  type: 'GET_COMPANY';
  payload: {
    company: Company;
  };
};
type PatchGeneralPreferencesAction = {
  type: 'PATCH_GENERAL_PREFERENCES';
  payload: {
    generalPreferences: GeneralPreferences;
  };
};
type PatchFieldConfigurationAction = {
  type: 'PATCH_FIELD_CONFIGURATION';
  payload: {
    type: FieldConfigurationsType;
    fieldConfiguration: FieldConfiguration;
  };
};
type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | PatchUserSettingsAction
  | PatchUserAction
  | FetchUserSettingsAction
  | FetchCompanySettingsAction
  | PatchGeneralPreferencesAction
  | PatchFieldConfigurationAction
  | FetchCompanyAction
  | PatchCompanyAction
  | PatchSubscriptionAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  company: null,
  userSettings: null,
  companySettings: null
};

const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('companyId');
  }
};

const setCompanyId = (companyId: number) => {
  localStorage.setItem('companyId', companyId.toString());
};

const handlers: Record<
  string,
  (state: AuthState, action: Action) => AuthState
> = {
  INITIALIZE: (state: AuthState, action: InitializeAction): AuthState => {
    const { isAuthenticated, user, companySettings, company } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      companySettings,
      company
    };
  },
  LOGIN: (state: AuthState, action: LoginAction): AuthState => {
    const { user, companySettings, company } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      companySettings,
      company
    };
  },
  LOGOUT: (state: AuthState): AuthState => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state: AuthState, action: RegisterAction): AuthState => {
    const { user, companySettings, company } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      companySettings,
      company
    };
  },
  PATCH_USER_SETTINGS: (
    state: AuthState,
    action: PatchUserSettingsAction
  ): AuthState => {
    const { userSettings } = action.payload;
    return {
      ...state,
      userSettings
    };
  },
  PATCH_USER: (state: AuthState, action: PatchUserAction): AuthState => {
    const { user } = action.payload;
    return {
      ...state,
      user
    };
  },
  PATCH_SUBSCRIPTION: (
    state: AuthState,
    action: PatchSubscriptionAction
  ): AuthState => {
    const { subscription } = action.payload;
    return {
      ...state,
      company: { ...state.company, subscription }
    };
  },
  PATCH_COMPANY: (state: AuthState, action: PatchCompanyAction): AuthState => {
    const { company } = action.payload;
    return {
      ...state,
      company
    };
  },
  GET_USER_SETTINGS: (
    state: AuthState,
    action: FetchUserSettingsAction
  ): AuthState => {
    const { userSettings } = action.payload;
    return {
      ...state,
      userSettings
    };
  },
  GET_COMPANY_SETTINGS: (
    state: AuthState,
    action: FetchCompanySettingsAction
  ): AuthState => {
    const { companySettings } = action.payload;
    return {
      ...state,
      companySettings
    };
  },
  GET_COMPANY: (state: AuthState, action: FetchCompanyAction): AuthState => {
    const { company } = action.payload;
    return {
      ...state,
      company
    };
  },
  PATCH_GENERAL_PREFERENCES: (
    state: AuthState,
    action: PatchGeneralPreferencesAction
  ): AuthState => {
    const { generalPreferences } = action.payload;
    return {
      ...state,
      companySettings: {
        ...state.companySettings,
        generalPreferences
      }
    };
  },
  PATCH_FIELD_CONFIGURATION: (
    state: AuthState,
    action: PatchFieldConfigurationAction
  ): AuthState => {
    const { type, fieldConfiguration } = action.payload;
    const stateClone = { ...state };
    if (type === 'workOrder') {
      stateClone.companySettings.workOrderConfiguration.workOrderFieldConfigurations =
        stateClone.companySettings.workOrderConfiguration.workOrderFieldConfigurations.map(
          (fC) => {
            if (fieldConfiguration.id === fC.id) {
              return fieldConfiguration;
            }
            return fC;
          }
        );
    } else {
      stateClone.companySettings.workOrderRequestConfiguration.fieldConfigurations =
        stateClone.companySettings.workOrderRequestConfiguration.fieldConfigurations.map(
          (fC) => {
            if (fieldConfiguration.id === fC.id) {
              return fieldConfiguration;
            }
            return fC;
          }
        );
    }
    return stateClone;
  }
};

const reducer = (state: AuthState, action: Action): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(false),
  getInfos: () => Promise.resolve(),
  patchUserSettings: () => Promise.resolve(),
  patchCompany: () => Promise.resolve(),
  patchUser: () => Promise.resolve(),
  patchSubscription: () => Promise.resolve(),
  fetchUserSettings: () => Promise.resolve(),
  fetchCompany: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(false),
  fetchCompanySettings: () => Promise.resolve(),
  patchGeneralPreferences: () => Promise.resolve(),
  patchFieldConfiguration: () => Promise.resolve(),
  hasViewPermission: () => false,
  getFilteredFields: () => [],
  hasFeature: () => false,
  hasCreatePermission: () => false,
  hasEditPermission: () => false,
  hasDeletePermission: () => false
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const switchLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);
  };
  const updateUserInfos = async () => {
    const user = await getUserInfos();
    setCompanyId(user.companyId);
    return user;
  };
  const setupUser = async (companySettings: CompanySettings) => {
    switchLanguage({
      lng: companySettings.generalPreferences.language.toLowerCase()
    });
  };
  const getInfos = async (): Promise<void> => {
    try {
      const accessToken = window.localStorage.getItem('accessToken');

      if (accessToken && verify(accessToken, JWT_SECRET)) {
        setSession(accessToken);
        const user = await updateUserInfos();
        const company = await api.get<Company>(`companies/${user.companyId}`);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user,
            companySettings: company.companySettings,
            company
          }
        });
      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
            companySettings: null,
            company: null
          }
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null,
          companySettings: null,
          company: null
        }
      });
    }
  };
  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post<{ accessToken: string }>(
      'auth/signin',
      {
        email,
        type: 'client',
        password
      },
      { headers: authHeader(true) }
    );
    const { accessToken } = response;
    setSession(accessToken);
    const user = await updateUserInfos();
    const company = await api.get<Company>(`companies/${user.companyId}`);
    await setupUser(company.companySettings);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        companySettings: company.companySettings,
        company
      }
    });
  };

  const logout = async (): Promise<void> => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (values): Promise<boolean> => {
    const response = await api.post<{ message: string; success: boolean }>(
      'auth/signup',
      values,
      { headers: authHeader(true) }
    );
    const { message, success } = response;
    if (message.startsWith('Successful')) {
      return false;
    } else {
      setSession(message);
      const user = await updateUserInfos();
      const company = await api.get<Company>(`companies/${user.companyId}`);
      await setupUser(company.companySettings);
      dispatch({
        type: 'REGISTER',
        payload: {
          user,
          companySettings: company.companySettings,
          company
        }
      });
      return true;
    }
  };

  const patchUserSettings = async (
    values: Partial<UserSettings>
  ): Promise<void> => {
    const userSettings = await api.patch<UserSettings>(
      `user-settings/${state.userSettings.id}`,
      values
    );
    dispatch({
      type: 'PATCH_USER_SETTINGS',
      payload: {
        userSettings
      }
    });
  };
  const patchCompany = async (values: Partial<Company>): Promise<void> => {
    const company = await api.patch<Company>(
      `companies/${state.company.id}`,
      values
    );
    dispatch({
      type: 'PATCH_COMPANY',
      payload: {
        company
      }
    });
  };
  const patchUser = async (values: Partial<OwnUser>): Promise<void> => {
    const user = await api.patch<UserResponseDTO>(
      `users/${state.user.id}`,
      values
    );
    dispatch({
      type: 'PATCH_USER',
      payload: {
        user
      }
    });
  };
  const patchSubscription = async (
    values: Partial<OwnSubscription>
  ): Promise<void> => {
    const subscription = await api.patch<OwnSubscription>(
      `subscriptions/${state.company.subscription.id}`,
      values
    );
    dispatch({
      type: 'PATCH_SUBSCRIPTION',
      payload: {
        subscription
      }
    });
  };
  const updatePassword = async (values: {
    oldPassword: string;
    newPassword: string;
  }): Promise<boolean> => {
    const response = await api.post<{ success: boolean }>(
      `auth/updatepwd`,
      values
    );
    const { success } = response;
    return success;
  };
  const fetchUserSettings = async (): Promise<void> => {
    const userSettings = await getUserSettings(state.user.userSettingsId);
    dispatch({
      type: 'GET_USER_SETTINGS',
      payload: {
        userSettings
      }
    });
  };

  const fetchCompanySettings = async (): Promise<void> => {
    const companySettings = await getCompanySettings(
      state.user.companySettingsId
    );
    dispatch({
      type: 'GET_COMPANY_SETTINGS',
      payload: {
        companySettings
      }
    });
  };
  const fetchCompany = async (): Promise<void> => {
    const company = await api.get<Company>(state.user.companyId);
    dispatch({
      type: 'GET_COMPANY',
      payload: {
        company
      }
    });
  };
  const patchGeneralPreferences = async (
    values: Partial<GeneralPreferences>
  ): Promise<void> => {
    const generalPreferences = await api.patch<GeneralPreferences>(
      `general-preferences/${state.companySettings.generalPreferences.id}`,
      { ...state.companySettings.generalPreferences, ...values }
    );
    dispatch({
      type: 'PATCH_GENERAL_PREFERENCES',
      payload: {
        generalPreferences
      }
    });
  };

  const patchFieldConfiguration = async (
    fieldName: string,
    fieldType: FieldType,
    fieldConfigurationsType: FieldConfigurationsType
  ): Promise<void> => {
    let id;
    if (fieldConfigurationsType === 'workOrder') {
      id =
        state.companySettings.workOrderConfiguration.workOrderFieldConfigurations.find(
          (workOrderFieldConfiguration) =>
            workOrderFieldConfiguration.fieldName === fieldName
        ).id;
    } else {
      id =
        state.companySettings.workOrderRequestConfiguration.fieldConfigurations.find(
          (fieldConfiguration) => fieldConfiguration.fieldName === fieldName
        ).id;
    }
    const fieldConfiguration = await api.patch<FieldConfiguration>(
      `field-configurations/${id}`,
      { fieldType }
    );
    dispatch({
      type: 'PATCH_FIELD_CONFIGURATION',
      payload: {
        type: fieldConfigurationsType,
        fieldConfiguration
      }
    });
  };
  const hasViewPermission = (permissionEntity: PermissionEntity) => {
    return state.user.role.viewPermissions.includes(permissionEntity);
  };
  const hasCreatePermission = (permissionEntity: PermissionEntity) => {
    return state.user.role.viewPermissions.includes(permissionEntity);
  };
  const hasEditPermission = <Entity extends Audit>(
    permissionEntity: PermissionEntity,
    entity: Entity
  ) => {
    if (!entity) return false;
    return (
      state.user.id === entity.createdBy ||
      state.user.role.editOtherPermissions.includes(permissionEntity)
    );
  };
  const hasDeletePermission = <Entity extends Audit>(
    permissionEntity: PermissionEntity,
    entity: Entity
  ) => {
    if (!entity) return false;
    return (
      state.user.id === entity.createdBy ||
      state.user.role.deleteOtherPermissions.includes(permissionEntity)
    );
  };
  const hasFeature = (feature: PlanFeature) => {
    return state.company.subscription.subscriptionPlan.features.includes(
      feature
    );
  };
  const getFilteredFields = (defaultFields: Array<IField>): IField[] => {
    let fields = [...defaultFields];
    if (!hasFeature(PlanFeature.FILE)) {
      fields = fields.filter((field) => field.type !== 'file');
    }
    return fields;
  };
  useEffect(() => {
    getInfos();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register,
        getInfos,
        patchUser,
        patchSubscription,
        patchCompany,
        updatePassword,
        patchUserSettings,
        fetchUserSettings,
        fetchCompanySettings,
        fetchCompany,
        patchGeneralPreferences,
        patchFieldConfiguration,
        hasViewPermission,
        hasFeature,
        getFilteredFields,
        hasEditPermission,
        hasDeletePermission,
        hasCreatePermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
