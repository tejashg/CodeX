import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import leftArrowImage from './left.png';
import rightArrowImage from './right.png';
import ACTIONS from '../Actions';
import './Editor.css';

// Import all themes dynamically
const themesContext = require.context('codemirror/theme', false, /\.css$/);
themesContext.keys().forEach(themesContext);

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const themes = themesContext.keys().map((theme) => theme.replace('./', '').replace('.css', ''));
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  const switchTheme = (nextIndex) => {
    setCurrentThemeIndex(nextIndex);
    const nextTheme = themes[nextIndex];
    import(`codemirror/theme/${nextTheme}.css`).then(() => {
      editorRef.current.setOption('theme', nextTheme);
    });
  };

  const switchThemeForward = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length;
    switchTheme(nextIndex);
  };

  const switchThemeBackward = () => {
    const nextIndex = (currentThemeIndex - 1 + themes.length) % themes.length;
    switchTheme(nextIndex);
  };

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
        mode: { name: 'javascript', json: true },
        theme: themes[currentThemeIndex],
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }

    init();
  }, [currentThemeIndex]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <>
    <div className='themeContainer'>
    <button className="switchThemeButton" onClick={switchThemeBackward}><img src={leftArrowImage} /></button>
      <button className="switchThemeButton" onClick={switchThemeForward}><img src={rightArrowImage} /></button>
    </div>
      <textarea id='realtimeEditor'></textarea>
    </>
  );
};

export default Editor;

