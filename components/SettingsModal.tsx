import React from 'react';
import { type Theme, type LayoutAlgorithm } from '../App';
import { SunIcon, MoonIcon, CloseIcon, ExportIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  layoutAlgorithm: LayoutAlgorithm;
  onLayoutAlgorithmChange: (algorithm: LayoutAlgorithm) => void;
}

const exportToSVG = () => {
  const svgElement = document.querySelector('#visualization-display svg');
  if (!svgElement) {
    alert('Could not find the graph to export.');
    return;
  }

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);
  
  // Add namespaces
  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if(!source.match(/^<svg[^>]+xmlns:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)){
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  // Add XML declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
  const link = document.createElement("a");
  link.href = url;
  link.download = "code-visualization.svg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  layoutAlgorithm,
  onLayoutAlgorithmChange,
}) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-[var(--panel-bg)] w-full max-w-md rounded-lg shadow-2xl border border-[var(--panel-border)] p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Theme Settings */}
        <div className="space-y-2">
          <label className="text-md font-semibold text-[var(--text-secondary)]">Theme</label>
          <div className="flex gap-2 rounded-md bg-[var(--background)] p-1">
            <button 
                onClick={() => onThemeChange('light')}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md transition-colors ${theme === 'light' ? 'bg-[var(--panel-bg)] text-[var(--text-primary)] shadow' : 'text-[var(--text-secondary)] hover:bg-[var(--panel-bg)]'}`}
            >
                <SunIcon className="w-5 h-5"/> Light
            </button>
             <button 
                onClick={() => onThemeChange('dark')}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-[var(--panel-bg)] text-[var(--text-primary)] shadow' : 'text-[var(--text-secondary)] hover:bg-[var(--panel-bg)]'}`}
            >
                <MoonIcon className="w-5 h-5"/> Dark
            </button>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="space-y-2">
          <label className="text-md font-semibold text-[var(--text-secondary)]">Graph Layout</label>
          <div className="flex gap-2 rounded-md bg-[var(--background)] p-1">
            <button 
                onClick={() => onLayoutAlgorithmChange('ai')}
                className={`w-full p-2 rounded-md transition-colors ${layoutAlgorithm === 'ai' ? 'bg-[var(--panel-bg)] text-[var(--text-primary)] shadow' : 'text-[var(--text-secondary)] hover:bg-[var(--panel-bg)]'}`}
            >
                AI Generated
            </button>
             <button 
                onClick={() => onLayoutAlgorithmChange('hierarchical')}
                className={`w-full p-2 rounded-md transition-colors ${layoutAlgorithm === 'hierarchical' ? 'bg-[var(--panel-bg)] text-[var(--text-primary)] shadow' : 'text-[var(--text-secondary)] hover:bg-[var(--panel-bg)]'}`}
            >
                Hierarchical
            </button>
          </div>
        </div>
        
        {/* Export */}
         <div className="space-y-2 pt-4 border-t border-[var(--panel-border)]">
            <button
              onClick={exportToSVG}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-white bg-sky-600 rounded-md 
                         hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/50 
                         transition-all duration-200"
            >
              <ExportIcon className="w-5 h-5" />
              Export Graph as SVG
            </button>
        </div>

      </div>
    </div>
  );
};
