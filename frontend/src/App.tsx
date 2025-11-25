import { BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "@/pages/Register";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<div style={{padding:24, textAlign:'center'}}>Login Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
