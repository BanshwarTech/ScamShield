# 🛡️ ScamShield India

> **AI-Powered Scam Detection & Digital Safety Assistant for India**  
> *Think before you click. Check before you pay. Verify before you trust.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/AI-Gemini%203.8%20Flash-orange.svg)](https://ai.google.dev/)

ScamShield India helps Indian citizens identify **online scams, phishing attempts, fake payment requests, malicious links, suspicious phone numbers, and social engineering attacks** before they lose money or sensitive credentials.

---

## 🚨 The Problem

Digital transactions in India (UPI, net banking, mobile wallets) are booming. With this growth, everyday citizens regularly face:
- **UPI PIN Fraud**: "Scan QR code or enter UPI PIN to receive money" (OLX / Facebook Marketplace).
- **"Digital Arrest" Extortion**: Scammers posing as Police/CBI/Customs officers on WhatsApp or Skype video calls demanding fund transfers for fake illegal parcels.
- **Bank KYC APK Phishing**: SMS claiming SBI/HDFC account suspension unless a malicious `.apk` is downloaded.
- **Electricity Disconnection Panic**: SMS threatening power cuts at 9:30 PM tonight with a personal mobile number to call.
- **Work From Home / Telegram Task Scams**: Fake job offers paying ₹150 for liking YouTube videos, then extracting lakhs in VIP prepaid tasks.
- **Remote Access Screen Share Traps**: Fake customer care agents instructing users to download AnyDesk or TeamViewer.
- **Fake Payment Screenshots**: Spoof apps generating fake green tick transaction receipts.

---

## ✨ Core Features

### 1. 📱 Multi-Modal Detection Modalities
- **SMS & Message Scanner**: Paste SMS, WhatsApp forwards, Telegram messages, or bank notices.
- **Screenshot Scanner (OCR + Multimodal Vision)**: Upload WhatsApp chats, payment receipts, or scam letters for AI vision analysis.
- **URL & Phishing Scanner**: Analyzes domain structure, typosquatting, brand impersonation, and APK download payloads.
- **QR Code & UPI Analyzer**: Evaluates UPI VPAs and reminds users that **QR codes and UPI PINs can NEVER be used to receive money**.
- **Phone Number Checker**: Cross-references Indian numbers (+91), WhatsApp accounts, and international cybercrime prefixes (+62, +92, +880, +234).

### 2. 📊 Standardized Risk Engine (0–100)
- **0 – 20: 🟢 LOW RISK** (Legitimate pattern)
- **21 – 50: 🟡 MODERATE RISK** (Unverified, exercise caution)
- **51 – 75: 🟠 HIGH RISK** (Strong deception signals)
- **76 – 100: 🔴 CRITICAL RISK** (Active fraud / extortion / UPI theft attempt)

### 3. 🔍 Explainable Intelligence (Anti-Jargon)
- **Why Suspicious?**: 3–5 concrete red flags detected with severity levels.
- **What You Must NOT Do**: Strict action checklist to prevent harm.
- **Recommended Action Plan**: Immediate safe steps to take.
- **How to Independently Verify**: Official steps to verify without contacting the scammer.

### 4. 🇮🇳 Multilingual Accessibility
- **English**
- **हिंदी (Hindi)**
- **Hinglish (Colloquial Hindi in Roman script)**

### 5. 📡 Live Threat Radar & Community Reporting
- Live feed of active scams reported across Indian cities (Delhi NCR, Bengaluru, Mumbai, Hyderabad, Pune, Jaipur).
- Community verification and direct submission modal.

### 6. 📚 Scam Pedia & Interactive Scam Radar Quiz
- Detailed breakdown of the top 8 Indian scam vectors.
- 5-scenario interactive simulation to test scam radar accuracy.

### 7. 🚨 National Cyber Helplines Directory
- **1930**: National Cyber Crime Helpline (MHA / I4C) for the 1-hour **Golden Hour** protocol to freeze stolen funds in transit.
- **Chakshu Portal (DoT Sanchar Saathi)**: Telecom fraud number reporting.
- **RBI Sachet**: Illegal loan apps & chit fund reporting.
- **SEBI SCORES**: Unauthorized stock market advisory & Telegram groups.

---

## 🛠️ Architecture & Tech Stack

```text
                    ┌─────────────────┐
                    │      USER       │
                    └────────┬────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
         Message         Screenshot          URL / UPI
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                    ┌─────────────────┐
                    │ Gemini 3.8 Flash│ (Multimodal Vision + OCR)
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
     NPCI UPI Rules    RBI KYC Norms    Indian Threat Intel
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                    ┌─────────────────┐
                    │ Risk Score Engine│ (0-100 Gauge)
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ Actionable Plan │ (Why Suspicious / DO NOT / Steps)
                    └─────────────────┘
```

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Express on Node.js (Full-Stack server.ts)
- **AI**: Google GenAI SDK (`@google/genai`) with `gemini-3.8-flash`
- **Security**: Local-only scan history (privacy-first), zero telemetry

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/BanshwarTech/ScamShield.git
cd ScamShield
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 4. Run the development server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## ⚠️ Important Disclaimer

ScamShield India is an informational risk-assessment and digital safety educational tool. Its results should not be taken as an absolute legal determination. Users must independently verify all requests with their bank or official customer service, and should **never share OTPs, UPI PINs, CVVs, passwords, or grant AnyDesk screen-sharing access** to anyone.

---

## 📄 License

MIT License. Designed with ❤️ for Digital India safety.
