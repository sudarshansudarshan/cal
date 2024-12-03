import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const StudentHome = () => {
    const courses = [
        {
            id: 1,
            name: "Introduction to AI",
            duration: "6 weeks",
            photo: "https://via.placeholder.com/300x200?text=Introduction+to+AI",
        },
        {
            id: 2,
            name: "Data Science Basics",
            duration: "8 weeks",
            photo: "https://via.placeholder.com/300x200?text=Data+Science+Basics",
        },
        {
            id: 3,
            name: "Web Development",
            duration: "10 weeks",
            photo: "https://via.placeholder.com/300x200?text=Web+Development",
        },
        {
            id: 4,
            name: "Machine Learning",
            duration: "12 weeks",
            photo: "https://via.placeholder.com/300x200?text=Machine+Learning",
        },
        {
            id: 5,
            name: "Deep Learning",
            duration: "14 weeks",
            photo: "https://via.placeholder.com/300x200?text=Deep+Learning",
        },
    ];

    const additionalCourses = [
        {
            courseId: 101,
            courseName: "Introduction to Python",
            coursePhoto: "https://via.placeholder.com/300x400?text=Introduction+to+Python",
            progression: "50%",
        },
        {
            courseId: 102,
            courseName: "Advanced JavaScript",
            coursePhoto: "https://via.placeholder.com/300x400?text=Advanced+JavaScript",
            progression: "75%",
        },
        {
            courseId: 103,
            courseName: "Data Science Basics",
            coursePhoto: "https://via.placeholder.com/300x400?text=Data+Science+Basics",
            progression: "30%",
        },
        {
            courseId: 104,
            courseName: "React for Beginners",
            coursePhoto: "https://via.placeholder.com/300x400?text=React+for+Beginners",
            progression: "90%",
        },
        {
            courseId: 105,
            courseName: "Machine Learning Fundamentals",
            coursePhoto: "https://via.placeholder.com/300x400?text=Machine+Learning+Fundamentals",
            progression: "20%",
        },
    ];

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="max-w-md rounded-lg border md:min-w-full"
        >
            
            
            <ResizablePanel defaultSize={50}>
                <div className="h-1/6 flex justify-between items-center px-6">
                    <h1 className="text-2xl uppercase font-semibold">
                        All Courses
                    </h1>
                    <button>View All</button>
                </div>
                <div className="relative flex h-5/6 items-center justify-center px-4">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        orientation="vertical"
                        className="w-full h-full overflow-auto no-scrollbar"
                    >
                        <CarouselContent className="">
                            {courses.map((course) => (
                                <CarouselItem key={course.id} className="md:basis-1/2">
                                    <div className="mt-1">
                                        <Card>
                                            <CardContent className="flex items-center justify-between p-2">
                                                <img
                                                    src={course.photo}
                                                    alt={course.name}
                                                    className="h-12 w-12 object-cover rounded-md mb-4"
                                                />
                                                <span className="text-xl font-semibold">{course.name}</span>
                                                <span className="text-sm text-gray-600">{course.duration}</span>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <div className="h-1/6 flex justify-between items-center px-6">
                    <h1 className="text-2xl uppercase font-semibold">
                    On Going Courses
                    </h1>
                    <button>View All</button>
                </div>
                <div className="relative flex h-5/6 items-center justify-center px-4">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        orientation="vertical"
                        className="w-full h-full overflow-auto no-scrollbar"
                    >
                        <CarouselContent className="">
                            {additionalCourses.map((addtionalcourse) => (
                                <CarouselItem key={addtionalcourse.courseId} className="md:basis-1/2">
                                    <div className="mt-1">
                                        <Card>
                                            <CardContent className="flex items-center justify-between p-2">
                                                <div className="w-2/3 flex flex-col">
                                                <span className="text-lg font-semibold">{addtionalcourse.courseName}</span>
                                                <span className="text-sm font-semibold">Chapter 1</span>
                                                </div>
                                                <div className="w-1/3 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                    <div
                                                        className="bg-blue-600 h-2.5 rounded-full"
                                                        style={{ width: addtionalcourse.progression }}
                                                    ></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default StudentHome;