export interface ScheduleEvent {
    "Type": string;
    "Weekday": string;
    "Start Time": string;
    "End Time": string;
    "Location": string;
}

export interface Course {
    "CourseCode": string;
    "CourseTitle": string;
    "Quarter/Semester": string;
    "Year": string;
    "InstructorName": string;
    "InstructorEmail": string;
    "InstructorOffice": string;
    "Schedule": Array<{
        "Type": string;
        "Weekday": string;
        "Start Time": string;
        "End Time": string;
        "Location": string;
    }>;
    "CourseSchedule": Array<ScheduleEvent>;
    "ImportantDates": Array<{
        "Date": string;
        "EventName": string;
        "Weekday": string;
    }>;
    "GradingInformation": Array<{
        "Category": string;
        "Value": string;
    }>;
}

export interface WorkdayCourseFormat {
    "Course Section": string;
    "Course Subject": string;
    "Course Number": string;
    "Section Number": string;
    "Section Status": string;
    "Enrolled/Capacity": string;
    "All Instructors": string;
    "Units": string;
    "Meeting Patterns": string;
    "Locations": string;
    "Course Tags": string;
    "Instructional Format": string;
    "Delivery Mode": string;
    "Start Date": string;
    "End Date": string;
    "Academic Period": string;
    "Overlapping Course(s)\r": "\r";
}

export interface CourseAvailCourseFormat {
    "dbType": string;
    "courseId": string;
    "sectionUID": string;
    "sectionId": string;
    "seatsRemaining": string | null;
    "subject": string;
    "subjectDescr": string;
    "termID": string;
    "sortcode": string;
    "termStart": string;
    "termName": string;
    "catalogNbr": string;
    "classTitle": string;
    "classNbr": string;
    "meetDays1": string;
    "meetStartTm1": string;
    "meetEndTm1": string;
    "meetLoc1": string;
    "meetDays2": string | null;
    "meetStartTm2": string | null;
    "meetEndTm2": string | null;
    "meetLoc2": string | null;
    "facid": string;
    "firstName": string;
    "lastName": string;
    "email": string;
    "startDate": string;
    "endDate": string;
    "exams": string;
    "panoptoFolderStr": string;
    "sectionStatus": string;
    "academicLevel": string;
    "minimumUnits": string;
    "maximumUnits": string;
    "description": string;
    "publicNotes": string;
    "courseDescr": string;
    "facids": Array<{
        "facid": string;
        "lastName": string;
        "firstName": string;
    }>;
    "strm_abbr": string;
    "instr_1_sh": string;
    "instr_1": string;
    "instr_2_sh": string;
    "instr_2": string;
    "time1_fr": string;
    "c_hrstart": string;
    "c_mnstart": string;
    "c_duration": number;
    "c_hrstart2": string;
    "c_mnstart2": string;
    "c_duration2": string;
    "time2_fr": string;
    "seats_text": string;
    "has_seats": number;
}