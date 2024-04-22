from django.urls import path 
from edubridge_portal.views import (ClassroomCreateView, SampleCreateView,
                                    ClassroomDetailView, ClassroomListView,
                                    ClassroomUpdateView, SampleListView,
                                    SampleDetailView, SampleUpdateView,
                                    DeleteSampleView, DeleteClassroomView, 
                                    CreateQuestionView, UpdateQuestionsView,
                                    FetchingClassroomQuestionsView, DeleteQuestionsView, 
                                    EnrollClassroomView, DropEnrolledClassroomView,
                                    TextAnswerQuestionView,VideoUploadAnswerQuestionView,
                                    TeacherReportView, TeacherGradingUpdateView, 
                                    TeacherGradingStudentView, StudentGradeView, fetchStudentEnrollments,
                                    fetchStudentEnrollmentsForParents, FetchGradesForParents)

urlpatterns = [
    path('create-classroom/', ClassroomCreateView.as_view(), name='create-classroom'),
    path('create-sample/<int:classroom_id>/', SampleCreateView.as_view(), name='create-sample'),
    path('manage-classroom/<int:classroom_id>/', ClassroomDetailView.as_view(), name='manage-classroom'),
    path('update-classroom/<int:classroom_id>/', ClassroomUpdateView.as_view(), name='update-classroom'),
    path('list-classrooms/', ClassroomListView.as_view(), name='list-classrooms'),
    path('list-samples/<int:classroom_id>/', SampleListView.as_view(), name='list-samples'),
    path('manage-sample/<int:sample_id>/', SampleDetailView.as_view(), name='manage-sample'),
    path('update-sample/<int:sample_id>/', SampleUpdateView.as_view(), name='update-sample'),
    path('delete-sample/<int:sample_id>/', DeleteSampleView.as_view(), name='delete-sample'),
    path('delete-classroom/<int:classroom_id>/', DeleteClassroomView.as_view(), name='delete-classroom'),
    path('create-question/<int:classroom_id>/', CreateQuestionView.as_view(), name='create-question'),
    path('update-question/<int:question_id>/', UpdateQuestionsView.as_view(), name='update-question'),
    path('classroom-questions/<int:classroom_id>/', FetchingClassroomQuestionsView.as_view(), name='classroom-questions'),
    path('delete-questions/<int:question_id>/', DeleteQuestionsView.as_view(), name='delete-questions'),
    path('enroll-classroom/', EnrollClassroomView.as_view(), name='enroll-classroom'),
    path('drop-enrolled-classroom/<int:sample_id>/', DropEnrolledClassroomView.as_view(), name='drop-enrolled-classroom'),
    path('text/<int:classroom_id>/samples/<int:sample_id>/', TextAnswerQuestionView.as_view(), name='text_answer_question'),
    path('video/<int:classroom_id>/samples/<int:sample_id>/', VideoUploadAnswerQuestionView.as_view(), name='video-upload-question'),
    path('teacher/report/<int:sample_id>/', TeacherReportView.as_view(), name='teacher-report'),
    path('teacher/report/<int:sample_id>/user/<int:user_id>/', TeacherGradingStudentView.as_view(), name='teacher-student-report'),
    path('teacher/grading/update-response/<int:response_id>/', TeacherGradingUpdateView.as_view(), name='update-grade'),
    path('student-enrollments/', fetchStudentEnrollments.as_view(), name='student-enrollments'),
    path('student-grades/', StudentGradeView.as_view(), name='student-grades'),
    path('list-student-enrollments/<str:student_username>/', fetchStudentEnrollmentsForParents.as_view(), name='list-student-enrollments'),
    path('parent-view-grades/<int:enrollment_id>/', FetchGradesForParents.as_view(), name='parent-view-grades'),





]