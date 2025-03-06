import Homepage from "./components/Layout/Homepage/Homepage";
import './App.css'
const App = () => {
  return (
    <div className="d-flex vh-100">
      <div className="flex-grow-1 w-100">
        <Homepage />
      </div>
    </div>
  );
};

export default App;
