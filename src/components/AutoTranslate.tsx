'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Language codes mapping
const LANG_MAP: Record<string, string> = {
  'en': 'en',
  'ar': 'ar',
  'fr': 'fr',
  'de': 'de',
  'es': 'es',
  'it': 'it',
  'ru': 'ru',
  'zh': 'zh-CN',
  'ja': 'ja'
};

function AutoTranslateClient() {
  const [language, setLanguage] = useState('en');

  // Listen to language changes from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Listen for language changes
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem('language') || 'en';
      setLanguage(newLanguage);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event
    window.addEventListener('languageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Enable Google Translate
    const addGoogleTranslateScript = () => {
      // Remove existing Google Translate elements
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Add Google Translate script
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Initialize Google Translate with better settings
      (window as any).googleTranslateElementInit = function() {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ar,fr,de,es,it,ru,zh-CN,ja',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true,
            // Translate all content including dynamic content
            gaTrack: false,
            gaId: null
          },
          'google_translate_element'
        );
        
        // Force translation of dynamic content
        setTimeout(() => {
          const observer = new MutationObserver(() => {
            const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (selectElement && selectElement.value) {
              // Trigger re-translation when DOM changes
              selectElement.dispatchEvent(new Event('change'));
            }
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }, 2000);
      };
    };

    // Trigger translation when language changes
    const triggerTranslation = () => {
      const targetLang = LANG_MAP[language] || 'en';
      
      if (targetLang === 'en') {
        // Reset to original English
        const frame = document.querySelector('iframe.goog-te-banner-frame') as HTMLIFrameElement;
        if (frame) {
          const frameDoc = frame.contentDocument || frame.contentWindow?.document;
          const restoreButton = frameDoc?.querySelector('.goog-te-button button') as HTMLElement;
          if (restoreButton) {
            restoreButton.click();
          }
        }
      } else {
        // Translate to target language
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = targetLang;
          selectElement.dispatchEvent(new Event('change'));
        }
      }
    };

    // Add script and wait for it to load
    addGoogleTranslateScript();
    
    // Wait for Google Translate to initialize, then trigger translation
    const checkInterval = setInterval(() => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        clearInterval(checkInterval);
        setTimeout(triggerTranslation, 500);
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
    };
  }, [language]);

  return (
    <>
      {/* Hidden Google Translate element */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      />
      
      {/* Hide Google Translate banner */}
      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-te-balloon-frame {
          display: none !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0 !important;
        }
        .goog-te-combo {
          display: none !important;
        }
        #google_translate_element {
          display: none !important;
        }
        .skiptranslate {
          display: none !important;
        }
      `}</style>
    </>
  );
}

// Export with SSR disabled
export default dynamic(() => Promise.resolve(AutoTranslateClient), {
  ssr: false
});
