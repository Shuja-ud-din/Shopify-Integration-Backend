from mangum import Mangum  # AWS Lambda adapter
import requests
import logging
import random
import time
import json
from bs4 import BeautifulSoup
import re

def fetch_url_with_retry(url, retries=5):
    """Fetch URL with retries and optional proxy."""
    for attempt in range(retries):
        try:
            headers = {
                'accept-language': 'en-US;q=0.5,en;q=0.3',
                'content-type': 'text/html; charset=utf-8',
                'accept-encoding': 'gzip, deflate, br',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0',
            }
            response = requests.get(url, headers=headers, timeout=15)
            return response.content
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching page {url}: {e}")
            time.sleep(random.randint(5, 30))
    return None

def parse_ebay_data(html):
    """Parse HTML content and extract required data."""
    soup = BeautifulSoup(html, "html.parser")
    extracted_data = {}

    # Extract title
    title_element = soup.select_one('.x-item-title__mainTitle')
    extracted_data['title'] = title_element.text.strip() if title_element else None

    # Extract stock quantity
    stock_qty_element = soup.find(id='qtyAvailability')
    if stock_qty_element:
        stock_text_element = stock_qty_element.find('span', class_='ux-textspans ux-textspans--SECONDARY')
        stock_text = stock_text_element.text if stock_text_element else ""
        match = re.search(r'(\d+)', stock_text)
        extracted_data['stockQty'] = int(match.group()) if match else 1
    else:
        extracted_data['stockQty'] = 0

    # Extract price
    price_element = soup.select_one('.x-price-primary')
    price_text = price_element.text.strip() if price_element else None
    price_match = re.search(r'\d+\.\d+', price_text) if price_text else None
    extracted_data['price'] = float(price_match.group()) if price_match else None

    # Check availability
    buy_now_btn = soup.select_one('#binBtn_btn_1')
    extracted_data['available'] = bool(buy_now_btn)

    # Extract image
    images = soup.find_all("div", {"class": "ux-image-carousel-item"})
    first_image_element = images[0].find("img") if images else None
    extracted_data['imageUrl'] = first_image_element['src'] if first_image_element and 'src' in first_image_element.attrs else None

    return extracted_data

def lambda_handler(event, context):
    try:
        # Ensure it's a POST request
        http_method = event.get("requestContext", {}).get("http", {}).get("method", "")
        if http_method != "POST":
            return {
                "statusCode": 405,
                "body": json.dumps({"error": "Method Not Allowed. Use POST."})
            }

        # Parse the body as JSON
        body = json.loads(event.get("body", "{}"))
        products = body.get("products", [])


        results = []
        for product in products:
            url = product["url"]
            html = fetch_url_with_retry(url)
            if not html:
                return {"statusCode": 500, "body": json.dumps({"error": f"Failed to retrieve data from eBay for product URL: {url}"})}
            
            data = parse_ebay_data(html)
            data['id'] = product["id"]
            data['url'] = url
            
            results.append(data)
        
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(results)
        }
    except Exception as e:
        logging.error(f"Error in lambda_handler: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

# AWS Lambda handler
handler = Mangum(lambda_handler)
