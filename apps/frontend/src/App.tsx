import { useState } from "react";
import { useSocket } from "./hooks/socket";

function App() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState<string>("");

  return (
    <>
      <div className="p-3">
        <div className="w-1/3 mt-3 mb-3">
          <input
            type="text"
            placeholder="type your message here"
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={() => sendMessage(message)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          send
        </button>
        <div>
          <h1>All message will appear here</h1>
        </div>
      </div>
    </>
  );
}

export default App;
