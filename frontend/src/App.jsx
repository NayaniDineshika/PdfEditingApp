import logo from './logo.svg';
import './App.css';
import FileUpload from "./components/FileUpload";


function App() {
  return (
    <div style={{ padding: "40px",  margin: "auto" }}>
      <h1>PDF Editing App</h1>
      <FileUpload />
    </div>
  );
}

export default App;
