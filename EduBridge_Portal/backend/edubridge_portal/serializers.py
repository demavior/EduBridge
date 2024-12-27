from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from edubridge_portal.models import *


class ClassroomSerializer(serializers.ModelSerializer):
    name = serializers.CharField(label=_('Classroom Name:'))
    description = serializers.CharField(label=_('Classroom Description:'), required=False, allow_blank=True)
    data = serializers.ChoiceField(label=_('Choose a data set'), choices=Classroom.DATA_CHOICES)
    definitions_choice = serializers.ChoiceField(
        label=_('Upload pdf or docx that is visible to the annotator(s) of your project by clicking a link.'),
        choices=Classroom.DEFINITIONS_CHOICES
    )
    definitions_upload = serializers.FileField(required=False)

    class Meta:
        model = Classroom
        fields = [
            'id', 'name', 'description', 'data',
            'definitions_choice', 'definitions_upload',
            'date_of_creation',
        ]

    def validate_definitions_upload(self, value):
        if value and not (value.name.endswith('.pdf') or value.name.endswith('.docx')):
            raise serializers.ValidationError(_('File type is not supported. Only PDF and DOCX are allowed.'))
        return value

    def validate(self, data):
        return data  
                       
class SampleSerializer(serializers.ModelSerializer):
    name = serializers.CharField(label=_('Sample Name:'))
    data_file = serializers.FileField(label=_('Upload Data File:'))
    
    class Meta:
        model = Sample
        fields = ['id', 'name', 'token', 'data_file'] 

    def validate_data_file(self, value):
        classroom = self.instance.classroom if self.instance else None

        if not classroom and 'classroom' in self.initial_data:
            classroom_id = self.initial_data.get('classroom')
            classroom = Classroom.objects.get(id=classroom_id)
        
        if classroom:
            classroom_data = classroom.data
            if classroom_data in ['TX'] and not (value.name.endswith('.csv') or value.name.endswith('.json')):
                raise serializers.ValidationError(_('File type is not supported for video or text. Only CSV and JSON files are allowed.'))
            elif classroom_data in ['VDUP'] and not value.name.endswith('.zip'):
                raise serializers.ValidationError(_('File type is not supported for video or text. Only ZIP files are allowed.'))
        else:
            raise serializers.ValidationError(_('Classroom is required to validate data file.'))
        
        return value

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True, source='choice_set') 
    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type', 'is_required', 'choices']

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id', 'user_response', 'grader', 'score', 'feedback']

    def validate_score(self, value):
        if not (0 <= value <= 100):
            raise serializers.ValidationError("Score must be between 0 and 100.")
        return value
    
class UserResponseSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)
    user_answer = serializers.SerializerMethodField()
    grade = GradeSerializer(read_only=True)
    
    class Meta:
        model = UserResponse
        fields = ['id', 'enrollment', 'data_item', 'question', 'answer', 'text_answer', 'video_upload', 'answer_start_time', 'answer_end_time', 'user_answering', 'text_id', 'checkboxAnswer', 'is_answered', 'all_answered', 'user_answer', 'question_text', 'grade']
             
    def validate(self, data):
        question = data.get('question')
        answer = data.get('answer')

        if question is None:
            raise serializers.ValidationError("Question data is required.")

        if question and hasattr(question, 'question_type'):
            if question.question_type in ['DD', 'SC']:
                if isinstance(answer, list) and len(answer) > 1:
                    raise serializers.ValidationError({'answer': 'Only one choice is allowed for this question type.'})
                if not isinstance(answer, list) or len(answer) == 1:
                    return data
            elif question.question_type == 'MC' and not isinstance(answer, list):
                raise serializers.ValidationError({'answer': 'Multiple choices should be submitted as a list.'})
        return data
    
    def get_all_answered(self, obj):
        return obj.all_answered()
    
    def get_user_answer(self, obj):
        return obj.get_answer()
    
    def update(self, instance, validated_data):
        instance.text_answer = validated_data.get('text_answer', instance.text_answer)
        if 'answer' in validated_data:
            answer_ids = [answer.id for answer in validated_data['answer']]
            instance.answer.set(answer_ids)
        instance.save()
        return instance
    
class EnrollmentSerializer(serializers.ModelSerializer):
    sample = SampleSerializer(read_only=True)
    sample_type = serializers.SerializerMethodField()
    classroom_id = serializers.IntegerField(source='sample.classroom.id')
    user_responses = UserResponseSerializer(many=True, read_only=True)
    classroom_name = serializers.SerializerMethodField()
    sample_name = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.username')
    user_id = serializers.IntegerField(source='user.id')
    
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'sample', 'start_time', 'end_time', 'sample_type', 'classroom_id', 'user_responses', 'classroom_name', 'sample_name', 'user_name', 'user_id']
        
    def get_sample_type(self, obj):
        return obj.sample.classroom.data
    
    def get_classroom_name(self, obj):
        return obj.sample.classroom.name

    def get_sample_name(self, obj):
        return obj.sample.name
        
class TextDataTypeSerializer(serializers.ModelSerializer):
    sample = SampleSerializer(read_only=True)
    classroom = ClassroomSerializer(read_only=True)

    class Meta:
        model = TextDataType
        fields = ('id', 'text_id', 'text', 'sample', 'classroom', 'sr_number')
        
class VideoUploadAnswerQuestionSerializer(serializers.ModelSerializer):
    sample = SampleSerializer(read_only=True)
    classroom = ClassroomSerializer(read_only=True)
    
    class Meta:
        model = VideoUpload
        fields = ['id', 'classroom', 'sample', 'sr_number', 'video_upload']
        
class DataItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataItem
        fields = '__all__'
        
