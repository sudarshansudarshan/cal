import { CourseProgressRepository } from "repositories/courseProgress.repository";

interface UpdatedEntities {
  course: string | null;
  modules: string[] | null;
  sections: string[] | null;
  sectionItems: string[] | null;
}

const courseProgressRepo = new CourseProgressRepository();

export class CourseProgressService {
  /**
   * Updates the progress of a section item for a student in a course instance.
   *
   * - Marks the current section item as COMPLETE.
   * - If `cascade` is true:
   *   - Retrieves the next section item and marks it as IN_PROGRESS if available.
   *   - If no next section item exists, marks the section as COMPLETE.
   *
   * @param courseInstanceId - Unique ID of the course instance.
   * @param studentId - Unique ID of the student.
   * @param sectionItemId - Unique ID of the section item being updated.
   * @param cascade - Whether to cascade progress updates to subsequent entities (default: true).
   * @returns A promise containing the updated entities.
   * @throws Error if the progress update fails.
   */
  async updateSectionItemProgress(
    courseInstanceId: string,
    studentId: string,
    sectionItemId: string,
    cascade: boolean = true
  ): Promise<UpdatedEntities> {
    try {
      // Mark the current section item as COMPLETE
      await courseProgressRepo.updateSectionItemProgress(
        courseInstanceId,
        studentId,
        sectionItemId
      );

      if (cascade) {
        const { nextSectionItemId, sectionId } =
          await courseProgressRepo.getSectionItemDetails(
            courseInstanceId,
            studentId,
            sectionItemId
          );

        if (nextSectionItemId) {
          // Mark the next section item as IN_PROGRESS
          await courseProgressRepo.updateSectionItemProgress(
            courseInstanceId,
            studentId,
            nextSectionItemId
          );
          return {
            course: null,
            modules: null,
            sections: null,
            sectionItems: [sectionItemId, nextSectionItemId],
          };
        } else {
          // If no more section items, mark the section as COMPLETE
          const updatedEntities = await this.updateSectionProgress(
            courseInstanceId,
            studentId,
            sectionId
          );
          return {
            ...updatedEntities,
            sectionItems: [sectionItemId],
          };
        }
      }

      return {
        course: null,
        modules: null,
        sections: null,
        sectionItems: [sectionItemId],
      };
    } catch (error) {
      console.error(
        `Error updating section item progress for section item ${sectionItemId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Updates the progress of a section for a student in a course instance.
   *
   * - Marks the current section as COMPLETE.
   * - If `cascade` is true:
   *   - Retrieves the next section and marks it as IN_PROGRESS if available.
   *   - If no next section exists, marks the module as COMPLETE.
   *
   * @param courseInstanceId - Unique ID of the course instance.
   * @param studentId - Unique ID of the student.
   * @param sectionId - Unique ID of the section being updated.
   * @param cascade - Whether to cascade progress updates to subsequent entities (default: true).
   * @returns A promise containing the updated entities.
   * @throws Error if the progress update fails.
   */
  async updateSectionProgress(
    courseInstanceId: string,
    studentId: string,
    sectionId: string,
    cascade: boolean = true
  ): Promise<UpdatedEntities> {
    try {
      // Mark the current section as COMPLETE
      await courseProgressRepo.updateSectionProgress(
        courseInstanceId,
        studentId,
        sectionId
      );

      const { nextSectionId, moduleId } =
        await courseProgressRepo.getSectionDetails(
          courseInstanceId,
          studentId,
          sectionId
        );

      if (cascade) {
        if (nextSectionId) {
          // Mark the next section as IN_PROGRESS
          await courseProgressRepo.updateSectionProgress(
            courseInstanceId,
            studentId,
            nextSectionId
          );
          return {
            course: null,
            modules: null,
            sections: [sectionId, nextSectionId],
            sectionItems: null,
          };
        } else {
          // If no more sections, mark the module as COMPLETE
          const updatedEntities = await this.updateModuleProgress(
            courseInstanceId,
            studentId,
            moduleId
          );
          return {
            ...updatedEntities,
            sections: [sectionId],
          };
        }
      }

      return {
        course: null,
        modules: null,
        sections: [sectionId],
        sectionItems: null,
      };
    } catch (error) {
      console.error(
        `Error updating section progress for section ${sectionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Updates the progress of a module for a student in a course instance.
   *
   * - Marks the current module as COMPLETE.
   * - If `cascade` is true:
   *   - Retrieves the next module and marks it as IN_PROGRESS if available.
   *   - If no next module exists, marks the course as COMPLETE.
   *
   * @param courseInstanceId - Unique ID of the course instance.
   * @param studentId - Unique ID of the student.
   * @param moduleId - Unique ID of the module being updated.
   * @param cascade - Whether to cascade progress updates to subsequent entities (default: true).
   * @returns A promise containing the updated entities.
   * @throws Error if the progress update fails.
   */

  async updateModuleProgress(
    courseInstanceId: string,
    studentId: string,
    moduleId: string,
    cascade: boolean = true
  ): Promise<UpdatedEntities> {
    try {
      // Mark the current module as COMPLETE
      await courseProgressRepo.updateModuleProgress(
        courseInstanceId,
        studentId,
        moduleId
      );

      const { nextModuleId } = await courseProgressRepo.getModuleDetails(
        courseInstanceId,
        studentId,
        moduleId
      );

      if (cascade) {
        if (nextModuleId) {
          // Mark the next module as IN_PROGRESS
          await courseProgressRepo.updateModuleProgress(
            courseInstanceId,
            studentId,
            nextModuleId
          );
          return {
            course: null,
            modules: [moduleId, nextModuleId],
            sections: null,
            sectionItems: null,
          };
        } else {
          // If no more modules, mark the course as COMPLETE
          const updatedEntities = await this.updateCourseProgress(
            courseInstanceId,
            studentId
          );
          return {
            ...updatedEntities,
            modules: [moduleId],
          };
        }
      }

      return {
        course: null,
        modules: [moduleId],
        sections: null,
        sectionItems: null,
      };
    } catch (error) {
      console.error(
        `Error updating module progress for module ${moduleId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Updates the progress of a course for a student.
   *
   * - Marks the course as COMPLETE.
   * - No cascading as this is the final entity in the hierarchy.
   *
   * @param courseInstanceId - Unique ID of the course instance.
   * @param studentId - Unique ID of the student.
   * @returns A promise containing the updated course entity.
   * @throws Error if the progress update fails.
   */

  async updateCourseProgress(
    courseInstanceId: string,
    studentId: string
  ): Promise<UpdatedEntities> {
    try {
      // Mark the course as COMPLETE
      await courseProgressRepo.updateCourseProgress(
        courseInstanceId,
        studentId
      );
      return {
        course: courseInstanceId,
        modules: null,
        sections: null,
        sectionItems: null,
      };
    } catch (error) {
      console.error(
        `Error updating course progress for course ${courseInstanceId}:`,
        error
      );
      throw error;
    }
  }


  
}
