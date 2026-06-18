
export interface SitesResource {
  id: null;
  name: string;
  address: string;
  contactName: string;
  phone: string;
  created: string;
  updated: string;
}

export interface SitesResponse {
  sites: SitesResource[];
}
