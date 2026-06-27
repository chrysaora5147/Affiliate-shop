# Soft Finds

Pinterest-style affiliate feed for Shopee links.

## What This Is

Soft Finds is a simple static website for sharing Shopee affiliate products in a soft, scrollable moodboard format. It is designed for readers who want to support a writer by shopping through affiliate links.

## Files

- `index.html` - main page
- `styles.css` - visual design
- `app.js` - feed behavior, search, sorting, and infinite scroll
- `products-data.js` - product data synced from the spreadsheet
- `assets/` - local placeholder images

## Run Locally

Open `index.html` directly in a browser, or run a tiny local server:

```bash
python3 -m http.server 4174
```

Then open:

```text
http://127.0.0.1:4174
```

## Updating Products

Edit `products-data.js`, or sync from the spreadsheet template used in this workspace.

Each product looks like this:

```js
{
  name: "Product name",
  category: "จากชีต",
  price: 99,
  note: "กดดูรายละเอียดจริงบน Shopee ได้เลย",
  image: "https://example.com/image.jpg",
  link: "https://s.shopee.co.th/..."
}
```

## Affiliate Disclosure

Some links are affiliate links. If someone buys through those links, the site owner may earn a small commission at no extra cost to the buyer.
