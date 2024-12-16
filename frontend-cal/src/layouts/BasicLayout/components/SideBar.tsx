import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <ul>
        <li>
          <a href="/" className="block py-2 px-4 hover:bg-gray-700">
            Home
          </a>
        </li>
        <li>
          <a href="/test-video" className="block py-2 px-4 hover:bg-gray-700">
            Test Video
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
