/**
 * Section Detail Page
 *
 * This page displays the content items within a specific section of a course module.
 * It shows a list of content items like videos and assessments with their details
 * and allows students to access them.
 *
 * Features:
 * - Fetches and displays section content items using RTK Query
 * - Shows content type (video, assessment etc)
 * - Displays status of each content item (Pending, In Progress, Completed)
 * - Provides action buttons to start/continue content items
 * - Handles loading and error states
 * - Responsive layout with scrollable content list
 *
 * Key Components:
 * - StatusBadge: Displays colored status indicator
 * - AssignmentRow: Renders individual content item with details and actions
 * - Section: Main component managing data fetching and layout
 */

import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useFetchItemsWithAuthQuery } from '@/store/ApiServices/LmsEngine/DataFetchApiServices'
import { Button } from '@/components/ui/button'
import { Check, Lock } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProgress } from '@/store/slices/fetchStatusSlice'

// Tailwind classes for different status badges
const statusClasses = {
  Pending: 'bg-yellow-200 text-yellow-800',
  'In Progress': 'bg-blue-200 text-blue-800',
  Completed: 'bg-green-200 text-green-800',
}

/**
 * StatusBadge Component
 * Displays a colored badge indicating content item status
 */
interface StatusBadgeProps {
  status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[status] || ''}`}
  >
    {status}
  </span>
)

/**
 * AssignmentRow Component
 * Displays a single content item with its details and action button
 */
interface Assignment {
  id: string
  item_type: string
  title: string
  course: string
  sequence: number
}

interface AssignmentRowProps {
  assignment: Assignment
  sectionId: string
  courseId: string
  moduleId: string
}

const AssignmentRow: React.FC<AssignmentRowProps> = ({
  assignment,
  sectionId,
  courseId,
  moduleId,
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const alpha = assignment.item_type === 'video' ? 'v' : 'a'
  const sectionItemId1 = `${alpha}${assignment.id}`
  const progressKey = `${courseId}-${sectionItemId1}`
  console.log('progressKey:', progressKey)

  // Retrieve progress from Redux state
  const progress = useSelector((state) => state.progress[progressKey])
  console.log(
    'state mai ye store hai - ',
    useSelector((state) => state.progress[progressKey])
  )

  console.log('progress:', progress)
  console.log(
    'i am items............',
    useSelector((state) => state.items)
  )

  // Dispatch fetchProgress on component mount or when ids change
  useEffect(() => {
    console.log('this is progress', progress)

    if (!progress) {
      dispatch(
        fetchProgress({
          courseInstanceId: courseId,
          sectionItemId: sectionItemId1,
        })
      ).then(() => {
        if (!progress) {
          window.location.reload()
        }
      })
    }
  }, [dispatch, courseId, sectionItemId1, progress])

  // Determine what status to display
  const displayStatus = () => {
    if (!progress) return 'Loading...'
    return progress || 'Unknown'
  }

  return (
    <div className='grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4'>
      <div>
        <div className='text-xl font-semibold'>Content {assignment.title}</div>
        <div className='text-gray-600'>{assignment.course}</div>
      </div>
      <div className='flex items-center justify-between'>
        <span className='w-12 '>{assignment.item_type}</span>
        <span>
          <StatusBadge status={displayStatus()} />
        </span>
        <span className='flex w-14 justify-center'>
          {assignment.item_type === 'video' && progress === 'IN_PROGRESS' ? (
            <Button
              onClick={() =>
                navigate('/content-scroll-view', {
                  state: { assignment, sectionId, courseId, moduleId },
                })
              }
            >
              Start
            </Button>
          ) : progress === 'COMPLETE' ? (
            <Check />
          ) : (
            <Lock />
          )}
        </span>
      </div>
    </div>
  )
}

/**
 * Main Section Component
 * Manages fetching content items and rendering the complete section view
 */
const SectionDetails = () => {
  const { sectionId } = useParams()
  const location = useLocation()
  const courseId = location.state?.courseId // Access the sectionId from state
  const moduleId = location.state?.moduleId // Access the sectionId from state
  console.log('courseId:', courseId, moduleId)
  const {
    data: assignmentsData,
    isLoading,
    isError,
  } = useFetchItemsWithAuthQuery(sectionId)

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading assignments.</p>

  return (
    <div className='p-4'>
      <h1 className='mb-6 text-center text-3xl font-bold'>
        Content of Section {sectionId}
      </h1>
      <div className='mx-auto max-w-4xl'>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4 font-semibold text-gray-800'>
            <div>Title</div>
            <div className='flex justify-between'>
              <span>Type</span>
              <span>Status</span>
              <span className='mr-8'>Action</span>
            </div>
          </div>
          <div className='max-h-96 space-y-2 overflow-y-auto'>
            {assignmentsData?.map((assignment) => (
              <AssignmentRow
                key={assignment.sequence}
                assignment={assignment}
                sectionId={sectionId}
                courseId={courseId}
                moduleId={moduleId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionDetails
