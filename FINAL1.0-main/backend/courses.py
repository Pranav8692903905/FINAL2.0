ds_course = [
    {'name': 'Machine Learning Crash Course by Google', 'link': 'https://developers.google.com/machine-learning/crash-course'},
    {'name': 'Machine Learning A-Z by Udemy', 'link': 'https://www.udemy.com/course/machinelearning/'},
    {'name': 'Machine Learning by Andrew NG', 'link': 'https://www.coursera.org/learn/machine-learning'},
    {'name': 'Data Scientist Master Program (IBM)', 'link': 'https://www.simplilearn.com/big-data-and-analytics/senior-data-scientist-masters-program-training'},
    {'name': 'Data Science Foundations by LinkedIn', 'link': 'https://www.linkedin.com/learning/data-science-foundations-fundamentals-5'},
    {'name': 'Data Scientist with Python', 'link': 'https://www.datacamp.com/tracks/data-scientist-with-python'},
    {'name': 'Programming for Data Science with Python', 'link': 'https://www.udacity.com/course/programming-for-data-science-nanodegree--nd104'},
    {'name': 'Introduction to Data Science', 'link': 'https://www.udacity.com/course/introduction-to-data-science--cd0017'},
]

web_course = [
    {'name': 'Django Crash Course', 'link': 'https://youtu.be/e1IyzVyrLSU'},
    {'name': 'Python and Django Full Stack Bootcamp', 'link': 'https://www.udemy.com/course/python-and-django-full-stack-web-developer-bootcamp'},
    {'name': 'React Crash Course', 'link': 'https://youtu.be/Dorf8i6lCuk'},
    {'name': 'ReactJS Project Development Training', 'link': 'https://www.dotnettricks.com/training/masters-program/reactjs-certification-training'},
    {'name': 'Full Stack Web Developer - MEAN Stack', 'link': 'https://www.simplilearn.com/full-stack-web-developer-mean-stack-certification-training'},
    {'name': 'Node.js and Express.js', 'link': 'https://youtu.be/Oe421EPjeBE'},
    {'name': 'Flask: Develop Web Applications', 'link': 'https://www.educative.io/courses/flask-develop-web-applications-in-python'},
    {'name': 'Full Stack Web Developer by Udacity', 'link': 'https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044'},
]

android_course = [
    {'name': 'Android Development for Beginners', 'link': 'https://youtu.be/fis26HvvDII'},
    {'name': 'Android App Development Specialization', 'link': 'https://www.coursera.org/specializations/android-app-development'},
    {'name': 'Become an Android Kotlin Developer', 'link': 'https://www.udacity.com/course/android-kotlin-developer-nanodegree--nd940'},
    {'name': 'Android Basics by Google', 'link': 'https://www.udacity.com/course/android-basics-nanodegree-by-google--nd803'},
    {'name': 'The Complete Android Developer Course', 'link': 'https://www.udemy.com/course/complete-android-n-developer-course/'},
    {'name': 'Flutter & Dart Complete Course', 'link': 'https://www.udemy.com/course/flutter-dart-the-complete-flutter-app-development-course/'},
    {'name': 'Flutter App Development Course', 'link': 'https://youtu.be/rZLR5olMR64'},
]

ios_course = [
    {'name': 'iOS App Development by LinkedIn', 'link': 'https://www.linkedin.com/learning/subscription/topics/ios'},
    {'name': 'iOS & Swift Complete Bootcamp', 'link': 'https://www.udemy.com/course/ios-13-app-development-bootcamp/'},
    {'name': 'Become an iOS Developer', 'link': 'https://www.udacity.com/course/ios-developer-nanodegree--nd003'},
    {'name': 'iOS App Development with Swift', 'link': 'https://www.coursera.org/specializations/app-development'},
    {'name': 'Learn Swift by Codecademy', 'link': 'https://www.codecademy.com/learn/learn-swift'},
    {'name': 'Swift Tutorial - Full Course', 'link': 'https://youtu.be/comQ1-x2a1Q'},
]

uiux_course = [
    {'name': 'Google UX Design Professional Certificate', 'link': 'https://www.coursera.org/professional-certificates/google-ux-design'},
    {'name': 'UI/UX Design Specialization', 'link': 'https://www.coursera.org/specializations/ui-ux-design'},
    {'name': 'Complete App Design Course', 'link': 'https://www.udemy.com/course/the-complete-app-design-course-ux-and-ui-design/'},
    {'name': 'UX & Web Design Master Course', 'link': 'https://www.udemy.com/course/ux-web-design-master-course-strategy-design-development/'},
    {'name': 'DESIGN RULES: Principles for UI Design', 'link': 'https://www.udemy.com/course/design-rules/'},
    {'name': 'Become a UX Designer by Udacity', 'link': 'https://www.udacity.com/course/ux-designer-nanodegree--nd578'},
]

general_course = [
    {'name': 'CS50: Introduction to Computer Science', 'link': 'https://www.edx.org/course/cs50s-introduction-to-computer-science'},
    {'name': 'Introduction to Programming', 'link': 'https://www.udacity.com/course/intro-to-programming-nanodegree--nd000'},
    {'name': 'Git and GitHub for Beginners', 'link': 'https://www.youtube.com/watch?v=RGOj5yH7evk'},
    {'name': 'Software Engineering Fundamentals', 'link': 'https://www.coursera.org/learn/software-processes'},
]

# Skill-to-course mapping for personalized recommendations
skill_based_courses = {
    # Programming Languages
    'Python': [
        {'name': 'Python for Everybody by Coursera', 'link': 'https://www.coursera.org/specializations/python'},
        {'name': 'Complete Python Bootcamp', 'link': 'https://www.udemy.com/course/complete-python-bootcamp/'},
    ],
    'JavaScript': [
        {'name': 'JavaScript: The Complete Guide', 'link': 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/'},
        {'name': 'Modern JavaScript From The Beginning', 'link': 'https://www.udemy.com/course/modern-javascript-from-the-beginning/'},
    ],
    'Java': [
        {'name': 'Java Programming Masterclass', 'link': 'https://www.udemy.com/course/java-the-complete-java-developer-course/'},
        {'name': 'Java Programming and Software Engineering Fundamentals', 'link': 'https://www.coursera.org/specializations/java-programming'},
    ],
    'React': [
        {'name': 'React - The Complete Guide', 'link': 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/'},
        {'name': 'React Crash Course', 'link': 'https://youtu.be/Dorf8i6lCuk'},
    ],
    'Node.js': [
        {'name': 'Node.js - The Complete Guide', 'link': 'https://www.udemy.com/course/nodejs-the-complete-guide/'},
        {'name': 'Node.js and Express.js Tutorial', 'link': 'https://youtu.be/Oe421EPjeBE'},
    ],
    'Machine Learning': [
        {'name': 'Machine Learning by Andrew NG', 'link': 'https://www.coursera.org/learn/machine-learning'},
        {'name': 'Machine Learning Crash Course by Google', 'link': 'https://developers.google.com/machine-learning/crash-course'},
    ],
    'TensorFlow': [
        {'name': 'TensorFlow Developer Certificate', 'link': 'https://www.coursera.org/professional-certificates/tensorflow-in-practice'},
        {'name': 'Deep Learning with TensorFlow', 'link': 'https://www.udemy.com/course/complete-tensorflow-2-and-keras-deep-learning-bootcamp/'},
    ],
    'PyTorch': [
        {'name': 'PyTorch for Deep Learning', 'link': 'https://www.udemy.com/course/pytorch-for-deep-learning-with-python-bootcamp/'},
        {'name': 'Deep Learning with PyTorch', 'link': 'https://www.coursera.org/specializations/deep-learning'},
    ],
    'SQL': [
        {'name': 'The Complete SQL Bootcamp', 'link': 'https://www.udemy.com/course/the-complete-sql-bootcamp/'},
        {'name': 'SQL for Data Science', 'link': 'https://www.coursera.org/learn/sql-for-data-science'},
    ],
    'MongoDB': [
        {'name': 'MongoDB - The Complete Developer Guide', 'link': 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/'},
        {'name': 'MongoDB University Free Courses', 'link': 'https://university.mongodb.com/'},
    ],
    'AWS': [
        {'name': 'AWS Certified Solutions Architect', 'link': 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/'},
        {'name': 'AWS Cloud Practitioner Essentials', 'link': 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/'},
    ],
    'Docker': [
        {'name': 'Docker Mastery: Complete Toolset', 'link': 'https://www.udemy.com/course/docker-mastery/'},
        {'name': 'Docker and Kubernetes Complete Guide', 'link': 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/'},
    ],
    'Kubernetes': [
        {'name': 'Kubernetes for Absolute Beginners', 'link': 'https://www.udemy.com/course/learn-kubernetes/'},
        {'name': 'Kubernetes Certified Application Developer', 'link': 'https://www.udemy.com/course/certified-kubernetes-application-developer/'},
    ],
    'Android': [
        {'name': 'Android Development for Beginners', 'link': 'https://youtu.be/fis26HvvDII'},
        {'name': 'The Complete Android Developer Course', 'link': 'https://www.udemy.com/course/complete-android-n-developer-course/'},
    ],
    'Flutter': [
        {'name': 'Flutter & Dart Complete Course', 'link': 'https://www.udemy.com/course/flutter-dart-the-complete-flutter-app-development-course/'},
        {'name': 'Flutter App Development Course', 'link': 'https://youtu.be/rZLR5olMR64'},
    ],
    'Swift': [
        {'name': 'iOS & Swift Complete Bootcamp', 'link': 'https://www.udemy.com/course/ios-13-app-development-bootcamp/'},
        {'name': 'Swift Tutorial - Full Course', 'link': 'https://youtu.be/comQ1-x2a1Q'},
    ],
    'UI/UX': [
        {'name': 'Google UX Design Professional Certificate', 'link': 'https://www.coursera.org/professional-certificates/google-ux-design'},
        {'name': 'Complete App Design Course', 'link': 'https://www.udemy.com/course/the-complete-app-design-course-ux-and-ui-design/'},
    ],
    'Figma': [
        {'name': 'Figma UI UX Design Essentials', 'link': 'https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/'},
        {'name': 'Figma Masterclass', 'link': 'https://www.youtube.com/watch?v=II-6dDzc-80'},
    ],
    'Git': [
        {'name': 'Git Complete: Definitive Guide', 'link': 'https://www.udemy.com/course/git-complete/'},
        {'name': 'Git and GitHub for Beginners', 'link': 'https://www.youtube.com/watch?v=RGOj5yH7evk'},
    ],
    'Data Analysis': [
        {'name': 'Data Analysis with Python', 'link': 'https://www.freecodecamp.org/learn/data-analysis-with-python/'},
        {'name': 'Data Analyst Nanodegree', 'link': 'https://www.udacity.com/course/data-analyst-nanodegree--nd002'},
    ],
    'Pandas': [
        {'name': 'Pandas for Data Analysis', 'link': 'https://www.udemy.com/course/data-analysis-with-pandas/'},
        {'name': 'Python Pandas Tutorial', 'link': 'https://www.youtube.com/watch?v=vmEHCJofslg'},
    ],
    'REST API': [
        {'name': 'REST API Design, Development', 'link': 'https://www.udemy.com/course/rest-api-design-development-testing/'},
        {'name': 'Building RESTful APIs', 'link': 'https://www.youtube.com/watch?v=-MTSQjw5DrM'},
    ],
    'TypeScript': [
        {'name': 'TypeScript Complete Course', 'link': 'https://www.udemy.com/course/understanding-typescript/'},
        {'name': 'TypeScript for JavaScript Developers', 'link': 'https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html'},
    ],
}

def get_courses_by_field(field: str):
    """Get courses based on recommended field"""
    courses_map = {
        'Data Science': ds_course,
        'Web Development': web_course,
        'Android Development': android_course,
        'iOS Development': ios_course,
        'UI/UX Design': uiux_course,
        'General IT': general_course
    }
    
    return courses_map.get(field, general_course)

def get_personalized_courses(user_skills: list, field: str, recommended_skills: list, max_courses: int = 8):
    """
    Get personalized course recommendations based on missing skills
    
    Args:
        user_skills: List of skills user already has
        field: Determined field (Data Science, Web Development, etc.)
        recommended_skills: Skills recommended for the field
        max_courses: Maximum number of courses to return
    
    Returns:
        List of personalized course recommendations
    """
    user_skills_lower = [skill.lower() for skill in user_skills]
    personalized = []
    
    # Priority 1: Courses for recommended skills they don't have
    for skill in recommended_skills:
        skill_key = skill.replace(' ', '')  # Handle skill name variations
        
        # Check if user already has this skill
        has_skill = any(skill.lower() in us or us in skill.lower() for us in user_skills_lower)
        
        if not has_skill:
            # Find courses for this missing skill
            for key, courses in skill_based_courses.items():
                if skill.lower() in key.lower() or key.lower() in skill.lower():
                    for course in courses:
                        if course not in personalized:
                            personalized.append(course)
                            if len(personalized) >= max_courses:
                                return personalized
    
    # Priority 2: General field-specific courses if we need more
    if len(personalized) < max_courses:
        field_courses = get_courses_by_field(field)
        for course in field_courses:
            if course not in personalized:
                personalized.append(course)
                if len(personalized) >= max_courses:
                    break
    
    # Priority 3: Fill remaining with popular skills in the field
    if len(personalized) < max_courses:
        field_skill_priorities = {
            'Data Science': ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'Pandas', 'SQL'],
            'Web Development': ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'REST API'],
            'Android Development': ['Android', 'Kotlin', 'Java', 'Flutter'],
            'iOS Development': ['Swift', 'iOS', 'Objective-C'],
            'UI/UX Design': ['Figma', 'UI/UX', 'Adobe XD', 'Photoshop'],
            'Mobile Development': ['Flutter', 'React Native', 'Android', 'Swift'],
            'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Git'],
            'Backend Development': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'REST API'],
            'Frontend Development': ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
        }
        
        priority_skills = field_skill_priorities.get(field, ['Python', 'JavaScript', 'Git'])
        
        for skill in priority_skills:
            if len(personalized) >= max_courses:
                break
            
            has_skill = any(skill.lower() in us or us in skill.lower() for us in user_skills_lower)
            if not has_skill and skill in skill_based_courses:
                for course in skill_based_courses[skill]:
                    if course not in personalized:
                        personalized.append(course)
                        if len(personalized) >= max_courses:
                            break
    
    return personalized if personalized else get_courses_by_field(field)[:max_courses]
