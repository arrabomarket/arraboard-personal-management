import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Finance from "./pages/Finance";
import Projects from "./pages/Projects";
import Contacts from "./pages/Contacts";
import Links from "./pages/Links";
import Calendar from "./pages/Calendar";

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/links" element={<Links />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;