import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'antd/dist/reset.css';
import App from './App.tsx'
import { ConfigProvider, App as AntdApp } from 'antd';
import { RecoilRoot } from 'recoil';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <ConfigProvider theme={{cssVar: true
   }}
   >
    <AntdApp>
      <RecoilRoot > <App /></RecoilRoot>
       
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
