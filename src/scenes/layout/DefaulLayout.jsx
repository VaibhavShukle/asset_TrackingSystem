import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";

export default function DefaulLayout({ children }) {
  return (
    <>
      <div className="app">
        <Sidebar />

        <main className="content">
          <Topbar />
          <div>{children}</div>
        </main>
      </div>
    </>
  );
}
