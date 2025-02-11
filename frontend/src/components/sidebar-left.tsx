import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { CourseSwitcher } from './course-switcher'
import { ModuleSwitcher } from './module-switcher'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSectionsWithAuth } from '@/store/slices/fetchSections'
import { fetchSectionItemsWithAuth } from '@/store/slices/fetchItems'

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>('')
  const [selectedModuleId, setSelectedModuleId] = React.useState<string>('')
  const [selectedSectionId, setSelectedSectionId] = React.useState<string>('')

  const dispatch = useDispatch()
  const sections = useSelector(
    (state) => state.sections.sections[selectedModuleId] ?? null
  )
  const sectionItems = useSelector(
    (state) => state.items?.items[selectedSectionId] ?? null
  )

  React.useEffect(() => {
    if (selectedModuleId && !sections) {
      dispatch(
        fetchSectionsWithAuth({
          courseId: selectedCourseId,
          moduleId: selectedModuleId,
        })
      )
    }
  }, [selectedCourseId, selectedModuleId, dispatch])

  React.useEffect(() => {
    if (selectedSectionId && !sectionItems) {
      dispatch(fetchSectionItemsWithAuth(selectedSectionId))
    }
  }, [selectedSectionId, dispatch])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <CourseSwitcher
          onCourseSelect={(courseId) => {
            setSelectedCourseId(courseId)
          }}
        />
        {selectedCourseId && (
          <ModuleSwitcher
            selectedCourseId={selectedCourseId}
            onModuleSelect={(moduleId) => {
              setSelectedModuleId(moduleId)
            }}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sections?.map((section) => (
              <Collapsible
                key={section.id}
                defaultOpen={false}
                className='group/collapsible'
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => setSelectedSectionId(section.id)}
                    >
                      {section.title}
                      <Plus className='ml-auto group-data-[state=open]/collapsible:hidden' />
                      <Minus className='ml-auto group-data-[state=closed]/collapsible:hidden' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {sectionItems && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {sectionItems.map((item) => (
                          <SidebarMenuSubItem key={item.id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                            >
                              <a href={item.url}>{item.item_type}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
