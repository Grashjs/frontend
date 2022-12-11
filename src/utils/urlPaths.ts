export const getAssetUrl = (id) => {
  return `/app/assets/${id}/work-orders`;
};

export const getLocationUrl = (id) => {
  return `/app/locations/${id}`;
};

export const getUserUrl = (id) => {
  return `/app/people-teams/people/${id}`;
};
export const getTeamUrl = (id) => {
  return `/app/people-teams/teams${id}`;
};

export const getRequestUrl = (id) => {
  return `/app/requests/${id}`;
};

export const getWorkOrderUrl = (id) => {
  return `/app/work-orders/${id}`;
};

export const getPartUrl = (id) => {
  return `/app/inventory/parts/${id}`;
};

export const getMeterUrl = (id) => {
  return `/app/meters/${id}`;
};
export const getCustomerUrl = (id) => {
  return `/app/vendors-customers/customers/${id}`;
};
