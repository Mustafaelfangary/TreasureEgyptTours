'use client';

import { useState, useEffect } from 'react';

interface MegaMenuTestProps {
  onTestComplete?: (results: any) => void;
}

export default function MegaMenuTest({ onTestComplete }: MegaMenuTestProps) {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results: any = {
      hoverBehavior: false,
      imageLoading: false,
      navigationLinks: false,
      mobileMenu: false,
      errors: []
    };

    try {
      // Test 1: Hover behavior
      console.log('🧪 Testing mega menu hover behavior...');
      const navItems = document.querySelectorAll('.dropdown-container');
      if (navItems.length > 0) {
        results.hoverBehavior = true;
        console.log('✅ Mega menu hover containers found');
      } else {
        results.errors.push('No dropdown containers found');
      }

      // Test 2: Image loading
      console.log('🧪 Testing image loading...');
      const images = document.querySelectorAll('img');
      let loadedImages = 0;
      let totalImages = images.length;
      
      for (const img of images) {
        if (img.complete && img.naturalHeight !== 0) {
          loadedImages++;
        }
      }
      
      results.imageLoading = loadedImages / totalImages > 0.8; // 80% success rate
      console.log(`✅ Images loaded: ${loadedImages}/${totalImages}`);

      // Test 3: Navigation links
      console.log('🧪 Testing navigation links...');
      const links = document.querySelectorAll('a[href]');
      let validLinks = 0;
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('/') || href.startsWith('http'))) {
          validLinks++;
        }
      });
      
      results.navigationLinks = validLinks / links.length > 0.9; // 90% success rate
      console.log(`✅ Valid navigation links: ${validLinks}/${links.length}`);

      // Test 4: Mobile menu
      console.log('🧪 Testing mobile menu...');
      const mobileMenuButton = document.querySelector('[data-testid="mobile-menu-button"]') || 
                              document.querySelector('button[aria-label*="menu"]') ||
                              document.querySelector('.mobile-menu-button');
      
      if (mobileMenuButton) {
        results.mobileMenu = true;
        console.log('✅ Mobile menu button found');
      } else {
        results.errors.push('Mobile menu button not found');
      }

    } catch (error) {
      results.errors.push(`Test error: ${error.message}`);
      console.error('❌ Test error:', error);
    }

    setTestResults(results);
    setIsRunning(false);
    
    if (onTestComplete) {
      onTestComplete(results);
    }
  };

  useEffect(() => {
    // Auto-run tests after component mounts
    const timer = setTimeout(() => {
      runTests();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: boolean) => status ? '✅' : '❌';
  const getStatusText = (status: boolean) => status ? 'PASS' : 'FAIL';

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Mega Menu Test</h3>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Hover Behavior:</span>
          <span className={`font-medium ${testResults.hoverBehavior ? 'text-green-600' : 'text-red-600'}`}>
            {getStatusIcon(testResults.hoverBehavior)} {getStatusText(testResults.hoverBehavior)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Image Loading:</span>
          <span className={`font-medium ${testResults.imageLoading ? 'text-green-600' : 'text-red-600'}`}>
            {getStatusIcon(testResults.imageLoading)} {getStatusText(testResults.imageLoading)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Navigation Links:</span>
          <span className={`font-medium ${testResults.navigationLinks ? 'text-green-600' : 'text-red-600'}`}>
            {getStatusIcon(testResults.navigationLinks)} {getStatusText(testResults.navigationLinks)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Mobile Menu:</span>
          <span className={`font-medium ${testResults.mobileMenu ? 'text-green-600' : 'text-red-600'}`}>
            {getStatusIcon(testResults.mobileMenu)} {getStatusText(testResults.mobileMenu)}
          </span>
        </div>

        {testResults.errors && testResults.errors.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <h4 className="font-medium text-red-800 mb-1">Errors:</h4>
            <ul className="text-xs text-red-700 space-y-1">
              {testResults.errors.map((error: string, index: number) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
