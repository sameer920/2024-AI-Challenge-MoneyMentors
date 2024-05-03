import { Route, Routes } from 'react-router-dom';
import './App.css';
// import Header from './pages/components/Header';
import Login from './pages/LoginPage/Login';
import UploadText from './pages/UploadTextPage/UploadText';
import UploadFile from './pages/UploadFilePage/UploadFile';
import WebsiteSource from './pages/WebsiteSourcePage/WebsiteSource'
import IntegrationPage from './pages/IntegrationPage/IntegrationPage'
import Dashboard from './pages/DashboardPage/Dashboard'
import Chatbot from './pages/ChatbotPage/Chatbot'
import Settings from './pages/SettingsPage/Settings'
import BackendNav from './pages/sharedComponents/BackendNav';
import MyChatbots from './pages/MyChatbotsPage/MyChatbots';
import NewChatbotNav from './pages/NewChatbot/components/NewChatbotNav';
import AgencySignin from './pages/AgencySignin/AgencySignin'
import QuestionAnswer from './pages/QuestionAnswerPage/QuestionAnswer';
import MyAccountPage from './pages/MyAccountPage/MyAccountPage';
import AgencyDashboard from './pages/AgencyDashboard/AgencyDashboard';
import AgencyPageUser from './pages/AgencyPageUser/AgencyPageUser';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/backend' element={<BackendNav />}>
          <Route path='sources/text/:id' element={<UploadText />} />
          <Route path='sources/files/:id' element={<UploadFile />} />
          <Route path='sources/website/:id' element={<WebsiteSource />} />
          <Route path='sources/questionAnswers/:id' element={<QuestionAnswer />} />
          <Route path='integrations/:id' element={<IntegrationPage />} />
          <Route path='Dashboard/:id' element={<Dashboard />} />
          <Route path='Chatbot/:id' element={<Chatbot />} />
          <Route path='Settings/:id' element={<Settings />} />
          <Route path='test' element={<AgencyPageUser />} />
        </Route>

        <Route path='Access-Control' element={<AgencyPageUser />} />
        <Route path='new/sources' element={<NewChatbotNav />}>
          <Route path='text/:id' element={<UploadText />} />
          <Route path='files/:id' element={<UploadFile />} />
          <Route path='website/:id' element={<WebsiteSource />} />
          <Route path='questionAnswers/:id' element={<QuestionAnswer />} />
        </Route>

        <Route path='user'>
          <Route path='Login' element={<AgencySignin />} />
          <Route path='Dashboard' element={<AgencyDashboard />} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/' element={<MyChatbots />} />
        <Route path='/dashboard' element={<MyChatbots />} />
        <Route path='myaccount' element={<MyAccountPage />} />
        

      </Routes>
    </div>
  );
}

export default App;
