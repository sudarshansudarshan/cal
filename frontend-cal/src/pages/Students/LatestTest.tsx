import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Signup from '@/components/Signup'
import { useFetchCoursesWithAuthQuery } from '../../store/apiService'

import { useFetchAssessmentWithAuthQuery } from '../../store/apiService'

const LatestTest = () => {
  const { data, error, isLoading } = useFetchCoursesWithAuthQuery()
  const {
    data: assessmentData,
    error: assessmentError,
    isLoading: assessmentLoading,
  } = useFetchAssessmentWithAuthQuery(1)
  console.log(assessmentData)

  if (isLoading || assessmentLoading) return <div>Loading...</div>
  if (error || assessmentError) return <div>Error loading data</div>

  return (
    <div>
      <Signup />
      <Login />
      <Logout />
      <h2>Courses</h2>
      <ul>
        {data?.results.map((course) => (
          <li key={course.course_id}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
      <h2>Assessment</h2>
      <div>
        <h3>{assessmentData?.id}</h3>
        <p>{assessmentData?.options}</p>
      </div>
    </div>
  )
}

export default LatestTest
