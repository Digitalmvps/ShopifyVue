// @ts-nocheck
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_URL } from "../../common/constants";
import { getSessionToken } from '@shopify/app-bridge-utils';

export class BaseApiService {
  private readonly baseUrl = API_URL;
  public axiosInstance: AxiosInstance;
  private config: AxiosRequestConfig;
  resource;

  constructor(resource: string) {
    if (!resource) throw new Error("Resource is not provided");
    this.resource = resource;

    this.config = {
      baseURL: this.baseUrl,
    };

	this.axiosInstance = axios.create(this.config)

	// auth token
	this.axiosInstance.interceptors.request.use(function (config : any) {
		   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
		  // @ts-ignore
	  return getSessionToken(window.shopifyApp) // requires a Shopify App Bridge instance
		  .then((token) => {
			  // Append your request headers with an authenticated token
			  config.headers.Authorization = `Bearer ${token}`
			  return config
		  })
	})
  }

  public getUrl(id = ""): string {
    return id ? `/${this.resource}/${id}` : `/${this.resource}`;
  }

  public handleErrors(err: unknown): void {
    // Note: here you may want to add your errors handling
    console.log({ message: "Errors is handled here", err });
  }
}
