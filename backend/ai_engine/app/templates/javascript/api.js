import { config } from "./config.js";

async function fetchCourses() {
  try {
    const response = await fetch(`${config.LMS_GET_URL}courses`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: config.Authorization },
    });

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

async function fetchModules(courseId) {
  try {
    const response = await fetch(`${config.LMS_GET_URL}modules?course_id=${courseId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: config.Authorization },
    });

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

async function fetchSections(moduleId) {
  try {
    const response = await fetch(`${config.LMS_GET_URL}sections?module_id=${moduleId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: config.Authorization },
    });

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

export { fetchCourses, fetchModules, fetchSections };
