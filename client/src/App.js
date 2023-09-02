import './App.css';
import { Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Home from './pages/home';
import VideoCall from './components/videoCall';
import VideoChatReceiver from './components/videoCall/VideoCallReceiver';
import ResetPassword from './pages/auth/resetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/videoChat" element={<VideoCall />} />
        <Route path="/videoChatReceiver" element={<VideoChatReceiver />} />
      </Routes>
      <ToastContainer theme="dark" position="bottom-right" closeOnClick />
    </div>
  );
}

export default App;
