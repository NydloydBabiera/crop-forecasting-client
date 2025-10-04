import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Mainlayout from "./layouts/Mainlayout";
import Dashboard from "./pages/Dashboard";
import CropDataRecord from "./pages/CropDataRecord";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Mainlayout />}>
      <Route index path="/" element={<Dashboard />}></Route>
      <Route path="/cropRecord" element={<CropDataRecord />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
