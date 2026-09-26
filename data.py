import csv
import time
import requests
from bs4 import BeautifulSoup

# Define target output file
CSV_FILENAME = "ceylon_cinnamon_buyers.csv"

# Request Headers to mimic a real browser visit
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# Example target search URL structure (Replace URL with your target supplier/buyer directory)
TARGET_URL = "https://example-directory.com/trade/buyers/ceylon-cinnamon"

def fetch_buyer_leads(url):
    """
    Fetches raw HTML page content.
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"[!] Network error fetching page: {e}")
        return None

def parse_buyer_data(html_content):
    """
    Parses HTML content to extract buyer lead details.
    Update the CSS selectors based on your specific target website's HTML structure.
    """
    soup = BeautifulSoup(html_content, "html.parser")
    buyer_list = []

    # Replace '.buyer-card' with the container class of your target directory
    cards = soup.select(".buyer-card") 

    for card in cards:
        # Extract fields using standard HTML class selectors
        company_name = card.select_one(".company-name")
        country = card.select_one(".country-flag")
        contact_person = card.select_one(".contact-person")
        email = card.select_one(".email-link")
        phone = card.select_one(".phone-number")
        requirement = card.select_one(".buyer-requirement")

        buyer_data = {
            "Company Name": company_name.get_text(strip=True) if company_name else "N/A",
            "Country": country.get_text(strip=True) if country else "N/A",
            "Contact Person": contact_person.get_text(strip=True) if contact_person else "N/A",
            "Email": email.get_text(strip=True) if email else "N/A",
            "Phone": phone.get_text(strip=True) if phone else "N/A",
            "Requirement": requirement.get_text(strip=True) if requirement else "Ceylon Cinnamon",
        }
        buyer_list.append(buyer_data)

    return buyer_list

def save_to_csv(data, filename):
    """
    Saves a list of dictionaries into a clean CSV file.
    """
    if not data:
        print("[!] No data extracted to save.")
        return

    fields = ["Company Name", "Country", "Contact Person", "Email", "Phone", "Requirement"]

    with open(filename, mode="w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fields)
        writer.writeheader()
        writer.writerows(data)

    print(f"[✓] Successfully exported {len(data)} buyer records to '{filename}'.")

if __name__ == "__main__":
    print("Starting Ceylon Cinnamon Buyer Scraper...")
    
    html = fetch_buyer_leads(TARGET_URL)
    if html:
        leads = parse_buyer_data(html)
        save_to_csv(leads, CSV_FILENAME)
        
    # Polite crawling delay
    time.sleep(1)