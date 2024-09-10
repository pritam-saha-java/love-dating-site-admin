import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "./components/ScrollToTop";
const Blogs = lazy(() => import("./Components/Blogs"));
const LogIn = lazy(() => import("./components/LogIn"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
