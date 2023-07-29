import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Message from "./components/Message/Message";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/message" element={<Message />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
