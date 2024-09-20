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
// const SlateEditor = lazy(() => import("./Components/Preview"))
import Preview from "./Components/Preview";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="preview" element={<Preview />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
