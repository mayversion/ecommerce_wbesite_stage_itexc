# Usage (Windows PowerShell):
#   python -m pip install --upgrade pip
#   pip install kagglehub pandas
#   python backend/scripts/fetch_kaggle_amazon.py --limit 2000 --out backend/data/amazon.sampled.json
# Then import into DB (keep original URLs first to test):
#   node backend/scripts/importProducts.js backend/data/amazon.sampled.json --keep-urls
# If all looks good and you want Cloudinary upload:
#   node backend/scripts/importProducts.js backend/data/amazon.sampled.json

import argparse
import json
import os
import re
from pathlib import Path

import kagglehub
import pandas as pd

ALLOWED = {
    'electronics': 'Electronics',
    'electronic': 'Electronics',
    'phone': 'Electronics',
    'mobile': 'Electronics',
    'laptop': 'Electronics',
    'computer': 'Electronics',
    'clothes': 'Clothing',
    'clothing': 'Clothing',
    'fashion': 'Clothing',
    'apparel': 'Clothing',
    'home & garden': 'Home & Garden',
    'home and garden': 'Home & Garden',
    'home': 'Home & Garden',
    'garden': 'Home & Garden',
    'sports': 'Sports',
    'sport': 'Sports',
}


def normalize_category(text: str) -> str:
    if not text:
        return 'Electronics'
    t = str(text).lower()
    for key, val in ALLOWED.items():
        if key in t:
            return val
    return 'Electronics'


def coerce_price(x):
    if pd.isna(x):
        return None
    try:
        # strip currency symbols and commas
        s = str(x)
        s = re.sub(r'[^0-9.,-]', '', s)
        s = s.replace(',', '')
        return float(s) if s else None
    except Exception:
        return None


def first_non_empty(*vals):
    for v in vals:
        if isinstance(v, str) and v.strip():
            return v.strip()
    return None


def collect_images(row) -> list:
    # common fields across amazon datasets
    cands = []
    # images might be an array as JSON string
    for key in [
        'images', 'imageURLs', 'imageURLHighRes', 'image_url', 'main_image_url', 'imUrl', 'image', 'picture',
    ]:
        if key in row and pd.notna(row[key]):
            cands.append(row[key])
    images = []
    for c in cands:
        if isinstance(c, list):
            images.extend(c)
        elif isinstance(c, str):
            # try json array
            s = c.strip()
            if s.startswith('[') and s.endswith(']'):
                try:
                    arr = json.loads(s)
                    if isinstance(arr, list):
                        images.extend(arr)
                        continue
                except Exception:
                    pass
            # otherwise, treat as single URL or split by whitespace
            if s.startswith('http'):  # likely a URL
                images.append(s)
            else:
                parts = re.split(r'[\s,]|\|', s)
                images.extend([p for p in parts if p.startswith('http')])
    # dedupe and keep only http(s)
    out = []
    seen = set()
    for u in images:
        if isinstance(u, str) and u.startswith('http'):
            if u not in seen:
                seen.add(u)
                out.append(u)
    return out[:5]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=1000, help='Number of products to sample')
    ap.add_argument('--out', type=str, default='backend/data/amazon.sampled.json')
    ap.add_argument('--dataset', type=str, default='asaniczka/amazon-products-dataset-2023-1-4m-products')
    ap.add_argument('--local', type=str, default=None, help='Use a local extracted dataset folder (skips Kaggle download)')
    args = ap.parse_args()

    if args.local:
      print('Using local dataset folder:', args.local)
      base = Path(args.local)
      if not base.exists():
        raise RuntimeError('Local dataset folder not found: ' + str(base))
    else:
      print('Downloading dataset via kagglehub...')
      path = kagglehub.dataset_download(args.dataset)
      print('Dataset path:', path)
      base = Path(path)
    # try to find a reasonable CSV/JSON file
    csvs = list(base.rglob('*.csv'))
    jsons = list(base.rglob('*.json'))
    target = csvs[0] if csvs else (jsons[0] if jsons else None)
    if not target:
        raise RuntimeError('No CSV/JSON file found in dataset path: ' + str(base))
    print('Reading file:', target)

    if target.suffix.lower() == '.csv':
        df = pd.read_csv(target, low_memory=False)
    else:
        # expect JSON lines or array
        try:
            df = pd.read_json(target, lines=True)
        except Exception:
            df = pd.read_json(target)

    # Sample to manageable size
    if args.limit and len(df) > args.limit:
        df = df.sample(n=args.limit, random_state=42).reset_index(drop=True)

    # Possible field candidates from various amazon datasets
    name_cols = ['title', 'name', 'product_name']
    desc_cols = ['description', 'feature', 'features', 'about', 'summary']
    price_cols = ['price', 'current_price', 'list_price', 'price_num']
    cat_cols = ['category', 'categories', 'main_category', 'type']
    stock_cols = ['stock', 'availability', 'available', 'inventory']
    rating_cols = ['rating', 'ratings', 'stars']
    reviews_cols = ['reviews', 'num_reviews', 'review_count']

    out_rows = []
    for _, row in df.iterrows():
        row_dict = row.to_dict()
        name = first_non_empty(*[row_dict.get(c) for c in name_cols])
        if not name:
            continue
        price_raw = first_non_empty(*[row_dict.get(c) for c in price_cols])
        price = coerce_price(price_raw)
        if price is None:
            continue
        desc = first_non_empty(*[row_dict.get(c) for c in desc_cols]) or ''
        cat_raw = first_non_empty(*[row_dict.get(c) for c in cat_cols]) or ''
        category = normalize_category(cat_raw)
        stock_raw = row_dict.get('stock') if 'stock' in row_dict else None
        try:
            stock = int(stock_raw) if stock_raw is not None and str(stock_raw).strip() != '' else 50
        except Exception:
            stock = 50
        imgs = collect_images(row_dict)
        # skip if no images
        if not imgs:
            continue
        ratings = row_dict.get('rating') or row_dict.get('ratings') or None
        try:
            ratings = float(ratings) if ratings is not None else 0
        except Exception:
            ratings = 0
        num_reviews = row_dict.get('review_count') or row_dict.get('num_reviews') or row_dict.get('reviews') or 0
        try:
            num_reviews = int(num_reviews) if num_reviews is not None else 0
        except Exception:
            num_reviews = 0

        out_rows.append({
            'name': str(name)[:120],
            'price': float(price),
            'description': str(desc)[:1000],
            'category': category,
            'stock': stock,
            'images': imgs,
            'ratings': ratings,
            'numOfReviews': num_reviews,
        })

    os.makedirs(Path(args.out).parent, exist_ok=True)
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(out_rows, f, ensure_ascii=False, indent=2)
    print(f'Wrote {len(out_rows)} products to {args.out}')


if __name__ == '__main__':
    main()
