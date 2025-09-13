import LeadGenerator from "./component/leadGenerator";
import Login from "./component/Login";
import Admin from "./component/Admin";
import Agent from "./component/Agent";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Login />;
  if (role === "generator") return <LeadGenerator />;
  if (role === "assigner") return <Admin />;
  if (role === "agent") return <Agent />;
  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
