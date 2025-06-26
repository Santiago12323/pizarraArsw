import { Route, Routes } from "react-router-dom";
import PizarraPage from "./pages/PizarraPage";

function App() {
  return (
    <Routes>
      <Route element={<PizarraPage/>} path="/" />
    </Routes>
  );
}

export default App;
