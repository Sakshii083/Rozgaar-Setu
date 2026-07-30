import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Workers from "./pages/Workers";
import EmployerDashboard from "./pages/EmployerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import WorkerRegister from "./pages/WorkerRegister";

import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./pages/EditProfile";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/jobs",
    element: <Jobs />,
  },

  {
    path: "/workers",
    element: <Workers />,
  },

  {
    path: "/worker",
    element: (
      <ProtectedRoute>
        <WorkerDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/employer",
    element: (
      <ProtectedRoute>
        <EmployerDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/about",
    element: <About />,
  },

  {
    path: "/contact",
    element: <Contact />,
  },

  {
    path: "/worker-register",
    element: <WorkerRegister />,
  },
  {
  path: "/edit-profile",
  element: (
    <ProtectedRoute>
      <EditProfile />
    </ProtectedRoute>
  ),
},
{
  path: "/post-job",
  element: (
    <ProtectedRoute>
      <PostJob />
    </ProtectedRoute>
  ),
},
{
  path: "/applications",
  element: (
    <ProtectedRoute>
      <Applications />
    </ProtectedRoute>
  ),
},
]);

export default router;