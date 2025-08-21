import { useState } from "react";
import { useFocusData } from "../../context/FocusDataContext";

export default function ProjectSelector() {
  const {
    currentProject,
    setCurrentProject,
    projects,
    addProject,
  } = useFocusData();

  const [newProjectName, setNewProjectName] = useState("");

  const handleAddProject = () => {
    const trimmed = newProjectName.trim();
    if (!trimmed || projects.includes(trimmed)) return;
    addProject(trimmed); // Adds to context state
    setNewProjectName("");
  };

  return (
    <div className="flex flex-col gap-3 items-center w-full max-w-md mt-4">
      {/* Dropdown */}
      <label htmlFor="projectDropdown" className="sr-only">
        Select a project
      </label>
      <select
        id="projectDropdown"
        value={currentProject}
        onChange={(e) => setCurrentProject(e.target.value)}
        className="p-3 rounded-xl bg-white text-dark shadow-lg text-base w-full border border-dark/20"
        name="project"
      >
        <option value="">📝 Select a project</option>
        {projects.map((proj, i) => (
          <option key={i} value={proj}>
            {proj}
          </option>
        ))}
      </select>

      {/* Input + Add button */}
      <div className="flex gap-2 w-full">
        <input
          type="text"
          name="new-project"
          id="new-project"
          placeholder="💡 New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="p-3 flex-1 rounded-xl bg-white text-dark shadow border border-dark/10"
          autoComplete="off"
        />
        <button
          onClick={handleAddProject}
          className="bg-accent text-dark font-bold px-5 py-2 rounded-xl shadow hover:scale-105 transition-all"
        >
          ➕ Add
        </button>
      </div>
    </div>
  );
}
