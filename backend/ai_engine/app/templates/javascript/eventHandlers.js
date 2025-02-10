import { fetchCourses, fetchModules, fetchSections } from "./api.js";

async function populateCourseDropdown() {
  const courses = await fetchCourses();
  const courseSelect = document.getElementById("course-select");
  courseSelect.innerHTML = '<option value="">Select Course</option>';

  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.course_id;
    option.textContent = course.name || "Unnamed Course";
    courseSelect.appendChild(option);
  });

  // Ensure dropdown starts as disabled
  document.getElementById("module-select").disabled = true;
  document.getElementById("section-select").disabled = true;
}

// Handle course selection and enable module dropdown
  async function populateModuleDropdown(e) {
  const courseId = e.target.value;
  const moduleSelect = document.getElementById("module-select");
  moduleSelect.innerHTML = '<option value="">Select Module</option>';
  moduleSelect.disabled = true; // Disable until data is fetched

  if (courseId) {
    const modules = await fetchModules(courseId);
    if (modules.length > 0) {
      modules.forEach((module) => {
        const option = document.createElement("option");
        option.value = module.module_id;
        option.textContent = module.title || "Unnamed Module";
        moduleSelect.appendChild(option);
      });
      moduleSelect.disabled = false; // Enable module dropdown
    }
  }

  // Reset section dropdown
  document.getElementById("section-select").innerHTML = '<option value="">Select Section</option>';
  document.getElementById("section-select").disabled = true;
};

// Handle module selection and enable section dropdown
  async function populateSectionDropdown (e) {
  const moduleId = e.target.value;
  const sectionSelect = document.getElementById("section-select");
  sectionSelect.innerHTML = '<option value="">Select Section</option>';
  sectionSelect.disabled = true; // Disable until data is fetched

  if (moduleId) {
    const sections = await fetchSections(moduleId);
    if (sections.length > 0) {
      sections.forEach((section) => {
        const option = document.createElement("option");
        option.value = section.id;
        option.textContent = section.title || "Unnamed Section";
        sectionSelect.appendChild(option);
      });

      sectionSelect.disabled = false; // Enable section dropdown
    }
  }
};

export { populateCourseDropdown, populateModuleDropdown, populateSectionDropdown };
