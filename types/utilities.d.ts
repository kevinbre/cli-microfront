export interface Utility {
  dependencie: string;
  version: string;
  dev?: boolean;
}

export interface UtilityGroup {
  title: string;
  utilities: Utility[];
}

export interface Utilities {
  [key: string]: UtilityGroup[];
}

export interface ContainerConfig {
  title: string;
  scope: string;
  url: string;
  endpoint: string;
}
