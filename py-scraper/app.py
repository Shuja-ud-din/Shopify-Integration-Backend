from mangum import Mangum  # AWS Lambda adapter
import requests
import logging
import random
import time
import json
from bs4 import BeautifulSoup

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

    extracted_data['title'] = soup.select_one('.x-item-title__mainTitle')
    extracted_data['title'] = extracted_data['title'].text.strip() if extracted_data['title'] else 'N/A'

    stock_qty_element = soup.select_one('#qtyTextBox')
    extracted_data['stockQty'] = stock_qty_element.get('value', '').strip() if stock_qty_element else 'N/A'

    extracted_data['price'] = soup.select_one('.x-price-primary')
    extracted_data['price'] = extracted_data['price'].text.strip() if extracted_data['price'] else 'N/A'

    extracted_data['availability'] = soup.select_one('.d-quantity__availability')
    extracted_data['availability'] = extracted_data['availability'].text.strip() if extracted_data['availability'] else 'N/A'

    images = soup.find_all("div", {"class": "ux-image-carousel-item"})
    first_image = images[0].find("img") if images else None
    extracted_data['imageUrl'] = first_image['src'] if first_image else "N/A"

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
        urls = body.get("urls", [])

        # Validate input
        if not urls or not isinstance(urls, list):
            return {"statusCode": 400, "body": json.dumps({"error": "Missing or invalid 'urls' parameter. Must be a list."})}
        
        results = []
        for url in urls:
            html = fetch_url_with_retry(url)
            if not html:
                return {"statusCode": 500, "body": json.dumps({"error": f"Failed to retrieve data from eBay for URL: {url}"})}
            
            data = parse_ebay_data(html)
            results.append(data)
        
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(results)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

# AWS Lambda handler
handler = Mangum(lambda_handler)
