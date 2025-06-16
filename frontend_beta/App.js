import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <AppNavigator />
      </ContentProvider>
    </AuthProvider>
  );
}
