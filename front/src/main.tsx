import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./assets/styles/index.scss"
import { AppProvider } from "./context/AppContext.tsx"

createRoot(document.getElementById("root")!).render(
	<AppProvider>
		<App />
	</AppProvider>
)
