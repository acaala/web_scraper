const axios = require("axios");
const { JSDOM } = require("jsdom");

const getProductUrl = (product_id) =>
  `https://www.amazon.co.uk/gp/aod/ajax/?asin=${product_id}&m=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=1-1-c84eb971-91f2-4a4d-acce-811265c24254&pc=dp`;

const getPrices = async (product_id) => {
  const productUrl = getProductUrl(product_id);
  const { data: html } = await axios.get(productUrl, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      Host: "www.amazon.co.uk",
      "cache-control": "no-cache",
      cookie:
        "session-id=257-7714819-2585303; i18n-prefs=GBP; lc-acbuk=en_GB; ubid-acbuk=257-3053537-6648635; session-token=xnZbryka7Hjftj/516Sy8e9BIrMt5pN0UK4ZCx1rPew1L2QWLLCSOrjVyfBJ0Q6XStVNsaqnhwm6D9wtKK1824sJjIYx6u8+sZDgt8ZS1fcMXiMGzsMHU5jA8A2Aa41V3008qlmQcjQwk9E4zJdjBlVD4nbc0LOIaCI27YhHaZelS5fnRa74J9EzECBW9xAD; session-id-time=2082787201l; csm-hit=tb:P25XG14K0GQAP189NCZ8+sa-AEBCNJF1XEH0D1G3AKFJ-VDNFCG6JJ60J8HE58H5G|1637486287734&t:1637486287734&adb:adblk_no",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
      pragma: "no-cache",
      "upgrade-insecure-requests": 1,
    },
  });

  const dom = new JSDOM(html);
  const getElement = (selector) => dom.window.document.querySelector(selector);
  const title = getElement("#aod-asin-title-text").textContent.trim();
  const pinnedElement = getElement("#pinned-de-id");

  const getOffer = (element) => {
    const price = element.querySelector(".a-price .a-offscreen").textContent;
    const shipsFrom = element
      .querySelector("#aod-offer-shipsFrom .a-col-right .a-size-small")
      .textContent.trim();
    const soldBy = element
      .querySelector("#aod-offer-soldBy .a-col-right .a-size-small")
      .textContent.trim();
    const deliveryMessage = element
      .querySelector("#mir-layout-DELIVERY_BLOCK-slot-DELIVERY_MESSAGE")
      .textContent.trim();
    //const pinnedOfferId = pinnedElement.querySelector('input[name="offeringID.1"]').getAttribute('value');
    return {
      price,
      shipsFrom,
      soldBy,
      deliveryMessage: deliveryMessage
        .replace(/\s+/g, " ")
        .replace("Details", "")
        .trim(),
    };
  };

  const offerListElement = getElement("#aod-offer-list");
  const offerElements = offerListElement.querySelectorAll(
    ".aod-information-block"
  );
  const offers = [];

  offerElements.forEach((offerElement) => {
    offers.push(getOffer(offerElement));
  });

  const result = {
    productId: product_id,
    title,
    pinned: getOffer(pinnedElement),
    offers,
  };

  console.log(result);
};
getPrices("B07GYRVP61");
