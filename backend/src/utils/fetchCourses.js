import axios from "axios";

const institutions = [
  "University of Michigan",
  "University of London",
  "Stanford University",
  "Meta",
  "University of Illinois"
];

export const fetchCoursesFromAPI = async (skill) => {
  try {
    let allCourses = [];

    for (const inst of institutions) {
      const response = await axios.get(
        "https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/get_course.php",
        {
          params: {
            page_no: "1",
            course_institution: inst
          },
          headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": "collection-for-coursera-courses.p.rapidapi.com"
          }
        }
      );

      const reviews = response.data?.reviews || [];
      allCourses.push(...reviews);
    }

    // 🔍 Filter by skill in course name
    const filtered = allCourses.filter(course =>
      course.course_name?.toLowerCase().includes(skill.toLowerCase())
    );

    // 🎯 Map and return top 5
    return filtered.slice(0, 5).map(course => ({
      title: course.course_name,
      platform: course.course_institution,
      link: course.course_url,
      duration: "Varies",
      skillCovered: skill
    }));

  } catch (error) {
    console.warn(`❌ Multi-institution course fetch failed for '${skill}':`, error.message);
    return null;
  }
};
