import { React } from 'react';

function Header() {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between h-16">
          <div className="flex flex-shrink-0 items-center">
            <img
              className="h-12 w-auto"
              src="https://img.icons8.com/ios/344/lol--v1.png"
              alt="NoName"
            />
            <div className="ml-3 text-2xl font-semibold text-gray-900">NoName</div>
          </div>
          <div className="flex">
            <button className="text-sm font-medium text-sky-600 hover:text-sky-700">Docs</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
