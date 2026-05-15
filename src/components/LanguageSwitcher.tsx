'use client';

import { Globe } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Check if there's a google translate cookie
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match && match[1]) {
      const lang = match[1].split('/').pop();
      if (lang) setCurrentLang(lang);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    setCurrentLang(value);
    
    // Google Translate relies on the 'googtrans' cookie. 
    // Setting it manually and reloading is the most reliable way to force the translation.
    document.cookie = `googtrans=/en/${value}; path=/; domain=${location.hostname}`;
    document.cookie = `googtrans=/en/${value}; path=/`;
    
    window.location.reload();
  };

  const globalLanguages = [
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'ur', name: 'اردو (Urdu)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'zh-CN', name: '中文 (Chinese)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'ko', name: '한국어 (Korean)' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'ru', name: 'Русский (Russian)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'it', name: 'Italiano (Italian)' },
    { code: 'nl', name: 'Nederlands (Dutch)' },
    { code: 'tr', name: 'Türkçe (Turkish)' },
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  ];

  return (
    <>
      {/* Our Custom, Beautiful UI */}
      <div className="absolute top-4 right-4 z-[60] flex items-center gap-2 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-full py-2 px-4 ring-1 ring-white/10 transition-all hover:bg-neutral-800">
        <Globe className="w-4 h-4 text-indigo-400" />
        <select 
          className="bg-transparent text-sm font-medium text-neutral-200 outline-none cursor-pointer appearance-none focus:ring-0"
          onChange={(e) => handleLanguageChange(e.target.value)}
          value={currentLang}
        >
          <optgroup label="Primary Languages" className="bg-neutral-900 text-indigo-300">
            <option value="en" className="bg-neutral-900 text-neutral-200">English</option>
            <option value="si" className="bg-neutral-900 text-neutral-200">සිංහල (Sinhala)</option>
            <option value="ta" className="bg-neutral-900 text-neutral-200">தமிழ் (Tamil)</option>
          </optgroup>
          <optgroup label="Global Languages" className="bg-neutral-900 text-neutral-500">
            {globalLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-neutral-900 text-neutral-200">
                {lang.name}
              </option>
            ))}
          </optgroup>
        </select>
        {/* Custom Dropdown Arrow */}
        <div className="pointer-events-none text-neutral-500 text-xs ml-1">▼</div>
      </div>

      {/* Hidden Google Translate Element (Must not be display: none) */}
      <div 
        id="google_translate_element" 
        style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, zIndex: -100 }}
      ></div>
      
      <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}
      </Script>
    </>
  );
}
