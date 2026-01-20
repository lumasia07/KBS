import React from 'react'
export function Footer() {
  return (
    <footer className="bg-[#003366] text-white py-12 border-t border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 tracking-tight">
              Kinshasa Bureau of Standards
            </h3>
            <p className="text-blue-200 text-sm max-w-md leading-relaxed">
              The official Integrated Stamping System for revenue collection,
              compliance verification, and digital governance.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Taxpayer Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Verify Stamp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Agent Login
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  System Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact RCEKIN
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Report Fraud
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-blue-300">
            © 2026 Kinshasa Bureau of Standards. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-blue-300">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
