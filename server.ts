import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON payload limit for base64 screenshot uploads (up to 20MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory community reported scams feed (pre-seeded with realistic Indian threat intelligence)
interface ScamReport {
  id: string;
  category: string;
  targetType: 'message' | 'phone' | 'url' | 'upi' | 'qr';
  targetValue: string;
  description: string;
  city: string;
  state: string;
  riskScore: number;
  reportedAt: string;
  upvotes: number;
}

const communityThreats: ScamReport[] = [
  {
    id: 'rep-1',
    category: 'Digital Arrest / Police Impersonation',
    targetType: 'phone',
    targetValue: '+91 98210 44291',
    description: 'Caller claimed to be DCP Cyber Crime Mumbai, stated parcel sent in my name contains illegal narcotics to Taiwan and demanded immediate Skype video call for digital arrest clearance.',
    city: 'Bengaluru',
    state: 'Karnataka',
    riskScore: 98,
    reportedAt: '12 minutes ago',
    upvotes: 42,
  },
  {
    id: 'rep-2',
    category: 'Bank KYC APK Phishing',
    targetType: 'url',
    targetValue: 'https://sbi-kyc-quickupdate.xyz/sbi.apk',
    description: 'SMS claiming SBI account deactivated due to pending PAN card. Asks to download an APK file named SBI_Reward_Update.apk which requests SMS and accessibility permissions.',
    city: 'Pune',
    state: 'Maharashtra',
    riskScore: 96,
    reportedAt: '34 minutes ago',
    upvotes: 89,
  },
  {
    id: 'rep-3',
    category: 'UPI Collect & QR Refund Fraud',
    targetType: 'upi',
    targetValue: 'refund-desk992@ibl',
    description: 'OLX buyer said they will send advance payment of ₹15,000 via QR code. Sent a PhonePe collect request claiming "enter UPI PIN to credit funds to your account".',
    city: 'Delhi NCR',
    state: 'Delhi',
    riskScore: 94,
    reportedAt: '1 hour ago',
    upvotes: 61,
  },
  {
    id: 'rep-4',
    category: 'Electricity Bill Disconnection SMS',
    targetType: 'message',
    targetValue: 'Dear consumer your electricity power will be disconnected at 9:30 PM tonight...',
    description: 'Fake electricity board SMS with random mobile number asking to call "Officer Verma" to avoid immediate power cutoff.',
    city: 'Jaipur',
    state: 'Rajasthan',
    riskScore: 91,
    reportedAt: '2 hours ago',
    upvotes: 115,
  },
  {
    id: 'rep-5',
    category: 'Part-Time Telegram Video Like Scam',
    targetType: 'message',
    targetValue: 'Earn ₹3000-₹8000 daily by liking YouTube videos and rating Google Maps hotels...',
    description: 'Paid ₹150 for first 3 likes, then added to "VIP Investment Task" Telegram group demanding ₹5,000 deposit to unlock withdrawal.',
    city: 'Hyderabad',
    state: 'Telangana',
    riskScore: 95,
    reportedAt: '3 hours ago',
    upvotes: 148,
  },
  {
    id: 'rep-6',
    category: 'Fake Customer Care Search Poisoning',
    targetType: 'phone',
    targetValue: '+91 82920 19382',
    description: 'Fake Swiggy / Zomato refund number on Google Maps. Caller insisted on installing AnyDesk to verify refund.',
    city: 'Kolkata',
    state: 'West Bengal',
    riskScore: 92,
    reportedAt: '4 hours ago',
    upvotes: 73,
  },
];

// System prompt grounding the model in Indian cyber fraud landscape
const SCAM_ANALYSIS_SYSTEM_PROMPT = `
You are the master security analyst for ScamShield India, the premier AI-powered digital safety assistant designed specifically for Indian citizens.
Your job is to analyze suspicious messages, screenshots, URLs, QR codes, UPI transactions, and phone numbers.

CRITICAL INDIAN FRAUD CONTEXT & REGULATIONS:
1. UPI (Unified Payments Interface) RULES (NPCI):
   - You NEVER need to enter your UPI PIN to RECEIVE money. UPI PIN is ONLY entered to deduct money.
   - Scanning a QR code can NEVER credit money to your bank account; QR codes are strictly payment instructions.
   - Any buyer or caller asking you to "scan QR to get refund" or "enter PIN to verify KYC reward" is 100% FRAUDULENT.
2. INDIAN BANKING & KYC NORMS (RBI):
   - No Indian bank (SBI, HDFC, ICICI, Axis, PNB, etc.) sends SMS asking to download .APK files or click third-party links to update PAN/Aadhaar/KYC.
   - Official bank SMS headers use registered 6-character sender IDs (e.g., AD-SBIBNK, VK-HDFCBK), never standard 10-digit mobile numbers (+91-9xxxx).
3. "DIGITAL ARREST" & LAW ENFORCEMENT:
   - There is NO such legal concept as "Digital Arrest" under Indian law (BNS / CrPC).
   - Indian Police, CBI, ED, NIA, or Customs NEVER conduct arrests or interrogate suspects via Skype, WhatsApp video, or Telegram.
   - Customs (FedEx/DHL/India Post) never ask you to transfer funds to a "government clearance account".
4. ELECTRICITY & UTILITY SCAMS:
   - State power boards (BESCOM, MSEDCL, UPPCL, TPDDL, etc.) do NOT send disconnection threats from personal WhatsApp/mobile numbers.
5. REMOTE ACCESS APPS:
   - Fraudsters frequently instruct victims to download AnyDesk, TeamViewer, RustDesk, or QuickSupport to gain total device takeover.
6. TRAI / DOT / SIM BLOCKING:
   - DoT or TRAI does not call individuals threatening 2-hour SIM deactivation. This is managed via Sanchar Saathi / Chakshu portal.

OUTPUT REQUIREMENTS:
- You must evaluate with precision and provide realistic scores (0-100).
- 0-20: LOW RISK (Authentic or typical official notification)
- 21-50: MODERATE RISK (Unverified, ambiguous, proceed with caution)
- 51-75: HIGH RISK (Strong indicators of deception or impersonation)
- 76-100: CRITICAL RISK (Active phishing, known scam vector, extortion, or UPI steal attempt)
- Never say "This is 100% safe" or declare absolute legal certainty; frame as risk analysis.
- Plain, accessible language. Do not use dense cybersecurity jargon without explaining it.
- If language requested is 'hi' (Hindi), provide natural conversational Hindi (Devanagari). If 'hinglish', provide Roman Hindi. If 'en', clear English.
`;

// Helper function to call NVIDIA NIM API if NVIDIA_API_KEY is configured
async function analyzeWithNvidia(promptText: string): Promise<any | null> {
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  if (!nvidiaKey || nvidiaKey === 'MY_NVIDIA_API_KEY') {
    return null;
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${nvidiaKey}`,
    },
    body: JSON.stringify({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [
        {
          role: 'system',
          content: `${SCAM_ANALYSIS_SYSTEM_PROMPT}\nIMPORTANT: Respond ONLY with valid, parseable JSON matching the requested structure without any markdown formatting.`,
        },
        {
          role: 'user',
          content: promptText,
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.warn(`NVIDIA NIM returned ${response.status}: ${errBody}, falling back to Gemini...`);
    return null;
  }

  const jsonResponse = await response.json();
  const content = jsonResponse.choices?.[0]?.message?.content;
  if (!content) return null;

  const cleaned = content.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned);
}

// Analysis Endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { type, content, imageData, language = 'en' } = req.body;

    if (!content && !imageData) {
      return res.status(400).json({ error: 'No message, URL, or image data provided.' });
    }

    const langInstruction =
      language === 'hi'
        ? 'Provide the summary and multilingual_summary in clear Hindi (Devanagari script).'
        : language === 'hinglish'
        ? 'Provide the multilingual_summary in colloquial Hinglish (Hindi written using English alphabet).'
        : 'Provide all explanations in clear, accessible Indian English.';

    const promptText = `
Analyze this input for potential cyber fraud or scam in India:
Input Type: ${type}
Content / Context:
"""
${content || '(No direct text, see attached screenshot/image)'}
"""

Target User Language: ${language}
${langInstruction}

Carefully detect:
1. Exact scam category (e.g., "UPI PIN Collection Scam", "Bank KYC Phishing APK", "Digital Arrest / Police Impersonation", "Part-Time Task Scam", "Electricity Bill Cutoff", "Fake Customer Care", "Courier Customs Drugs Scam", "Legitimate Notification").
2. Standardized risk score (0-100).
3. Risk level: LOW, MODERATE, HIGH, or CRITICAL.
4. Summary: Direct, punchy 1-2 sentence explanation of what is going on.
5. Why Suspicious: 3-5 concrete red flags detected with severity levels.
6. DO NOT: 3-4 strict actions the user must NEVER do right now (e.g. "Do not enter UPI PIN", "Do not download APK", "Do not share OTP").
7. Recommended Actions: Step-by-step immediate safe recourse (e.g. "Open official YONO app", "Call 1930 Cyber Helpline", "Report on Chakshu portal").
8. How to Verify: Exact independent method to check without contacting the sender.
9. Extracted Entities: Any suspicious phone numbers, URLs, UPI VPAs, bank names, or app names found.
10. Multilingual explanation in ${language}.
`;

    let parsedData: any = null;

    // If NVIDIA_API_KEY is configured and no image is attached, try NVIDIA NIM first
    if (!imageData && process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY !== 'MY_NVIDIA_API_KEY') {
      try {
        parsedData = await analyzeWithNvidia(promptText);
        if (parsedData) {
          console.log('⚡ Analyzed using NVIDIA NIM API');
        }
      } catch (nvidiaErr) {
        console.warn('NVIDIA NIM attempt failed, using Gemini 3.8 Flash fallback:', nvidiaErr);
      }
    }

    // Default & Multimodal Vision Engine: Gemini 3.8 Flash
    if (!parsedData) {
      const contentsPayload: any[] = [];

      // If screenshot or QR image is attached, provide it as inlineData part
      if (imageData && typeof imageData === 'string') {
        const match = imageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[2];
          contentsPayload.push({
            inlineData: {
              mimeType,
              data: base64Data,
            },
          });
        }
      }

      contentsPayload.push({
        text: promptText,
      });

      // Call Gemini 3.8 Flash using server-side SDK
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsPayload,
        config: {
          systemInstruction: SCAM_ANALYSIS_SYSTEM_PROMPT,
          temperature: 0.2, // Low temperature for consistent risk assessment
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risk_score: { type: Type.INTEGER, description: 'Score between 0 and 100' },
              risk_level: { type: Type.STRING, description: 'LOW, MODERATE, HIGH, or CRITICAL' },
              category: { type: Type.STRING, description: 'Scam category name' },
              summary: { type: Type.STRING, description: '1-2 sentence plain language verdict' },
              multilingual_summary: { type: Type.STRING, description: 'Summary in requested user language' },
              confidence_score: { type: Type.INTEGER, description: 'Confidence in analysis 0-100' },
              why_suspicious: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    signal: { type: Type.STRING },
                    severity: { type: Type.STRING, description: 'critical, high, medium, or low' },
                    detail: { type: Type.STRING },
                  },
                  required: ['signal', 'severity', 'detail'],
                },
              },
              do_not: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommended_actions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              how_to_verify: {
                type: Type.STRING,
              },
              extracted_entities: {
                type: Type.OBJECT,
                properties: {
                  phone_numbers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  urls: { type: Type.ARRAY, items: { type: Type.STRING } },
                  upi_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                  organizations_mentioned: { type: Type.ARRAY, items: { type: Type.STRING } },
                  apps_requested: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              emergency_contact: {
                type: Type.OBJECT,
                properties: {
                  helpline: { type: Type.STRING },
                  portal: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                },
              },
            },
            required: [
              'risk_score',
              'risk_level',
              'category',
              'summary',
              'multilingual_summary',
              'why_suspicious',
              'do_not',
              'recommended_actions',
              'how_to_verify',
            ],
          },
        },
      });

      const responseText = response.text || '{}';
      parsedData = JSON.parse(responseText);
    }

    // Ensure fallback safety if fields are missing
    const sanitizedResult = {
      ...parsedData,
      id: 'scan-' + Date.now(),
      timestamp: new Date().toISOString(),
      inputType: type,
    };

    return res.json({ success: true, result: sanitizedResult });
  } catch (error: any) {
    console.error('Error during scam analysis:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze content. Please try again.',
    });
  }
});

// Community Threat Feed endpoint
app.get('/api/threat-feed', (req: Request, res: Response) => {
  const category = req.query.category as string;
  let results = [...communityThreats];
  if (category && category !== 'All') {
    results = results.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()));
  }
  return res.json({ success: true, threats: results });
});

// Report Scam endpoint
app.post('/api/report', (req: Request, res: Response) => {
  const { targetType, targetValue, category, description, city, state } = req.body;
  if (!targetValue || !description) {
    return res.status(400).json({ error: 'Target details and description are required.' });
  }

  const newReport: ScamReport = {
    id: 'rep-' + Date.now(),
    category: category || 'Reported Scam',
    targetType: targetType || 'message',
    targetValue,
    description,
    city: city || 'India',
    state: state || '',
    riskScore: 92,
    reportedAt: 'Just now',
    upvotes: 1,
  };

  communityThreats.unshift(newReport);
  return res.json({ success: true, report: newReport });
});

// Upvote report
app.post('/api/report/:id/upvote', (req: Request, res: Response) => {
  const report = communityThreats.find((r) => r.id === req.params.id);
  if (report) {
    report.upvotes += 1;
    return res.json({ success: true, upvotes: report.upvotes });
  }
  return res.status(404).json({ error: 'Report not found' });
});

// Official Helplines Directory
app.get('/api/helplines', (_req: Request, res: Response) => {
  return res.json({
    helplines: [
      {
        name: 'National Cyber Crime Helpline (MHA / I4C)',
        number: '1930',
        available: '24x7 Toll Free',
        description: 'Call immediately within golden hour if financial fraud has occurred to freeze money in transit.',
        url: 'https://cybercrime.gov.in',
        badge: 'Critical Emergency',
      },
      {
        name: 'Chakshu Portal (DoT Sanchar Saathi)',
        number: 'sancharsaathi.gov.in',
        available: 'Online Portal',
        description: 'Report suspected fraud SMS, WhatsApp, and calls for immediate telecom number disconnection.',
        url: 'https://sancharsaathi.gov.in/sfc/',
        badge: 'Number Disconnection',
      },
      {
        name: 'RBI Sachet Portal',
        number: 'sachet.rbi.org.in',
        available: 'Online Portal',
        description: 'Report unregistered illegal loan apps, chit funds, and fake financial entities.',
        url: 'https://sachet.rbi.org.in',
        badge: 'Illegal Loan Apps',
      },
      {
        name: 'SEBI SCORES Portal',
        number: 'scores.sebi.gov.in',
        available: 'Online & App',
        description: 'Report fake stock market advisory, pump & dump WhatsApp groups, and unauthorized brokerages.',
        url: 'https://scores.sebi.gov.in',
        badge: 'Stock Scams',
      },
      {
        name: 'National Consumer Helpline (NCH)',
        number: '1915',
        available: '08:00 AM - 08:00 PM',
        description: 'For fake e-commerce websites, deceptive seller practices, and missing merchant orders.',
        url: 'https://consumerhelpline.gov.in',
        badge: 'Shopping Fraud',
      },
    ],
  });
});

// Setup Vite Dev Server Middleware or Static Serve
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ ScamShield India server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
