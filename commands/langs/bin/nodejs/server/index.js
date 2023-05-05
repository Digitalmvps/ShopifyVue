// // @ts-check
const { join } = require("path");
const express = require("express");
const { readFileSync } = require("fs");
const serveStatic = require("serve-static");
const fs = require("fs");

require("dotenv/config");

const shopify = require("./helpers/shopify.js");
const { productCreator } = require("./helpers/product-creator.js");
const GDPRWebhookHandlers = require("./helpers/gdpr.js");

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH = `${process.cwd()}/dist`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

// add api key to index.html
function readWriteSync(filePath) {
  var data = fs.readFileSync(`${process.cwd()}/${filePath}`, "utf-8");

  var newValue = data.replace("env.apiKey", `${process.env.SHOPIFY_API_KEY}`);

  fs.writeFileSync(`${process.cwd()}/${filePath}`, newValue, "utf-8");
}

readWriteSync("/dist/index.html");

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
