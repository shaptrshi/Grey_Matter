import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./Pages/Home/Home";
import Featured from "./Pages/Featured/Featured";
import Environment from "./Pages/Environment/Environment";
import News from "./Pages/News/News";
import Science from "./Pages/Science/Science";
import Technology from "./Pages/Technology/Technology";
import Footer from "./components/footer/Footer";
import Admin from "./Pages/Admin/Admin";
import PrivacyPolicy from "./Pages/Privacy/PrivacyPolicy";
import Terms from "./Pages/TermsOfUse/Terms";
import Contact from "./Pages/Contact/Contact";
import Article from "./Pages/Article/Article";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/featured" element={<Featured />} />
                <Route path="/environment" element={<Environment />} />
                <Route path="/news" element={<News />} />
                <Route path="/science" element={<Science />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/a" element={<Article />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
