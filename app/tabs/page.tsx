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
  const [generatedOutput, setGeneratedOutput] = useState('');

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
      setActiveTab(newId);
    }
  };

  const removeTab = (tabId: number) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(newTabs);
      
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

  //The generateOutput() function was developed with help from ChatGPT.
  const generateOutput = () => {
    const htmlOutput = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Tabs</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 20px; background-color: #f8f9fa;">
    <div style="max-width: 1200px; margin: 0 auto;">
        <h1>Generated Tabs</h1>
        <div style="display: flex; gap: 20px;">
            <div style="width: 250px; background: white; border: 1px solid #dee2e6; border-radius: 5px; overflow: hidden;">
                ${tabs.map((tab, index) => `
                <div style="padding: 10px 15px; border-bottom: 1px solid #dee2e6; cursor: pointer; transition: background-color 0.2s; ${index === 0 ? 'background-color: #007bff; color: white;' : ''}" onclick="switchTab(${tab.id})">
                    ${tab.title}
                    ${tabs.length > 1 ? `<button style="float: right; background: none; border: none; color: ${index === 0 ? 'white' : '#6c757d'}; cursor: pointer; font-size: 16px; padding: 0 5px;" onmouseover="this.style.color='#dc3545'" onmouseout="this.style.color='${index === 0 ? 'white' : '#6c757d'}'" onclick="removeTab(${tab.id}); event.stopPropagation();">X</button>` : ''}
                </div>`).join('')}
            </div>
            <div style="flex: 1; background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; min-height: 300px;">
                ${tabs.map((tab, index) => `
                <div style="display: ${index === 0 ? 'block' : 'none'};" id="content-${tab.id}">
                    ${tab.content.replace(/\n/g, '<br>')}
                </div>`).join('')}
            </div>
        </div>
    </div>

    <script>
        let currentTab = ${tabs[0]?.id || 0};
        const tabs = ${JSON.stringify(tabs)};

        function switchTab(tabId) {
            const allTabs = document.querySelectorAll('[onclick*="switchTab"]');
            const allContents = document.querySelectorAll('[id^="content-"]');
            
            allTabs.forEach(item => {
                item.style.backgroundColor = '';
                item.style.color = '';
            });
            allContents.forEach(item => item.style.display = 'none');
            
            const selectedTab = document.querySelector(\`[onclick*="switchTab(\${tabId})"]\`);
            const selectedContent = document.getElementById(\`content-\${tabId}\`);
            
            if (selectedTab) {
                selectedTab.style.backgroundColor = '#007bff';
                selectedTab.style.color = 'white';
            }
            if (selectedContent) {
                selectedContent.style.display = 'block';
            }
            
            currentTab = tabId;
        }

        function removeTab(tabId) {
            if (tabs.length <= 1) return;
            
            const tabElement = document.querySelector(\`[onclick*="switchTab(\${tabId})"]\`);
            const contentElement = document.getElementById(\`content-\${tabId}\`);
            
            if (tabElement && contentElement) {
                tabElement.remove();
                contentElement.remove();
                
                if (currentTab === tabId) {
                    const firstTab = document.querySelector('[onclick*="switchTab"]');
                    if (firstTab) {
                        const firstTabId = parseInt(firstTab.getAttribute('onclick').match(/switchTab\\((\\d+)\\)/)[1]);
                        switchTab(firstTabId);
                    }
                }
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            const allTabs = document.querySelectorAll('[onclick*="switchTab"]');
            allTabs.forEach(tab => {
                tab.addEventListener('mouseenter', function() {
                    if (this.style.backgroundColor !== 'rgb(0, 123, 255)') {
                        this.style.backgroundColor = '#e9ecef';
                    }
                });
                tab.addEventListener('mouseleave', function() {
                    if (this.style.backgroundColor !== 'rgb(0, 123, 255)') {
                        this.style.backgroundColor = '';
                    }
                });
            });
        });
    </script>
</body>
</html>`;

    setGeneratedOutput(htmlOutput);
  };

  const copyToClipboard = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput).then(() => {
        alert('HTML code copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  return (
    <main className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tabs Page</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary" 
            onClick={addTab}
            disabled={tabs.length >= 15}
          >
            Add Tab ({tabs.length}/15)
          </button>
          <button 
            className="btn btn-success" 
            onClick={generateOutput}
          >
            Output
          </button>
        </div>
      </div>
      
      <div className="row">
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
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <h6 className="mb-2">Tabs Content</h6>
          <div className="border rounded p-3" style={{ minHeight: '400px', maxHeight: '500px', overflowY: 'auto' }}>
            {editingContent === activeTab ? (
              <textarea
                value={editContentValue}
                onChange={(e) => setEditContentValue(e.target.value)}
                onBlur={() => saveContent(activeTab)}
                onKeyDown={(e) => handleKeyPress(e, () => saveContent(activeTab))}
                className="form-control"
                autoFocus
                style={{ 
                  resize: 'none',
                  height: '100%',
                  minHeight: '350px',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none'
                }}
              />
            ) : (
              <div 
                onClick={() => startEditingContent(activeTab, tabs.find(tab => tab.id === activeTab)?.content || '')}
                style={{ 
                  cursor: 'pointer', 
                  minHeight: '350px',
                  whiteSpace: 'pre-wrap'
                }}
                title="Click to edit content"
              >
                {tabs.find(tab => tab.id === activeTab)?.content}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Output</h6>
            {generatedOutput && (
              <button 
                className="btn btn-sm btn-primary"
                onClick={copyToClipboard}
              >
                Copy HTML
              </button>
            )}
          </div>
          <div className="border rounded p-3 bg-light" style={{ minHeight: '400px', maxHeight: '500px', overflowY: 'auto' }}>
            {generatedOutput ? (
              <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
                {generatedOutput}
              </pre>
            ) : (
              <p className="text-muted">Click "Output" button to generate HTML5 + JS with inline CSS...</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
