import asyncio
import pandas as pd
import random
import os
from playwright.async_api import async_playwright
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ScraperEngine:
    def __init__(self, csv_path, output_excel):
        self.csv_path = os.path.abspath(csv_path)
        self.output_excel = os.path.abspath(output_excel)
        self.is_running = False
        
        # Initialize total faculty count immediately
        try:
            df = pd.read_csv(self.csv_path)
            total = len(df)
        except:
            total = 0

        self.progress = {
            "total_faculty": total,
            "current_index": 0,
            "current_faculty": "",
            "papers_scraped": 0,
            "status": "Idle",
            "last_update": "",
            "logs": []
        }
        self.results = []

    def log(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.progress["logs"].append(f"[{timestamp}] {message}")
        if len(self.progress["logs"]) > 50:
            self.progress["logs"].pop(0)
        logger.info(message)

    async def retry_goto(self, page, url):
        for attempt in range(3):
            try:
                await page.goto(url, timeout=60000)
                await page.wait_for_load_state("networkidle")
                return True
            except Exception as e:
                self.log(f"Retry {attempt+1} failed for {url}")
                await asyncio.sleep(2)
        return False

    async def scrape_google_scholar(self, page, faculty_name, url):
        papers = []
        success = await self.retry_goto(page, url)
        if not success:
            return papers

        # On Google Scholar profiles, papers are in rows #gsc_a_b tr.gsc_a_tr
        items = await page.query_selector_all(".gsc_a_tr")
        for item in items:
            try:
                title_elem = await item.query_selector(".gsc_a_at")
                title = await title_elem.inner_text() if title_elem else ""
                
                link = await title_elem.get_attribute("href") if title_elem else ""
                if link and not link.startswith("http"):
                    link = "https://scholar.google.com" + link

                authors_elem = await item.query_selector(".gs_gray:nth-child(1)") # Usually authors
                authors = await authors_elem.inner_text() if authors_elem else ""

                journal_elem = await item.query_selector(".gs_gray:nth-child(2)") # Usually journal/year
                journal_full = await journal_elem.inner_text() if journal_elem else ""
                
                year_elem = await item.query_selector(".gsc_a_y")
                year = await year_elem.inner_text() if year_elem else ""

                papers.append({
                    "Faculty Name": faculty_name,
                    "Source": "Google Scholar",
                    "Title": title,
                    "Authors": authors,
                    "Journal": journal_full,
                    "Year": year,
                    "Paper Link": link,
                    "Scraped Date": pd.Timestamp.now()
                })
            except Exception as e:
                self.log(f"Error parsing Google Scholar item: {e}")
        return papers

    async def scrape_generic(self, page, faculty_name, profile_type, url):
        # Fallback for Scopus/WoS if specific selectors fail or are complex
        papers = []
        success = await self.retry_goto(page, url)
        if not success:
            return papers

        items = await page.query_selector_all("article, .result-item, .content-item, .list-group-item")
        for item in items:
            try:
                title = await item.query_selector("h2, h3, .title, .list-title")
                title = await title.inner_text() if title else ""

                authors = await item.query_selector(".authors, .author-list")
                authors = await authors.inner_text() if authors else ""

                journal = await item.query_selector(".journal, .publication-title, .source-title")
                journal = await journal.inner_text() if journal else ""

                year = await item.query_selector(".year, .pub-year")
                year = await year.inner_text() if year else ""

                link = await item.query_selector("a")
                link = await link.get_attribute("href") if link else ""

                papers.append({
                    "Faculty Name": faculty_name,
                    "Source": profile_type,
                    "Title": title,
                    "Authors": authors,
                    "Journal": journal,
                    "Year": year,
                    "Paper Link": link,
                    "Scraped Date": pd.Timestamp.now()
                })
            except Exception as e:
                pass
        return papers

    async def run_scraper(self):
        if self.is_running:
            return
        
        self.is_running = True
        self.results = []
        self.progress["status"] = "Running"
        self.progress["logs"] = []
        self.log("Starting Scraper Engine...")

        try:
            df = pd.read_csv(self.csv_path)
            self.progress["total_faculty"] = len(df)
            
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                page = await context.new_page()

                for index, row in df.iterrows():
                    if not self.is_running: break
                    
                    faculty = row["Faculty Name"]
                    self.progress["current_index"] = index + 1
                    self.progress["current_faculty"] = faculty
                    self.log(f"Scraping Faculty: {faculty}")

                    profiles = {
                        "Google Scholar": row.get("Google Scholar"),
                        "Scopus": row.get("Scopus Profile"),
                        "WoS": row.get("WoS / ORCID / Publons")
                    }

                    for profile_type, link in profiles.items():
                        if pd.isna(link) or str(link).lower() == 'n/a':
                            continue

                        self.log(f"Visiting {profile_type}...")
                        
                        if "scholar.google" in str(link):
                            faculty_papers = await self.scrape_google_scholar(page, faculty, link)
                        else:
                            faculty_papers = await self.scrape_generic(page, faculty, profile_type, link)

                        self.results.extend(faculty_papers)
                        self.progress["papers_scraped"] = len(self.results)
                        
                        # Anti-blocking sleep
                        await asyncio.sleep(random.uniform(2, 4))

                await browser.close()

            # Save to Excel
            if self.results:
                self.log("Saving results to Excel...")
                df_results = pd.DataFrame(self.results)
                summary = df_results.groupby("Faculty Name").agg({"Title": "count"}).reset_index()
                summary.columns = ["Faculty Name", "Total Papers"]

                with pd.ExcelWriter(self.output_excel) as writer:
                    df_results.to_excel(writer, sheet_name="All Research Papers", index=False)
                    summary.to_excel(writer, sheet_name="Dashboard Summary", index=False)
                
                self.log(f"Exported to {self.output_excel}")
            
            self.progress["status"] = "Completed"
            self.log("Scraping Task Finished Successfully.")

        except Exception as e:
            self.log(f"CRITICAL ERROR: {str(e)}")
            self.progress["status"] = "Error"
        finally:
            self.is_running = False

    def stop(self):
        self.is_running = False
        self.progress["status"] = "Stopped"
        self.log("Scraping manually stopped.")
