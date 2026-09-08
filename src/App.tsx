import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import AppShell, { type Role, type Module } from "./components/shared/AppShell";
import Dashboard from "./components/Dashboard";
import EnrolmentModule from "./components/EnrolmentModule";
import AdjudicationModule from "./components/AdjudicationModule";
import PersoModule from "./components/PersoModule";
import QAModule from "./components/QAModule";
import RePersoModule from "./components/RePersoModule";

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [currentModule, setCurrentModule] = useState<Module>("dashboard");

  const handleLogin = (r: Role) => {
    setRole(r);
    setCurrentModule("dashboard");
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentModule("dashboard");
  };

  if (!role) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderModule = () => {
    switch (currentModule) {
      case "enrolment":
        return <EnrolmentModule />;
      case "adjudication":
        return <AdjudicationModule />;
      case "perso":
        return <PersoModule />;
      case "qa":
        return <QAModule />;
      case "reperso":
        return <RePersoModule />;
      default:
        return <Dashboard role={role} />;
    }
  };

  return (
    <AppShell
      role={role}
      currentModule={currentModule}
      onModuleChange={setCurrentModule}
      onLogout={handleLogout}
    >
      {renderModule()}
    </AppShell>
  );
}
