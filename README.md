# Faculty Research Intelligence Dashboard

A modern, high-performance administrative portal designed to visualize institutional research metrics, manage faculty profiles, and control scholarly data scraping engines.

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20FastAPI%20%7C%20Python-blue)

## 🚀 Overview

The **Faculty Research Intelligence Dashboard** provides a unified platform for tracking and managing research output across departments. It integrates real-time scraping capabilities with a sleek, glassmorphism-inspired UI to provide deep insights into publication trends and faculty performance.

## 🏗️ Architecture

The project is structured into three primary components:

### 1. Frontend (`/frontend`)
- **Framework**: React.js with Vite for high-speed development.
- **Styling**: Modern CSS with a Glassmorphism aesthetic.
- **Key Features**: Interactive dashboards, real-time scraper logging, and faculty profile management.

### 2. Backend (`/backend`)
- **Server**: Python-based API (using FastAPI or similar patterns).
- **Core Logic**: Manages data persistence and serves scholarly data to the frontend.
- **Endpoints**: Faculty profiles, publication analytics, and scraper controls.

### 3. Scraper Engine (`backend/scraper_engine.py`)
- **Functionality**: Automates the collection of research data from scholarly sources.
- **Integration**: Communicates with the backend to provide real-time updates on scraping progress.

## 🛠️ Getting Started

### Prerequisites
- Node.js (for the frontend)
- Python 3.10+ (for the backend)
- NPM or Yarn

### Quick Start
To launch the entire application (Frontend + Backend) simultaneously, use the provided startup script:

```bash
chmod +x start.sh
./start.sh
```

The script will:
1. Check for necessary dependencies.
2. Start the Backend API.
3. Launch the Frontend development server.

## 🔧 Features
- **Real-time Scraper Logs**: Monitor ongoing data collection via WebSocket-driven logs.
- **Comprehensive Analytics**: Visualize publication counts, h-indices, and departmental impact.
- **Faculty Profiles**: Manage individual profiles and their associated research output.
- **Responsive Design**: Fully optimized for both desktop and mobile viewing.

## 📜 License
This project is for academic and institutional research management purposes.
