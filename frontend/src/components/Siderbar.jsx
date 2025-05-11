import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-[#f6f8f3] border-r border-[#e3e3db] min-h-screen p-4">
      <div className="text-lg font-semibold mb-6">Admin Panel</div>
      <ul className="space-y-3">
        <li>
          <button onClick={() => navigate("/AdminDashboard")} className="w-full text-left text-sm hover:text-[#e48f44]">
            Dashboard Home
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/UserList")} className="w-full text-left text-sm hover:text-[#e48f44] mt-3">
            Users
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/PropertyList")} className="w-full text-left text-sm hover:text-[#e48f44] mt-3">
            Properties
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
