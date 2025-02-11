import { config } from "./config.js";
import state from "./state.js";

async function fetchCourses() {
  try {
    const response = await fetch(`${config.LMS_GET_URL}api/v1/course/courses/`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: config.Authorization },
    });

    const data = await response.json();
    state.hierarchyData[0] = data.results;
    console.log("State's hierrarchyData course is set: ", data.results);
    return data.results || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

async function fetchModules(courseId) {
  try {
    const response = await fetch(`${config.LMS_GET_URL}api/v1/course/modules/?course_id=${courseId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: config.Authorization },
    });

    const data = await response.json();
    state.hierarchyData[1] = data.results;
    console.log("State's hierrarchyData modules is set: ", data.results);
    return data.results || [];
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

async function fetchSections(moduleId) {
  try {
    const response = await fetch(`${config.LMS_GET_URL}api/v1/course/sections/?module_id=${moduleId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: config.Authorization },
    });

    const data = await response.json();
    state.hierarchyData[2] = data.results;
    console.log("State's hierrarchyData sections is set: ", data.results);
    return data.results || [];
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

export { fetchCourses, fetchModules, fetchSections };
