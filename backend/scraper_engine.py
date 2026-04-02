import asyncio
import pandas as pd
import random
import os
from playwright.async_api import async_playwright
import logging
from datetime import datetime
from pymongo import MongoClient, UpdateOne
import json 

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
        self.mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/faculty_dashboard")
        self.db_name = "faculty_dashboard"

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
        metrics = {"citations": 0, "hIndex": 0, "i10Index": 0}
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
        
        # Extract Metrics (Citations, H-index, i10-index) from Sidebar
        try:
            metric_rows = await page.query_selector_all("#gsc_rsb_st tr")
            for row in metric_rows:
                cells = await row.query_selector_all(".gsc_rsb_std")
                if len(cells) >= 1:
                    label = await row.query_selector("a, .gsc_rsb_f")
                    label_text = await label.inner_text() if label else ""
                    val = await cells[0].inner_text()
                    val = int(val) if val.isdigit() else 0

                    if "Citations" in label_text: metrics["citations"] = val
                    elif "h-index" in label_text: metrics["hIndex"] = val
                    elif "i10-index" in label_text: metrics["i10Index"] = val
        except Exception as e:
            self.log(f"Error parsing Google Scholar metrics: {e}")

        return papers, metrics

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
        return papers, {} # Generic scraper doesn't get metrics yet

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
                            faculty_papers, metrics = await self.scrape_google_scholar(page, faculty, link)
                            # Update global results and faculty-specific metrics
                            for paper in faculty_papers:
                                paper["Metrics"] = metrics # Attach metrics to first paper for easy saving
                        else:
                            faculty_papers, _ = await self.scrape_generic(page, faculty, profile_type, link)

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
            # Sync to MongoDB after each run
            if self.results:
                self.save_to_mongodb()

    def initialize_faculty_from_csv(self):
        """Initializes the Faculty collection in MongoDB from the provided CSV file."""
        try:
            df = pd.read_csv(self.csv_path)
            client = MongoClient(self.mongo_uri)
            db = client[self.db_name]
            faculty_collection = db["faculties"] 

            ops = []
            for _, row in df.iterrows():
                name = row["Faculty Name"]
                profile_links = {
                    "googleScholar": row.get("Google Scholar", ""),
                    "scopus": row.get("Scopus Profile", ""),
                    "wos": row.get("WoS / ORCID / Publons", "")
                }
                
                # Use "upsert" to avoid duplicate faculty entries
                ops.append(UpdateOne(
                    {"name": name},
                    {"$setOnInsert": {
                        "name": name,
                        "area": "Computer Science & IT", # Default, can be refined 
                        "profileLinks": profile_links,
                        "papers": 0,
                        "hIndex": 0,
                        "citations": 0
                    }},
                    upsert=True
                ))

            if ops:
                faculty_collection.bulk_write(ops)
                self.log(f"Synced {len(ops)} faculty profiles to MongoDB.")
            client.close()
        except Exception as e:
            self.log(f"Error initializing faculty: {e}")

    def save_to_mongodb(self):
        """Saves scraped publications to MongoDB and updates faculty stats."""
        if not self.results:
            return

        try:
            client = MongoClient(self.mongo_uri)
            db = client[self.db_name]
            pub_collection = db["publications"]
            fac_collection = db["faculties"]

            pub_ops = []
            faculty_stats = {} # track counts for bulk update

            for paper in self.results:
                faculty_name = paper["Faculty Name"]
                title = paper["Title"]
                
                # Prepare publication upsert
                pub_ops.append(UpdateOne(
                    {"title": title, "faculty": faculty_name},
                    {"$set": {
                        "title": title,
                        "faculty": faculty_name,
                        "authors": paper.get("Authors", ""),
                        "journal": paper.get("Journal", "General Publication"),
                        "year": int(paper["Year"]) if str(paper["Year"]).isdigit() else 2024,
                        "link": paper.get("Paper Link", "#"),
                        "source": paper.get("Source", "Sourced"),
                    }},
                    upsert=True
                ))

                # Aggregate paper counts per faculty
                faculty_stats[faculty_name] = faculty_stats.get(faculty_name, 0) + 1

            # Update Publications
            if pub_ops:
                pub_collection.bulk_write(pub_ops)
                self.log(f"Successfully upserted {len(pub_ops)} papers to MongoDB.")

            # Update Faculty document stats (paper counts, citations, hIndex, i10Index)
            fac_ops = []
            for name, count in faculty_stats.items():
                # Find metrics from first paper of this faculty
                faculty_metrics = {"citations": 0, "hIndex": 0, "i10Index": 0}
                for p in self.results:
                    if p["Faculty Name"] == name and "Metrics" in p:
                        faculty_metrics = p["Metrics"]
                        break

                fac_ops.append(UpdateOne(
                    {"name": name},
                    {"$set": {
                        "papers": count,
                        "citations": faculty_metrics["citations"],
                        "hIndex": faculty_metrics["hIndex"],
                        "i10Index": faculty_metrics["i10Index"]
                    }},
                    upsert=True
                ))
            
            if fac_ops:
                fac_collection.bulk_write(fac_ops)
                self.log(f"Updated metadata for {len(fac_ops)} faculty members.")

            client.close()
        except Exception as e:
            self.log(f"FAILED to save to MongoDB: {e}")

    def stop(self):
        self.is_running = False
        self.progress["status"] = "Stopped"
        self.log("Scraping manually stopped.")
