import { CheckCircle, X } from "lucide-react";

const TaskFormLayout = ({ children, success, error, title }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center mb-6">
            <CheckCircle className="h-5 w-5 mr-2" />
            <p>Task updated successfully! Redirecting...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center mb-6">
            <X className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default TaskFormLayout;
