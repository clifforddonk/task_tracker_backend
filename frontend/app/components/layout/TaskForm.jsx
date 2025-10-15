import {
  FileText,
  List,
  User,
  AlertTriangle,
  Calendar,
  Save,
} from "lucide-react";
import Link from "next/link";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";

const TaskForm = ({
  taskData,
  users,
  handleChange,
  handleSubmit,
  submitting,
  isEditing = false,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Task Title"
        icon={FileText}
        name="title"
        value={taskData.title}
        onChange={handleChange}
        required
        placeholder="Enter task title"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <List className="inline h-4 w-4 mr-1" />
          Description *
        </label>
        <textarea
          name="description"
          value={taskData.description}
          onChange={handleChange}
          required
          rows="4"
          placeholder="Enter task description"
          className="w-full px-4 py-3 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <FormSelect
        label="Assign To"
        icon={User}
        name="assigned_user"
        value={taskData.assigned_user}
        onChange={handleChange}
        required
        options={[
          { value: "", label: "Select a user" },
          ...users.map((u) => ({
            value: u.id,
            label: `${u.username} (${u.email})`,
          })),
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Priority"
          icon={AlertTriangle}
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />

        <FormSelect
          label="Status"
          icon={List}
          name="status"
          value={taskData.status}
          onChange={handleChange}
          options={[
            { value: "pending", label: "Pending" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
          ]}
        />
      </div>

      <FormInput
        label="Deadline"
        icon={Calendar}
        type="date"
        name="deadline"
        value={taskData.deadline}
        onChange={handleChange}
        required
        min={new Date().toISOString().split("T")[0]}
      />

      <div className="flex items-center justify-end space-x-4 pt-6">
        <Link href="/dashboard">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5" />
          <span>{submitting ? "Updating..." : "Update Task"}</span>
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
