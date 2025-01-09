import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./Pages/Home/Home";
import Featured from "./Pages/Featured/Featured";
import News from "./Pages/News/News";
import Footer from "./components/footer/Footer";
import Admin from "./Pages/Admin/Admin";
import PrivacyPolicy from "./Pages/Privacy/PrivacyPolicy";
import Terms from "./Pages/TermsOfUse/Terms";
import Contact from "./Pages/Contact/Contact";
import Article from "./Pages/Article/Article";
import CreateArticle from "./Pages/Article/CreateArticle";
import TechnologyAndAdvancement from "./Pages/Innovation/TechnologyAndAdvancement";
import ScienceAndResearch from "./Pages/Innovation/ScienceAndResearch";
import StartupsAndEntrepreneurship from "./Pages/Innovation/StartupsAndEntrepreneurship";
import Environment from "./Pages/Nature/Environment";
import Weather from "./Pages/Nature/Weather";
import Agriculture from "./Pages/Nature/Agriculture";
import Forest from "./Pages/Nature/Forest";
import SustainableLiving from "./Pages/Nature/SustainableLiving";
import EvolvingHorizons from "./Pages/Focus/EvolvingHorizons";
import Interviews from "./Pages/Focus/Interviews";
import Spotlight from "./Pages/Focus/Spotlight";
import PolicyAndGovernance from "./Pages/Focus/PolicyAndGovernance";

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
                <Route path="/weather" element={<Weather />} />
                <Route path="/agriculture" element={<Agriculture />} />
                <Route path="/forest" element={<Forest />} />
                <Route path="/news" element={<News />} />
                <Route path="/evolving-horizons" element={<EvolvingHorizons />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/spotlight" element={<Spotlight />} />
                <Route path="/policy-and-governance" element={<PolicyAndGovernance />} />
                <Route path="/sustainable-living" element={<SustainableLiving />}/>
                <Route path="/technology-and-advancement" element={<TechnologyAndAdvancement />}/>
                <Route path="/science-and-research" element={<ScienceAndResearch />}/>
                <Route path="/startups-and-entrepreneurship" element={<StartupsAndEntrepreneurship />}/>
                <Route path="/admin" element={<Admin />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/a" element={<Article />} />
                <Route path="/ca" element={<CreateArticle/>}/>
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
