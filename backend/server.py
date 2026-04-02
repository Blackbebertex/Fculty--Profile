from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import pandas as pd
import os
from scraper_engine import ScraperEngine

app = FastAPI(title="Faculty Research Scraper API")

# Setup CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use absolute paths for reliability
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_FILE = os.path.join(BASE_DIR, "..", "faculty_profile_links.csv")
OUTPUT_EXCEL = os.path.join(BASE_DIR, "..", "faculty_research_dashboard.xlsx")

# Initialize scraper engine
scraper = ScraperEngine(CSV_FILE, OUTPUT_EXCEL)

@app.on_event("startup")
async def startup_event():
    # Sync faculty data from CSV to MongoDB on start
    scraper.initialize_faculty_from_csv()

@app.post("/api/init")
async def init_faculty():
    scraper.initialize_faculty_from_csv()
    return {"status": "success", "message": "Faculty profiles initialized from CSV."}

@app.post("/api/start")
async def start_scraping(background_tasks: BackgroundTasks):
    if scraper.is_running:
        return {"status": "error", "message": "Scraper is already running."}
    
    background_tasks.add_task(scraper.run_scraper)
    return {"status": "success", "message": "Scraping task started in background."}

@app.post("/api/stop")
async def stop_scraping():
    scraper.stop()
    return {"status": "success", "message": "Scraping task stopped."}

@app.get("/api/status")
async def get_status():
    return scraper.progress

@app.get("/api/data")
async def get_data():
    if not scraper.results:
        return JSONResponse(content=[], status_code=200)
    
    return scraper.results

@app.get("/api/summary")
async def get_summary():
    if not scraper.results:
        return []
    
    df = pd.DataFrame(scraper.results)
    summary = df.groupby("Faculty Name").agg({"Title": "count"}).reset_index()
    summary.columns = ["Faculty Name", "Total Papers"]
    return summary.to_dict(orient="records")

@app.get("/api/export")
async def export_excel():
    if not os.path.exists(OUTPUT_EXCEL):
        raise HTTPException(status_code=404, detail="Excel file not found. Run scraper first.")
    
    return FileResponse(
        path=OUTPUT_EXCEL,
        filename="faculty_research_dashboard.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
