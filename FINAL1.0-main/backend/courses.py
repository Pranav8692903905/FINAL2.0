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
