// src/components/ZpendLite/ConfirmLogModal.jsx
export default function ConfirmLogModal({ dailyLogs, essentials, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">🔍 Confirm Today's Log</h3>
        <ul className="mb-4 space-y-1">
          {essentials.map((e, i) => (
            dailyLogs[i] ? (
              <li key={i}>
                • {e.category}: ₹{dailyLogs[i]}
              </li>
            ) : null
          ))}
        </ul>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 border rounded">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-green-600 text-white rounded">Confirm</button>
        </div>
      </div>
    </div>
  );
}
