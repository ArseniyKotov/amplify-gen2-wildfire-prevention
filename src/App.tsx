/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../amplify/data/resource';
import config from '../amplify_outputs.json';

import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import AlertsPage from './pages/AlertsPage';
import MapPage from './pages/MapPage';

// Configure Amplify
Amplify.configure(config);

const client = generateClient<Schema>();

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header user={user} onSignOut={signOut} />

            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Dashboard
                      userId={user?.username}
                      isAdmin={user?.attributes?.email?.endsWith(
                        '@firewatch.gov'
                      )}
                    />
                  }
                />
                <Route
                  path="/report"
                  element={
                    <ReportPage userId={user?.username || 'anonymous'} />
                  }
                />
                <Route
                  path="/alerts"
                  element={<AlertsPage userId={user?.username} />}
                />
                <Route path="/map" element={<MapPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <footer className="bg-accent py-6">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                          clipRule="evenodd"
                        />
                      </svg>
                      FireWatch California
                    </h3>
                    <p className="text-text-muted text-sm">
                      Early wildfire detection and reporting system
                    </p>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-text-muted text-sm">
                      In case of emergency, call 911
                    </p>
                    <p className="text-text-muted text-xs mt-1">
                      © 2023 FireWatch California. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
