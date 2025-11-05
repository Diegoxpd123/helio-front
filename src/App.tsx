import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import DepartmentsView from './components/DepartmentsView';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={esES}>
      <DepartmentsView />
    </ConfigProvider>
  );
}

export default App;
