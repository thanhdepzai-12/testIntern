import Homepage from "./components/Layout/Homepage/Homepage";
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import './App.css'
const App = () => {
  return (
    <div className="d-flex vh-100">
      <button
        className="btn btn-primary d-md-none position-fixed top-0 start-0 m-3"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
      >
        ☰
      </button>
      <div
        id="sidebarMenu"
        className="offcanvas-md offcanvas-start border-end p-3 d-flex flex-column"
        tabIndex="-1"
        style={{ width: "25%" }}
      >
        <div className="offcanvas-header d-md-none">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <Sidebar />
        </div>
      </div>
      <div className="flex-grow-1" style={{ width: "75%" }}>
        <Homepage />
      </div>
    </div>
  );
};

export default App;
