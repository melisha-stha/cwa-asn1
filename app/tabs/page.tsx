'use client';

import { useState, useEffect } from 'react';

export default function TabsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { id: 0, title: 'Tab 1', content: 'This is the content for Tab 1.' },
    { id: 1, title: 'Tab 2', content: 'This is the content for Tab 2.' },
    { id: 2, title: 'Tab 3', content: 'This is the content for Tab 3.' },
  ]);
  const [editingTitle, setEditingTitle] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<number | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [editContentValue, setEditContentValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tabs from localStorage on component mount
  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem('tabs');
      const savedActiveTab = localStorage.getItem('activeTab');
      
      if (savedTabs) {
        const parsedTabs = JSON.parse(savedTabs);
        if (Array.isArray(parsedTabs) && parsedTabs.length > 0) {
          setTabs(parsedTabs);
        }
      }
      
      if (savedActiveTab) {
        const parsedActiveTab = parseInt(savedActiveTab);
        if (!isNaN(parsedActiveTab)) {
          setActiveTab(parsedActiveTab);
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save tabs to localStorage whenever tabs or activeTab changes (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('tabs', JSON.stringify(tabs));
        localStorage.setItem('activeTab', activeTab.toString());
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [tabs, activeTab, isLoaded]);

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

  const startEditingTitle = (tabId: number, currentTitle: string) => {
    setEditingTitle(tabId);
    setEditTitleValue(currentTitle);
  };

  const startEditingContent = (tabId: number, currentContent: string) => {
    setEditingContent(tabId);
    setEditContentValue(currentContent);
  };

  const saveTitle = (tabId: number) => {
    if (editTitleValue.trim()) {
      setTabs(tabs.map(tab => 
        tab.id === tabId ? { ...tab, title: editTitleValue.trim() } : tab
      ));
    }
    setEditingTitle(null);
    setEditTitleValue('');
  };

  const saveContent = (tabId: number) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, content: editContentValue } : tab
    ));
    setEditingContent(null);
    setEditContentValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, saveFunction: () => void) => {
    if (e.key === 'Enter') {
      saveFunction();
    } else if (e.key === 'Escape') {
      setEditingTitle(null);
      setEditingContent(null);
      setEditTitleValue('');
      setEditContentValue('');
    }
  };

  return (
    <main className="container-fluid mt-4">
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
      
      <div className="row">
        {/* Vertical Tab Navigation - Left Side */}
        <div className="col-md-3">
          <h6 className="mb-2">Tabs</h6>
          <div className="border rounded">
            <div className="list-group list-group-flush">
              {tabs.map((tab) => (
                <div key={tab.id} className="d-flex align-items-center">
                  <button
                    className={`list-group-item list-group-item-action text-start flex-grow-1 py-2 ${
                      activeTab === tab.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    {editingTitle === tab.id ? (
                      <input
                        type="text"
                        value={editTitleValue}
                        onChange={(e) => setEditTitleValue(e.target.value)}
                        onBlur={() => saveTitle(tab.id)}
                        onKeyDown={(e) => handleKeyPress(e, () => saveTitle(tab.id))}
                        className="form-control form-control-sm"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingTitle(tab.id, tab.title);
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Click to edit title"
                      >
                        {tab.title}
                      </span>
                    )}
                  </button>
                  {tabs.length > 1 && (
                    <button
                      className="btn btn-sm btn-outline-danger ms-1 me-2"
                      onClick={() => removeTab(tab.id)}
                      title="Remove tab"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content - Right Side */}
        <div className="col-md-9">
          <h6 className="mb-2">Tabs Content</h6>
          <div className="border rounded p-3" style={{ minHeight: '200px', maxHeight: '300px', overflowY: 'auto' }}>
            {editingContent === activeTab ? (
              <textarea
                value={editContentValue}
                onChange={(e) => setEditContentValue(e.target.value)}
                onBlur={() => saveContent(activeTab)}
                onKeyDown={(e) => handleKeyPress(e, () => saveContent(activeTab))}
                className="form-control h-100"
                autoFocus
                style={{ resize: 'none' }}
              />
            ) : (
              <div 
                onClick={() => startEditingContent(activeTab, tabs.find(tab => tab.id === activeTab)?.content || '')}
                style={{ 
                  cursor: 'pointer', 
                  minHeight: '100px',
                  whiteSpace: 'pre-wrap'
                }}
                title="Click to edit content"
              >
                {tabs.find(tab => tab.id === activeTab)?.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
