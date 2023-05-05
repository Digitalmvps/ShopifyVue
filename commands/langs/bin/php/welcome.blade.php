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
    <script src="{{ asset('js/main.js?v=0.01') }}"></script>
</body>



</html>
@endsection

@section('scripts')
@parent
@endsection