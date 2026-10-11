// Gemini API Service with Graceful Offline/Knowledge-Base Fallback

const SYSTEM_INSTRUCTION = `
You are "Sentinel Sahayak", the friendly, calm, and trustworthy civic AI assistant within the "BIS Sentinel – Consumer Checker" mobile web application for Indian consumers.
Your primary user is Meera, 34, from Coimbatore, who reads Tamil comfortably and English adequately, is non-technical, and wants plain-language explanations without feeling overwhelmed or alarmed.

STRICT TONE AND WORDING RULES (NON-NEGOTIABLE):
1. NEVER use the words "fake", "fraud", "genuine", or "counterfeit". These are forbidden.
2. Use calm, neutral, objective civic language. Instead of "fake", say "inconsistent with available official records" or "unverified claim" or "licence mismatch".
3. Instead of "genuine", say "consistent with available records" or "verified against official registry".
4. Clarify that check results represent a comparison against available public records, NOT a legal finding. Only authorized human BIS officers make legal determinations.
5. Explain technical terms simply:
   - CM/L: Certification Marks / Licence number (a 7 or 8-digit unique code issued to a specific manufacturing factory for a specific product).
   - QCO: Quality Control Order (a government order making BIS certification mandatory for that product before sale in India).
   - ISI Mark: The standard quality & safety mark for domestic goods in India.
   - CRS: Compulsory Registration Scheme (self-declaration of conformity for electronics like laptops and chargers).
6. Always end with one constructive, calm next step (e.g., re-taking a clearer photo, checking the official BIS Care portal, or filing a neutral inquiry).
7. If the user writes or speaks in Tamil, respond warmly in fluent Tamil (தமிழ்).
8. If the user writes or speaks in Hindi, respond warmly in fluent Hindi (हिंदी).
9. If the user writes or speaks in English, respond warmly in clear, accessible Indian English.
Keep responses concise, formatted with clear bullets if needed, suitable for mobile screens.
`;

// Local fallback responses for key topics when offline or without API key
const FALLBACK_KNOWLEDGE = {
  en: {
    greeting: "Hello! I am Sentinel Sahayak, your consumer companion for verifying BIS standard marks. How can I assist you today?",
    isi: "The ISI mark (under the Indian Standards Institution, now BIS) certifies that a product adheres to rigorous Indian safety standards. Each mark should display the Indian Standard number (e.g., IS 302) on top and a 7-digit licence number (CM/L-xxxxxxx) at the bottom.",
    crs: "The CRS (Compulsory Registration Scheme) mark is used for electronic and IT equipment like phone chargers, power banks, and laptops. Instead of a CM/L number, it displays an R-number (e.g., R-41001234) registered with BIS.",
    inconsistency: "A 'Possible inconsistency' indicates that the licence number printed on the product points to a different manufacturer, brand, or product category in the official BIS database. It is not a legal finding, but suggests withholding purchase until verified.",
    how_to_check: "You can check any item by taking a clear photo of the rating plate, pasting an online shopping link, or typing the 7-digit CM/L licence number directly into our Check screen.",
    report: "If you observe an inconsistency, you can submit a neutral report directly through the app. The details are formatted for the official BIS Care portal, where a human officer reviews the evidence.",
    default: "I am here to help you understand standard marks, licence numbers, and check results. You can ask me how to read a mark, what your result means, or how to report an inconsistency.",
  },
  ta: {
    greeting: "வணக்கம்! நான் Sentinel Sahayak. BIS தரக் குறியீடுகளை சரிபார்க்க உதவும் உங்கள் வழிகாட்டி. நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    isi: "ISI முத்திரை என்பது ஒரு தயாரிப்பு இந்திய பாதுகாப்பு தரங்களுக்கு உட்பட்டது என்பதை உறுதிப்படுத்துகிறது. இதில் மேலே இந்திய தர எண் (எ.கா. IS 302) மற்றும் கீழே 7 இலக்க உரிம எண் (CM/L-xxxxxxx) இருக்க வேண்டும்.",
    crs: "CRS முத்திரை என்பது சார்ஜர்கள், மடிக்கணினிகள் போன்ற மின்னணு பொருட்களுக்கானது. இதில் CM/L எண்ணுக்கு பதிலாக 'R-xxxxxxxx' பதிவு எண் இருக்கும்.",
    inconsistency: "'சாத்தியமான முரண்பாடு' என்றால், தயாரிப்பில் உள்ள உரிம எண் அதிகாரப்பூர்வ பதிவில் வேறு நிறுவனம் அல்லது வேறு பொருளின் பெயரில் உள்ளது என்று பொருள். இது இறுதி தீர்ப்பு அல்ல, ஆனால் கூடுதல் ஆய்வு தேவைப்படுகிறது.",
    how_to_check: "தயாரிப்பின் விவர பலகையை புகைப்படம் எடுப்பதன் மூலமோ, இணையதள இணைப்பை ஒட்டுவதன் மூலமோ அல்லது 7 இலக்க CM/L எண்ணை உள்ளிடுவதன் மூலமோ நீங்கள் எளிதாக சரிபார்க்கலாம்.",
    report: "முரண்பாடு தென்பட்டால், நீங்கள் இந்த செயலி மூலம் BIS Care போர்ட்டலுக்கு நடுநிலையான புகாரை சமர்ப்பிக்கலாம். அரசு அதிகாரி இதனை மதிப்பாய்வு செய்வார்.",
    default: "BIS தரக் குறியீடுகள், உரிம எண்கள் மற்றும் முடிவுகள் பற்றி அறிந்து கொள்ள நான் உதவுகிறேன். உங்களுக்கு என்ன விளக்கம் தேவை?",
  },
  hi: {
    greeting: "नमस्ते! मैं Sentinel Sahayak हूँ, BIS मानक चिन्हों की पुष्टि में आपकी सहायता के लिए। मैं आपकी क्या मदद कर सकता हूँ?",
    isi: "ISI मार्क यह प्रमाणित करता है कि उत्पाद भारतीय सुरक्षा मानकों के अनुरूप है। इसके ऊपर भारतीय मानक संख्या (जैसे IS 302) और नीचे 7-अंकों का लाइसेंस नंबर (CM/L-xxxxxxx) होना अनिवार्य है।",
    crs: "CRS मार्क मोबाइल चार्जर और लैपटॉप जैसे इलेक्ट्रॉनिक्स के लिए होता है। इसमें CM/L की जगह 'R-xxxxxxxx' पंजीकरण संख्या दर्ज होती है।",
    inconsistency: "'संभावित विसंगति' का अर्थ है कि उत्पाद पर दिया गया लाइसेंस नंबर आधिकारिक रिकॉर्ड में किसी अन्य कंपनी या श्रेणी के नाम पर है। यह कोई कानूनी फैसला नहीं है, बल्कि अतिरिक्त जांच की आवश्यकता दर्शाता है।",
    how_to_check: "आप उत्पाद के लेबल की फोटो खींचकर, ऑनलाइन लिंक पेस्ट करके या 7 अंकों का CM/L नंबर डालकर तुरंत जांच कर सकते हैं।",
    report: "यदि कोई विसंगति मिलती है, तो आप निष्पक्ष रूप से BIS Care पोर्टल पर रिपोर्ट दर्ज कर सकते हैं, जिसकी समीक्षा आधिकारिक अधिकारी करेंगे।",
    default: "मैं मानक चिन्हों, लाइसेंस नंबर और रिपोर्टिंग प्रक्रिया को समझने में आपकी सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?",
  },
};

export const geminiService = {
  /**
   * Send user message to Gemini API or intelligent local fallback
   */
  async sendMessage({ message, language = 'en', currentContext = null }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const lang = ['ta', 'hi'].includes(language) ? language : 'en';

    // If an API key is available, attempt real Gemini API call
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${SYSTEM_INSTRUCTION}\n\nUser Preferred Language: ${language}\nCurrent User Context in App: ${JSON.stringify(currentContext || {})}\n\nUser Message: ${message}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.4,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 500,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim().length > 0) {
            return {
              text: candidateText.trim(),
              source: 'gemini',
            };
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local Sahayak engine:', err);
      }
    }

    // Intelligent local fallback based on keywords and context
    await new Promise((r) => setTimeout(r, 600)); // natural reading pace
    const textLower = message.toLowerCase();
    const fb = FALLBACK_KNOWLEDGE[lang] || FALLBACK_KNOWLEDGE.en;

    if (textLower.includes('isi') || textLower.includes('mark') || textLower.includes('முத்திரை') || textLower.includes('चिन्ह')) {
      return { text: fb.isi, source: 'knowledge_base' };
    }
    if (textLower.includes('crs') || textLower.includes('charger') || textLower.includes('electronics') || textLower.includes('மின்')) {
      return { text: fb.crs, source: 'knowledge_base' };
    }
    if (textLower.includes('inconsistency') || textLower.includes('mismatch') || textLower.includes('முரண்பாடு') || textLower.includes('विसंगति')) {
      return { text: fb.inconsistency, source: 'knowledge_base' };
    }
    if (textLower.includes('how') || textLower.includes('check') || textLower.includes('சரிபார்க்க') || textLower.includes('कैसे')) {
      return { text: fb.how_to_check, source: 'knowledge_base' };
    }
    if (textLower.includes('report') || textLower.includes('complaint') || textLower.includes('புகார்') || textLower.includes('शिकायत')) {
      return { text: fb.report, source: 'knowledge_base' };
    }
    if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('வணக்கம்') || textLower.includes('नमस्ते')) {
      return { text: fb.greeting, source: 'knowledge_base' };
    }

    return {
      text: fb.default,
      source: 'knowledge_base',
    };
  },

  /**
   * Get localized greeting
   */
  getGreeting(language = 'en') {
    const lang = ['ta', 'hi'].includes(language) ? language : 'en';
    return FALLBACK_KNOWLEDGE[lang]?.greeting || FALLBACK_KNOWLEDGE.en.greeting;
  },

  /**
   * Get suggested quick replies per language
   */
  getQuickReplies(language = 'en') {
    if (language === 'ta') {
      return [
        { label: 'ISI முத்திரை என்றால் என்ன?', query: 'ISI முத்திரை என்றால் என்ன?' },
        { label: 'தயாரிப்பை எப்படி சரிபார்ப்பது?', query: 'தயாரிப்பை எப்படி சரிபார்ப்பது?' },
        { label: 'முரண்பாடு என்றால் என்ன?', query: 'சாத்தியமான முரண்பாடு என்றால் என்ன?' },
        { label: 'BIS-ல் புகார் செய்வது எப்படி?', query: 'BIS-ல் புகார் செய்வது எப்படி?' },
      ];
    }
    if (language === 'hi') {
      return [
        { label: 'ISI मार्क क्या है?', query: 'ISI मार्क क्या है?' },
        { label: 'जांच कैसे करें?', query: 'उत्पाद की जांच कैसे करें?' },
        { label: 'विसंगति का क्या अर्थ है?', query: 'संभावित विसंगति का क्या अर्थ है?' },
        { label: 'शिकायत कैसे दर्ज करें?', query: 'BIS में शिकायत कैसे दर्ज करें?' },
      ];
    }
    return [
      { label: 'What is an ISI mark?', query: 'What is an ISI mark and how to read it?' },
      { label: 'How do I check a product?', query: 'How do I check my product?' },
      { label: 'What does Inconsistency mean?', query: 'What does Possible Inconsistency mean?' },
      { label: 'How do I report to BIS?', query: 'How do I report an inconsistency to BIS?' },
    ];
  },
};
