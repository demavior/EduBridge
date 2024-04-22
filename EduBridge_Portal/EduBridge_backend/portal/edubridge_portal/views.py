from datetime import timezone
from edubridge_portal.serializers import *
from edubridge_portal.models import *
import csv, os, json, logging
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from django.db import transaction
from zipfile import ZipFile, is_zipfile
from django.core.files.base import ContentFile
from datetime import datetime
from rest_framework.exceptions import ValidationError

User = get_user_model()

logger = logging.getLogger('django')


def handle_csv_file(classroom, sample, file):
    reader = csv.reader(file, delimiter=",")
    header = next(reader)
    
    if classroom.data == 'TX':
        text_index = header.index('Text')
        text_id = header.index('text_id')
        
    storeData = []
    for count, row in enumerate(reader, start=1):
        try:
            if classroom.data == 'TX':
                storeData.append(TextDataType(classroom=classroom, sample=sample, sr_number=count, text=row[text_index], text_id = row[text_id]))
        except Exception as exc:
            logger.error(f"Error in row {count} of csv file: {exc}")
            continue
    
    if classroom.data == 'TX':
        TextDataType.objects.bulk_create(storeData) 
        
def handle_json_file(classroom, sample, file):
    storeData = json.load(file)
    data_to_insert = []
    for count, row in enumerate(storeData, start=1):
        try:
            if classroom.data == 'TX':
                data_to_insert.append(TextDataType(classroom=classroom, sample=sample, sr_number=count, text=row['Text'], text_id=row['text_id']))
        except Exception as exc:
            logger.error(f"Error in row {count} of json file: {exc}")
            continue
    
    if data_to_insert:
        if classroom.data == 'TX':
            TextDataType.objects.bulk_create(data_to_insert)
                        
def handle_zip_file(classroom, sample, file):
    if not is_zipfile(file):
        raise ValueError('Uploaded file is not a ZIP file')

    allowed_extensions = ['.mp4']
    count = 0 

    with ZipFile(file, 'r') as zip_ref:
        for filename in zip_ref.namelist():
            if os.path.isabs(filename) or filename.startswith('..'):
                continue
            if any(filename.lower().endswith(ext) for ext in allowed_extensions):
                with zip_ref.open(filename) as f:
                    if classroom.data == 'IMG':
                        count += 1 
                        video_model = VideoUpload(classroom=classroom, sample=sample, sr_number=count)
                        video_model.video.save(os.path.basename(filename), ContentFile(f.read()), save=True) 

class ClassroomCreateView(generics.CreateAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'id': serializer.instance.id, **serializer.data}, status=status.HTTP_201_CREATED, headers=headers)
    
class SampleCreateView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def post(self, request, classroom_id):
        try:
            classroom = Classroom.objects.get(pk=classroom_id, owner=request.user)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
        data = request.data.copy()
        data['classroom'] = classroom.id
        
        serializer = SampleSerializer(data=data)
        if serializer.is_valid():
            sample = serializer.save(classroom=classroom)
            data_file = request.FILES.get('data_file')
            if data_file:
                file_extension = os.path.splitext(data_file.name)[1].lower()
                if file_extension in [".csv", ".json", ".zip"]:
                    file_path = os.path.join(settings.MEDIA_ROOT, 'data_file', data_file.name)
                    uploaded_file_path = os.path.join(settings.MEDIA_ROOT, sample.data_file.name)
                    filename, file_extension = os.path.splitext(uploaded_file_path)
                    if file_extension.lower() == ".zip":
                        try:
                            uploaded_file = request.FILES['data_file'] 
                            handle_zip_file(classroom, sample, uploaded_file)
                        except ValueError:
                            return Response({"error": "Uploaded file is not a ZIP file"}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        with open(file_path, 'r', encoding="utf-8") as f:
                            if file_extension == ".csv":
                                handle_csv_file(classroom, sample, f)
                            elif file_extension == ".json":
                                handle_json_file(classroom, sample, f)
                else:
                    print(serializer.errors)
                    return Response({"error": "Unsupported file type"}, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
                    
class ClassroomDetailView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def get_object(self, classroom_id):
        try:
            return Classroom.objects.get(pk=classroom_id, owner=self.request.user)
        except Classroom.DoesNotExist:
            return None
        
    def get(self, request, classroom_id):
        classroom = self.get_object(classroom_id)
        if classroom is None:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ClassroomSerializer(classroom)
        return Response(serializer.data)
    
class ClassroomUpdateView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def get_object(self, classroom_id, user):
        try:
            return Classroom.objects.get(pk=classroom_id, owner=user)
        except Classroom.DoesNotExist:
            return None

    def put(self, request, classroom_id):
        classroom = self.get_object(classroom_id, request.user)
        if classroom is None:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ClassroomSerializer(classroom, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SampleDetailView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def get_object(self, sample_id):
        try:
            sample = Sample.objects.get(pk=sample_id, classroom__owner=self.request.user)
            logger.debug('Sample:', sample)
            return sample
        except Sample.DoesNotExist:
            logger.error('Sample not found')
            return None

    def get(self, request, sample_id):
        sample = self.get_object(sample_id)
        if sample is None:
            return Response({"error": "Sample not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SampleSerializer(sample)
        return Response(serializer.data)

class SampleUpdateView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]
    
    def get_object(self, sample_id, user):
        try:
            sample = Sample.objects.get(pk=sample_id, classroom__owner=user)
            logger.debug('Sample:', sample)
            return sample
        except Sample.DoesNotExist:
            logger.error('Sample not found')
            return None
        
    def put(self, request, sample_id):
        print(request.data)
        sample = self.get_object(sample_id, request.user)
        if sample is None:
            return Response({"error": "Sample not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Pass the classroom object in the context
        context = {'request': request, 'classroom': sample.classroom}
        serializer = SampleSerializer(sample, data=request.data, context=context, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClassroomListView(generics.ListAPIView):
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        queryset = Classroom.objects.filter(owner=self.request.user)
        query = self.request.query_params.get('q')
        if query is not None:
            queryset = queryset.filter(Q(name__icontains=query))
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class DeleteClassroomView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, classroom_id):
        classroom = get_object_or_404(Classroom, pk=classroom_id, owner=request.user)
        Sample.objects.filter(classroom=classroom).delete()
        
        classroom.delete()
        return Response({"message": "Classroom deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class SampleListView(generics.ListAPIView):
    serializer_class = SampleSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        logger.debug("Inside get_queryset")
        queryset = Sample.objects.filter(classroom__id=self.kwargs.get('classroom_id'),
                                         classroom__owner=self.request.user)
        query = self.request.query_params.get('q')
        if query is not None:
            queryset = queryset.filter(name__icontains=query)
        logger.debug(queryset)
        return queryset

class DeleteSampleView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, sample_id):
        sample = get_object_or_404(Sample, pk=sample_id, classroom__owner=request.user)
        sample.delete()
        return Response({"message": "Sample deleted successfully"}, status=status.HTTP_204_NO_CONTENT)    
        
class CreateQuestionView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def post(self, request, classroom_id):
        classroom = get_object_or_404(Classroom, id=classroom_id, owner=request.user)
        questions_data = request.data.get('questions', [])
        
        for question_data in questions_data:
            question_serializer = QuestionSerializer(data=question_data)
            if question_serializer.is_valid():
                question = question_serializer.save(classroom=classroom)
                
                question_type = question_data.get('question_type')
                if question_type in ['MC', 'DD', 'SC', 'CB']:
                    choices = question_data.get('choices', [])
                    for choice_data in choices:
                        try:
                            Choice.objects.create(question=question, text=choice_data['text'])
                        except Exception as e:
                            return Response({"error": "Error while creating choices"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(question_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Questions saved successfully"}, status=status.HTTP_201_CREATED)

class FetchingClassroomQuestionsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, classroom_id):
        classroom = get_object_or_404(Classroom, id=classroom_id, owner=request.user)
        questions = Question.objects.filter(classroom=classroom).prefetch_related('choice_set')
        for question in questions:
            serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

class UpdateQuestionsView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]
    
    def get_object(self, question_id):
        try:
            return Question.objects.get(pk=question_id, classroom__owner=self.request.user)
        except Question.DoesNotExist:
            return None
    
    def get(self, request, question_id, *args, **kwargs):
        question = self.get_object(question_id)
        if question is None:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = QuestionSerializer(question)
        return Response(serializer.data)
    
    def put(self, request, question_id, *args, **kwargs):
        question = self.get_object(question_id)
        if question is None:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = QuestionSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        
            choices_data = request.data.get('choices')
            if choices_data is not None:
                for choice_data in choices_data:
                    try:
                        choice = Choice.objects.get(id=choice_data['id'])
                        choice.text = choice_data['text']
                        choice.save()
                    except Choice.DoesNotExist:
                        return Response({"error": "Choice not found"}, status=status.HTTP_404_NOT_FOUND)
                    
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteQuestionsView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]
    
    def delete(self, request, question_id):
        question = get_object_or_404(Question, pk=question_id, classroom__owner=request.user)
        question.delete()
        return Response({"message": "Question deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class FetchChoicesView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]
    
    
    def get(self, request, *args, **kwargs):
        question_id = request.GET.get('question_id')
        if not question_id:
            return Response({"error": "Question ID is required."}, status=400)
        
        choices = Choice.objects.filter(question_id=question_id)
        serializer = ChoiceSerializer(choices, many=True)
        
        return Response({'choices': serializer.data})

class EnrollClassroomView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        enrollments = Enrollment.objects.filter(user=request.user)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        try:
            sample = Sample.objects.get(token=token)
            classroom = sample.classroom
            if Enrollment.objects.filter(user=request.user, sample=sample).exists():
                return Response({"error": "You are already enrolled in this sample!"}, status=status.HTTP_400_BAD_REQUEST)
            
            enrollment = Enrollment(user=request.user, sample=sample)
            enrollment.save()
            sample_type = sample.classroom.data
            return Response({
                "message": "Successfully Enrolled",
                "sample": {
                    "id": sample.id,
                    "name": sample.name,
                    "classroomId": classroom.id
                },
                "sampleType": sample_type
            }, status=status.HTTP_200_OK)
        except Sample.DoesNotExist:
            return Response({"error": "Invalid token!"}, status=status.HTTP_404_NOT_FOUND)

class DropEnrolledClassroomView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, sample_id):
        sample = get_object_or_404(Sample, id=sample_id)
        enrollment = get_object_or_404(Enrollment, user=request.user, sample=sample)
        enrollment.delete()
        return Response({"message": "Successfully dropped the classroom"}, status=status.HTTP_204_NO_CONTENT)

class TextAnswerQuestionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, classroom_id, sample_id):
        classroom = get_object_or_404(Classroom, id=classroom_id)
        sample = get_object_or_404(Sample, id=sample_id, classroom=classroom)

        answered_texts_ids = UserResponse.objects.filter(user_answering=request.user, enrollment__sample=sample).values_list('text_id', flat=True).distinct()
        unanswered_texts = TextDataType.objects.filter(sample=sample).exclude(id__in=answered_texts_ids)
        if not unanswered_texts.exists():
            return Response({"message": "You have answered all the data for this classroom!"}, status=status.HTTP_200_OK)

        text_data = unanswered_texts.first()
        serializer = TextDataTypeSerializer(text_data)
        questions = classroom.get_questions_list()
        questions_serializer = QuestionSerializer(questions, many=True)

        return Response({'text_data': serializer.data,'questions': questions_serializer.data}, status=status.HTTP_200_OK)
    
    def post(self, request, classroom_id, sample_id):
        logger.debug("Received data:", request.data)
        classroom = get_object_or_404(Classroom, id=classroom_id)
        logger.debug("Classroom:", classroom)
        sample = get_object_or_404(Sample, id=sample_id, classroom=classroom)
        logger.debug("Sample:", sample)
        data_item_obj = DataItem.objects.get(classroom=classroom)
        logger.debug("Data Item:", data_item_obj)
        enrollment = Enrollment.objects.filter(user=request.user, sample=sample).latest('start_time')
        logger.debug("Enrollment:", enrollment)
        questions = classroom.get_questions_list()
        logger.debug("Questions:", questions)
        
        responses = []
        with transaction.atomic():
            for question_id, question_data in request.data.items():
                question = Question.objects.get(id=question_id)
                logger.debug("Question Type:", question.question_type)
                user_response = UserResponse.objects.create(
                enrollment=enrollment,
                data_item=data_item_obj,
                question=question,
                user_answering=request.user
            )
                logger.debug("User Response:", user_response)
                
                if question.question_type == 'CM':
                    user_response.text_answer = question_data.get('text_answer', '')
                    logger.debug("Text Answer:", user_response.text_answer)
                elif question.question_type in ['SC', 'DD']:
                    choice_id = question_data.get('answer')
                    if isinstance(choice_id, list):
                        choice_id = choice_id[0]
                    choice = Choice.objects.get(id=choice_id)
                    user_response.answer.set([choice])
                    logger.debug("Choice Answer:", user_response.answer)
                #elif question.question_type == 'CB' and 'checkboxAnswer' in question_data:
                 #   user_response.checkboxAnswer = question_data['checkboxAnswer'] == 'true'
                  #  logger.debug("Checkbox Answer:", user_response.checkboxAnswer)
                elif question.question_type == 'MC':
                    choice_ids = question_data.get('answer', [])
                    choices = Choice.objects.filter(id__in=choice_ids)
                    user_response.answer.set(choices)
                    logger.debug("Multiple Choice Answer:", user_response.answer)
                else:
                    raise ValueError(f"Invalid question type: {question.question_type} for question id: {question_id}")
                
                logger.debug("User Response:", user_response)
                user_response.save()
                logger.debug("User Response Saved:", user_response)
                responses.append(UserResponseSerializer(user_response).data)
                logger.debug("Responses:", responses)
            
            return Response(responses, status=status.HTTP_201_CREATED)
    
class VideoUploadAnswerQuestionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, classroom_id, sample_id):
        classroom = get_object_or_404(Classroom, id=classroom_id)
        sample = get_object_or_404(Sample, id=sample_id, classroom=classroom)
        
        video_data = VideoUpload.objects.filter(sample=sample).first()
        if not video_data:
            return Response({"error": "No video data available."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = VideoUploadAnswerQuestionSerializer(video_data)
        questions = classroom.get_questions_list()
        questions_serializer = QuestionSerializer(questions, many=True)

        return Response({
            'video_data': serializer.data,
            'questions': questions_serializer.data
        }, status=status.HTTP_200_OK)
        
    def post(self, request, classroom_id, sample_id):
        classroom = get_object_or_404(Classroom, id=classroom_id)
        sample = get_object_or_404(Sample, id=sample_id)
        
        responses = []
        with transaction.atomic():
            for question in classroom.get_questions_list():
                response_data = {
                    'enrollment': Enrollment.objects.get(user=request.user, sample=sample).id,
                    'question': question.id,
                    'video_upload': request.data.get('video_data'), 
                    'answer_start_time': request.data.get('answer_start_time', timezone.now()),
                    'answer_end_time': timezone.now(),
                    'user_answering': request.user.id,
                    'text_answer': request.data.get(f'question-{question.id}-answer') if question.question_type == 'CM' else None,
                    'checkboxAnswer': request.data.get(f'question-{question.id}-answer') if question.question_type == 'CB' else False
                }
                serializer = UserResponseSerializer(data=response_data)
                if serializer.is_valid():
                    serializer.save()
                    responses.append(serializer.data)
                else:
                    transaction.rollback()
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(responses, status=status.HTTP_201_CREATED)

class TeacherReportView(APIView):
    print("inside the TeacherReportView:")
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, sample_id):     
        sample = get_object_or_404(Sample, id=sample_id, classroom__owner=request.user)
        print("Sample:", sample)
        enrollments = sample.enrollment_set.prefetch_related('user').all()
        print("Enrollments:", enrollments)
        enrollment_serializer = EnrollmentSerializer(enrollments, many=True)
        print("Enrollment Serializer Data:", enrollment_serializer.data)
        return Response({
            'enrollments': enrollment_serializer.data
        })

class TeacherGradingStudentView(APIView):
    print("inside the TeacherGradingStudentView:")
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, sample_id, user_id):
        sample = Sample.objects.filter(id=sample_id, classroom__owner=request.user).first()
        if not sample:
            return Response({"error": "Not authorized to view this sample or sample not found."}, status=status.HTTP_403_FORBIDDEN)

        responses = UserResponse.objects.filter(enrollment__sample=sample, enrollment__user_id=user_id)
        print('Responses:', responses)
        responses = responses.select_related('grade')
        print('Responses:', responses)
        serializer = UserResponseSerializer(responses, many=True)
        print('Serialized data:', serializer.data)
        return Response(serializer.data)
  
class TeacherGradingUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, response_id):
        try:
            response = UserResponse.objects.get(id=response_id)
            grade_data = request.data.get('grade', {})
            grade_instance = getattr(response, 'grade', None)
            grade_serializer = GradeSerializer(grade_instance, data=grade_data, partial=True)

            if grade_serializer.is_valid():
                grade_serializer.save(grader=request.user, user_response=response)
                return Response(grade_serializer.data)
            else:
                return Response({"error": "Validation Error", "details": grade_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except UserResponse.DoesNotExist:
            return Response({"error": "Response not found"}, status=status.HTTP_404_NOT_FOUND)

class fetchStudentEnrollments(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)
      
class StudentGradeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        user_responses = UserResponse.objects.filter(user_answering=user).select_related('question', 'grade').prefetch_related('answer')
        serializer = UserResponseSerializer(user_responses, many=True)
        return Response(serializer.data)

class fetchStudentEnrollmentsForParents(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        username = kwargs.get('student_username')
        if not username:
            return Response({"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        enrollments = Enrollment.objects.filter(user__username=username)
        enrollment_data = []
        for enrollment in enrollments:
            enrollment_data.append({
                'id': enrollment.id,
                'classroom': {
                    'id': enrollment.sample.classroom.pk,
                    'name': enrollment.sample.classroom.name,
                    'sample': enrollment.sample.name,
                    'data': enrollment.sample.classroom.data,
                    'teacher': enrollment.sample.classroom.owner.get_username()
                }
            })

        return Response(enrollment_data)
    
class FetchGradesForParents(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, enrollment_id, *args, **kwargs):
        try:
            enrollment = Enrollment.objects.get(id=enrollment_id)
            logger.debug("Enrollment:", enrollment)
            user_responses = enrollment.user_responses.all()
            logger.debug("User Responses:", user_responses)
            serializer = UserResponseSerializer(user_responses, many=True)
            logger.debug("Serializer Data:", serializer.data)
            return Response({
                'classroom_name': enrollment.sample.classroom.name,
                'sample_name': enrollment.sample.name,
                'teacher': enrollment.sample.classroom.owner.username,
                'grades': serializer.data
            })
        except Enrollment.DoesNotExist:
            logger.debug("Enrollment not found.", enrollment_id)
            return Response({"error": "Enrollment not found."}, status=status.HTTP_404_NOT_FOUND)