import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'antd/dist/reset.css';
import App from './App.tsx'
import { ConfigProvider, App as AntdApp } from 'antd';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <ConfigProvider theme={{cssVar: true
   }}
   >
    <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
