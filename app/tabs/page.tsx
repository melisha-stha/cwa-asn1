'use client';

import { useState } from 'react';

export default function TabsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { id: 0, title: 'Tab 1', content: 'This is the content for Tab 1.' },
    { id: 1, title: 'Tab 2', content: 'This is the content for Tab 2.' },
    { id: 2, title: 'Tab 3', content: 'This is the content for Tab 3.' },
  ]);

  const addTab = () => {
    if (tabs.length < 15) {
      const newId = Math.max(...tabs.map(tab => tab.id)) + 1;
      const newTab = {
        id: newId,
        title: `Tab ${tabs.length + 1}`,
        content: `This is the content for Tab ${tabs.length + 1}.`
      };
      setTabs([...tabs, newTab]);
      setActiveTab(newId); // Switch to the new tab
    }
  };

  const removeTab = (tabId: number) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(newTabs);
      
      // If we're removing the active tab, switch to the first tab
      if (activeTab === tabId) {
        setActiveTab(newTabs[0].id);
      }
    }
  };

  return (
    <main className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tabs Page</h1>
        <button 
          className="btn btn-primary" 
          onClick={addTab}
          disabled={tabs.length >= 15}
        >
          Add Tab ({tabs.length}/15)
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="border rounded-top">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {tabs.map((tab) => (
            <li className="nav-item" role="presentation" key={tab.id}>
              <div className="d-flex align-items-center">
                <button
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  role="tab"
                >
                  {tab.title}
                </button>
                {tabs.length > 1 && (
                  <button
                    className="btn btn-sm btn-outline-danger ms-1"
                    onClick={() => removeTab(tab.id)}
                    title="Remove tab"
                  >
                    ×
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content" id="myTabContent">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="p-3 border border-top-0 rounded-bottom">
              {tab.content}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
