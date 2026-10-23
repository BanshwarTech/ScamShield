import { QuizQuestion } from '../types/scam';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    contextType: 'UPI & Marketplace',
    scenario: 'An OLX buyer says: "I want to buy your sofa immediately. I am sending you a QR code on WhatsApp. Please scan it and enter your UPI PIN so the ₹8,000 will be credited directly to your bank account."',
    scenarioHindi: 'OLX पर एक खरीदार कहता है: "मैं आपका सोफा तुरंत खरीदना चाहता हूं। मैं वॉट्सऐप पर QR कोड भेज रहा हूं। इसे स्कैन करें और अपना UPI PIN डालें ताकि ₹8,000 सीधे आपके बैंक खाते में जमा हो जाएं।"',
    options: [
      {
        text: 'Scan the QR and enter my 4-digit UPI PIN to receive the advance.',
        textHindi: 'QR कोड स्कैन करके एडवांस पाने के लिए 4-अंकों का UPI PIN डालूंगा।',
        isSafe: false,
      },
      {
        text: 'Tell the buyer: UPI PIN is ONLY entered to deduct money, never to receive. Refuse and block them.',
        textHindi: 'खरीदार को कहूंगा: UPI PIN सिर्फ पैसे काटने के लिए होता है, पाने के लिए नहीं। मना करके ब्लॉक करूंगा।',
        isSafe: true,
      },
      {
        text: 'Share my ATM card details instead so they can transfer directly.',
        textHindi: 'इसके बदले अपने ATM कार्ड की डिटेल दे दूंगा।',
        isSafe: false,
      },
    ],
    verdict: 'SCAM DETECTED',
    explanation: 'Entering your UPI PIN or scanning a QR code ALWAYS transfers money OUT of your bank account. You NEVER need to enter a PIN to receive an incoming payment.',
    explanationHindi: 'UPI PIN डालने या QR स्कैन करने से हमेशा आपके खाते से पैसे कटते हैं। पैसे प्राप्त करने के लिए कभी भी PIN की जरूरत नहीं होती।',
    realScamName: 'QR Code & UPI Collect Fraud',
  },
  {
    id: 2,
    contextType: 'Law Enforcement / Police',
    scenario: 'A caller wearing a police uniform on Skype video says: "I am DCP Cyber Crime Mumbai. We seized a FedEx parcel in your name at customs containing 14 fake passports and MDMA drugs. You are under Digital Arrest right now until you transfer your savings to the RBI verification escrow account."',
    scenarioHindi: 'स्काइप वीडियो कॉल पर पुलिस वर्दी में बैठा व्यक्ति कहता है: "मैं मुंबई साइबर क्राइम DCP हूं। आपके नाम से कस्टम में नशीले पदार्थों का पार्सल पकड़ा गया है। आप अभी डिजिटल अरेस्ट में हैं, जब तक अपने सारे पैसे जांच खाते में नहीं भेजते।"',
    options: [
      {
        text: 'Transfer my savings immediately to cooperate and clear my name.',
        textHindi: 'अपने आप को बेकसूर साबित करने के लिए तुरंत पैसे ट्रांसफर कर दूंगा।',
        isSafe: false,
      },
      {
        text: 'Stay on Skype video call all night without telling anyone as instructed.',
        textHindi: 'जैसा कहा गया है, पूरी रात वीडियो कॉल पर बिना किसी को बताए बैठा रहूंगा।',
        isSafe: false,
      },
      {
        text: 'Disconnect immediately! "Digital Arrest" does not exist under Indian law. Call 1930 Cyber Crime.',
        textHindi: 'तुरंत कॉल काटूंगा! भारतीय कानून में "डिजिटल अरेस्ट" का कोई प्रावधान नहीं है। 1930 पर शिकायत करूंगा।',
        isSafe: true,
      },
    ],
    verdict: 'EXTORTION / DIGITAL ARREST SCAM',
    explanation: 'There is NO such thing as "Digital Arrest" under Indian law. Indian police and courts never arrest or interrogate people via Skype/WhatsApp or ask for funds to be transferred to "RBI accounts".',
    explanationHindi: 'भारतीय कानून में "डिजिटल अरेस्ट" जैसी कोई चीज नहीं है। असली पुलिस कभी वीडियो कॉल पर पूछताछ या पैसे ट्रांसफर करने की मांग नहीं करती।',
    realScamName: 'Digital Arrest & Law Enforcement Impersonation',
  },
  {
    id: 3,
    contextType: 'Banking & KYC',
    scenario: 'You receive an SMS from a 10-digit number (+91 94210 55123): "Dear Customer, Your SBI YONO account will be blocked today due to pending PAN KYC. Download SBI_Quick_Update.apk from bit.ly/sbi-pan-kyc to avoid account suspension."',
    scenarioHindi: 'आपको एक 10-अंकों के मोबाइल नंबर से SMS मिलता है: "प्रिय ग्राहक, PAN KYC न होने के कारण आपका SBI YONO खाता आज ब्लॉक हो जाएगा। bit.ly/sbi-pan-kyc से SBI_Quick_Update.apk डाउनलोड करें।"',
    options: [
      {
        text: 'Download the APK file and give all requested permissions to update KYC quickly.',
        textHindi: 'APK डाउनलोड करूंगा और KYC अपडेट करने के लिए सभी परमिशन दे दूंगा।',
        isSafe: false,
      },
      {
        text: 'Forward the SMS to family members to warn them to update their KYC too.',
        textHindi: 'अपने परिवार वालों को फॉरवर्ड करूंगा ताकि वे भी अपडेट कर लें।',
        isSafe: false,
      },
      {
        text: 'Do not click or download APK. Open official SBI YONO app manually or visit branch.',
        textHindi: 'लिंक पर क्लिक या APK डाउनलोड बिल्कुल नहीं करूंगा। खुद आधिकारिक SBI YONO ऐप खोलकर जांचूंगा।',
        isSafe: true,
      },
    ],
    verdict: 'MALICIOUS APK / PHISHING SCAM',
    explanation: 'Banks never send APK installation links or threaten immediate 24-hour account suspension via personal 10-digit phone numbers. The APK secretly steals OTPs by intercepting your SMS messages.',
    explanationHindi: 'बैंक कभी भी आम मोबाइल नंबर से लिंक या APK फाइल नहीं भेजते। यह APK आपके फोन के OTP चोरी करने के लिए बनाया जाता है।',
    realScamName: 'Bank KYC APK Phishing',
  },
  {
    id: 4,
    contextType: 'Remote Access / Customer Support',
    scenario: 'You called a customer care number found on Google for an online shopping refund. The agent says: "Sir, to process your ₹850 refund, please install AnyDesk or RustDesk from Play Store and give me the 9-digit code so I can assist your screen."',
    scenarioHindi: 'आपने ऑनलाइन शॉपिंग रिफंड के लिए गूगल पर मिले नंबर पर कॉल किया। एजेंट कहता है: "सर, ₹850 रिफंड के लिए प्ले स्टोर से AnyDesk डाउनलोड करें और 9-अंकों का कोड बताएं।"',
    options: [
      {
        text: 'Install AnyDesk and share the code so the agent can quickly issue the refund.',
        textHindi: 'AnyDesk इंस्टॉल करके कोड बता दूंगा ताकि रिफंड मिल सके।',
        isSafe: false,
      },
      {
        text: 'Never install AnyDesk on an unknown caller’s instruction! Hang up immediately.',
        textHindi: 'अज्ञात कॉलर के कहने पर कभी भी AnyDesk इंस्टॉल न करें! तुरंत कॉल काट दूंगा।',
        isSafe: true,
      },
      {
        text: 'Open my banking app and type my password while the screen is shared.',
        textHindi: 'स्क्रीन शेयरिंग चालू रखकर अपनी नेट बैंकिंग ऐप खोलकर पासवर्ड डालूंगा।',
        isSafe: false,
      },
    ],
    verdict: 'DEVICE TAKEOVER FRAUD',
    explanation: 'AnyDesk and TeamViewer are remote desktop control tools. Once you give the code, the fraudster sees everything on your screen, reads your OTPs, and can completely drain your bank accounts.',
    explanationHindi: 'AnyDesk से कॉलर को आपके फोन का पूरा कंट्रोल मिल जाता है। वह आपकी स्क्रीन पर दिखने वाले बैंक OTP देखकर पूरा खाता खाली कर सकता है।',
    realScamName: 'Remote Screen Share App Fraud',
  },
  {
    id: 5,
    contextType: 'Part-Time Job / Telegram',
    scenario: 'A WhatsApp message from an international number (+62 812-xxx): "Earn ₹3,000 to ₹7,000 daily from home. Simply like YouTube videos and rate 5 stars to Google Maps hotels. We pay ₹150 per task instantly via UPI."',
    scenarioHindi: 'अंतरराष्ट्रीय नंबर से वॉट्सऐप मैसेज आता है: "घर बैठे रोजाना 3000 से 7000 रुपये कमाएं। बस यूट्यूब वीडियो लाइक करें और गूगल मैप्स पर होटल को 5 स्टार दें। प्रति टास्क तुरंत ₹150 पाएं।"',
    options: [
      {
        text: 'It is a classic Telegram task scam! They pay ₹150 initially, then demand thousands to unlock salary.',
        textHindi: 'यह कुख्यात टेलीग्राम टास्क स्कैम है! शुरू में ₹150 देकर विश्वास जीतते हैं, फिर लाखों जमा करवाते हैं।',
        isSafe: true,
      },
      {
        text: 'Accept the job and invest ₹10,000 in their VIP group to earn high returns.',
        textHindi: 'जॉब स्वीकार कर लूंगा और ज्यादा मुनाफे के लिए VIP ग्रुप में ₹10,000 इन्वेस्ट करूंगा।',
        isSafe: false,
      },
      {
        text: 'Share my Aadhaar and bank passbook with them to register for employee payroll.',
        textHindi: 'सैलरी पाने के लिए अपना आधार कार्ड और बैंक पासबुक भेज दूंगा।',
        isSafe: false,
      },
    ],
    verdict: 'TELEGRAM PREPAID TASK SCAM',
    explanation: 'This scam has looted hundreds of crores across India. Fraudsters give nominal initial payouts to trap victims, then coerce them into depositing escalating sums of money into fake crypto/investment dashboards.',
    explanationHindi: 'यह एक बहुत बड़ा संगठित फ्रॉड है। शुरू में थोड़े पैसे देकर लालच बढ़ाते हैं, फिर "प्रीमियम टास्क" के नाम पर लाखों रुपये ठग लेते हैं।',
    realScamName: 'Work From Home Review Scam',
  },
];
