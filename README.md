# ShopifyVue
ShopifyVue helps you generate VueJs template to build shopify embed apps. It allows you to select your backennd language, and handles its setup for you. 

The VueJs template generated has a Vue3 + Vite + Typescript setup, with built-in NuxtJs like features such as automatic route discovery, page layout and so on.

## Features
- Multi-language backend support (NodeJs,PHP)
- Shopify AppBridge Authentication
- Vue3 + Vite + Typescript
- Automatic Route Discovery
- Automatic Layout System

## Usage
### Install
Install ShopifyVue as a global package
```
npm i -g shopifyvue
```

### Create a new project
Note: We recommend using Git bash terminal on Windows.

To create a new project, you can specify the backend language ShopifyVue should use by using `shopifyvue create "MyShopifyApp" --backend <language>`.

For NodeJs
```
shopifyvue create "MyShopifyApp" --backend nodejs
```

For PHP
```
shopifyvue create "MyShopifyApp" --backend php
```

Then Change directory to your new shopify app folder and run 
```
npm install
```

### Setup

#### NodeJs
The NodeJs template generated is an extension of [Shopify's NodeJs Template](https://github.com/Shopify/shopify-app-template-node)
- Add `.env` file to your project root folder
```
SHOPIFY_API_KEY={api key}           # Your API key
SHOPIFY_API_SECRET={api secret key} # Your API secret key
SCOPES={scopes}                     # Your app's required scopes, comma-separated
HOST={your app's host}              # Your app's host
```

Then, create a new app in your [Shopify Partner Dashboard](https://partners.shopify.com/) and copy the `api key` and `api secret key` to your `.env` file.

#### PHP
The PHP template generated is a [Laravel 8](https://laravel.com/docs/8.x) app with [Laravel-shopify Package](https://github.com/osiset/laravel-shopify) installed.
- Add the `SHOPIFY_API_KEY` , `SHOPIFY_API_SECRET`, and `SHOPIFY_APPBRIDGE_ENABLED` to your `.env`
```
SHOPIFY_API_KEY=<your api key>
SHOPIFY_API_SECRET=<your secret key>
SHOPIFY_APPBRIDGE_ENABLED=true

```

Then, create a new app in your [Shopify Partner Dashboard](https://partners.shopify.com/) and copy the `api key` and `api secret key` to your `.env` file.

### Start Server
#### For NodeJs
Start your development server
```
npm run serve:dev
```
Setup [Ngrok](https://ngrok.com/docs/getting-started) and expose your development server 
```
ngrok http http://localhost:8081/
```
Go to your app on [Shopify partner dashboard](https://partners.shopify.com/2041663/apps) and set the `App URL` as the Ngrok https url and add the following to `Allowed redirection URL(s)`
```
<Ngrok https url>/auth
<Ngrok https url>/auth/callback
<Ngrok https url>/auth/online
```

### For PHP
Start vite developement server
```
npm run dev
```
Start PHP development server on a new terminal tab
```
php artisan serve
```
Setup [Ngrok](https://ngrok.com/download) and expose your development server 
```
ngrok http http://localhost:8000/
```
Go to your app on [Shopify partner dashboard](https://partners.shopify.com/2041663/apps) and set the `App URL` as the Ngrok https url and add the following to `Allowed redirection URL(s)`
```
<Ngrok https url>/authenticate
```
> To make your app work, you must configure the database, jobs, and middlewares, as well as publish the configurations for the [Laravel Shopify](https://github.com/osiset/laravel-shopify) package. Follow the installation instructions on the wiki page [here](https://github.com/osiset/laravel-shopify/wiki/Installation).

### Testing your App
Before you continue, you can [test your app](https://shopify.dev/apps/store/review/testing) on developemt store to validate your setup.

### Shopify AppBridge Authentication
ShopifyVue VueJs template is an extention of [vue-typescript-template](https://github.com/Doctordrayfocus/vue-typescript-template). The `services/common/BaseService.ts` files in the template was modified to support Shopify AppBridge Authentication. This adds access token to every request made to the server side.

- `services/common/BaseService.ts`
```ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_URL } from '../../common/constants'
import { getSessionToken } from '@shopify/app-bridge-utils' // import shopify app-bridge

export class BaseApiService {
  private readonly baseUrl = API_URL
  public axiosInstance: AxiosInstance
  private config: AxiosRequestConfig
  resource

  constructor(resource: string) {
    if (!resource) throw new Error('Resource is not provided')
    this.resource = resource

    this.config = {
      baseURL: this.baseUrl,
    }

    this.axiosInstance = axios.create(this.config)

    // auth token
    this.axiosInstance.interceptors.request.use(function (config: any) {
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

  public getUrl(id = ''): string {
    return id ? `/${this.resource}/${id}` : `/${this.resource}`
  }

  public handleErrors(err: unknown): void {
    // Note: here you may want to add your errors handling
    console.log({ message: 'Errors is handled here', err })
  }
}


```

And the AppBridge intiation and setup has been implemented by ShopifyVue.

- In NodeJs - `index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
  </head>
  <body>
	<div id="app">
		<App/>
	</div>
	<script src="https://unpkg.com/@shopify/app-bridge@3"></script>
    <script src="https://unpkg.com/@shopify/app-bridge-utils@3"></script>
    <script>
    var AppBridge = window['app-bridge'];
    var AppBridgeUtils = window['app-bridge-utils'];
    var actions = window['app-bridge'].actions;
 
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	  });

   var createApp = AppBridge.default;
   window.shopifyApp = createApp({
    apiKey: 'env.apiKey', // this will be automatically replaced by the server
    host: params.host
   });
    </script>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```
- In PHP - `welcome.blade.php`
```php
@extends('shopify-app::layouts.default')

@section('content')
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="/css/line-awesome.min.css">
        <link href="{{ asset('css/app.css?v=0.22') }}" rel="stylesheet">
        <title>App Name</title>
    </head>

    <body>
        <div id="app">
            <App />
        </div>
        @if (\Osiset\ShopifyApp\Util::getShopifyConfig('appbridge_enabled'))
            <script
                src="https://unpkg.com/@shopify/app-bridge{{ \Osiset\ShopifyApp\Util::getShopifyConfig('appbridge_version') ? '@' . config('shopify-app.appbridge_version') : '' }}">
            </script>
            <script
                src="https://unpkg.com/@shopify/app-bridge-utils{{ \Osiset\ShopifyApp\Util::getShopifyConfig('appbridge_version') ? '@' . config('shopify-app.appbridge_version') : '' }}">
            </script>
            <script @if (\Osiset\ShopifyApp\Util::getShopifyConfig('turbo_enabled')) data-turbolinks-eval="false" @endif>
                var AppBridge = window['app-bridge'];
                var actions = AppBridge.actions;
                var createApp = AppBridge.default;
                window.shopifyApp = createApp({
                    apiKey: "{{ \Osiset\ShopifyApp\Util::getShopifyConfig('api_key', $shopDomain ?? Auth::user()->name) }}",
                    shopOrigin: "{{ $shopDomain ?? Auth::user()->name }}",
                    host: "{{ \Request::get('host') }}",
                    forceRedirect: true,
                });
            </script>

            @include('shopify-app::partials.token_handler')
            @include('shopify-app::partials.flash_messages')
        @endif
        <script src="{{ asset('js/app.js?v=0.22') }}"></script>
    </body>
    </html>
@endsection

@section('scripts')
    @parent
@endsection
```

## Additional Resources
- For more information on the NodeJs Server side, checkout [Shopify Node Template](https://github.com/Shopify/shopify-app-template-node)
- For more information on the PHP server side and setup guide, checkout [Shopify-laraval Wiki](https://github.com/osiset/laravel-shopify/wiki)
- For more information on how to use the Vue Template, checkout [Vue-typescript-template](https://github.com/Doctordrayfocus/vue-typescript-template)


