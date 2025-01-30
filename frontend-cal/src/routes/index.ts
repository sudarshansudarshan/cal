import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import LoginPage from '../pages/LoginPage'
import StudentDashboard from '@/pages/Students/StudentDashboard'
import AllCourses from '@/pages/Students/CourseView'
// import Assignments from '@//Students/Assignments'
// import Testing from '@/pages/Students/Testing'
import SingleCourse from '@/pages/Students/ModuleView'
// import VideoAssessment from '@/pages/Students/VideoAssessment'
// import LatestTest from '@/pages/Students/LatestTest'
// import VideoPlaylistAssessment from '@/pages/Students/VideoPlaylistAssessment'
import VideoMain from '@/pages/Students/ContentScrollView'
import Section from '@/pages/Students/SectionDetail'
import AllSections from '@/pages/Students/SectionView'
import SectionDetails from '@/pages/Students/SectionDetail'
import ContentScrollView from '@/pages/Students/ContentScrollView'
import CourseView from '@/pages/Students/CourseView'
import ModuleView from '@/pages/Students/ModuleView'
import SectionView from '@/pages/Students/SectionView'

const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(App),
    children: [
      {
        path: '',
        element: React.createElement(Home),
        children: [
          {
            path: '/student-dashboard',
            element: React.createElement(StudentDashboard),
          },
          
          {
            path: '/course-view',
            element: React.createElement(CourseView),
          },
          
          {
            path: '/module-view/:courseId',
            element: React.createElement(ModuleView),
          },
          
          {
            path: '/content-scroll-view',
            element: React.createElement(ContentScrollView),
          },
          {
            path: '/section-details/:sectionId',
            element: React.createElement(SectionDetails),
          },
          {
            path: '/section-view/:courseId/:moduleId',
            element: React.createElement(SectionView),
          },
        ],
      },
      {
        path: '/login',
        element: React.createElement(LoginPage),
      },
      
    ],
  },
])

export default router
