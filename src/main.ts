import "./styles/styles.css";
import { AppController } from "./app/AppController";
const app = new AppController(document.getElementById("app")!);
if (import.meta.hot) import.meta.hot.dispose(() => app.dispose());
