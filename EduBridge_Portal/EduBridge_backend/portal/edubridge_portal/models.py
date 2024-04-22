from django.db import models
from django.contrib.auth import get_user_model
import logging
import random
import string
from django.db import models
import random
import string


User = get_user_model()

logger = logging.getLogger('django')

def generate_unique_token():
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6)) 

class Classroom(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE) 
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    DEFINITIONS_CHOICES = [
        ('NO', 'No'),
        ('UP', 'Upload a File')
    ] 
    definitions_choice = models.CharField(max_length=3, choices=DEFINITIONS_CHOICES, default='NO') 
    definitions_upload = models.FileField(upload_to="definitions_file/", blank=True)
    DATA_CHOICES = [
        ('VDUP', 'Video Upload'),
        ('TX', 'Text'),
    ]
    data = models.CharField(max_length=10, choices=DATA_CHOICES, default='')
    date_of_creation = models.DateTimeField(auto_now_add=True)
    
    def get_questions_list(self):
        return Question.objects.filter(classroom=self).order_by('pk')
    
    def get_total_answers_required(self):
        return self.get_questions_list().count()
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not hasattr(self, 'dataitem'):
            DataItem.objects.create(classroom=self, data_type=self.data)
        elif self.dataitem.data_type != self.data:
            self.dataitem.data_type = self.data
            self.dataitem.save()
            
class Sample(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.PROTECT, related_name='samples')
    name = models.CharField(max_length=100)
    data_file = models.FileField(upload_to= "data_file/", default='')
    token = models.CharField(max_length=10, default=generate_unique_token, unique=True)

    class Meta:
        unique_together = ('classroom', 'name')
        
class VideoUpload(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    sample = models.ForeignKey(Sample, on_delete=models.PROTECT, null=True, related_name='upload_videos')
    sr_number = models.IntegerField(default=0)
    video_upload = models.FileField(upload_to="video_upload/", blank=True)
    

    def __str__(self):
        return self.video_upload
    
class TextDataType(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE, null=True, related_name='text_data')
    text_id = models.CharField(max_length = 200)
    text = models.TextField()
    sr_number = models.IntegerField(default=0)

    def __str__(self):
        return self.text
    
QUESTION_TYPE_CHOICES = [
    ('MC', 'Multiple Choice'),
    ('SC', 'Single Choice'),
    ('CM', 'Comment'),
    ('DD', 'Dropdown'),
    ('CB', 'Checkbox'),
]

class Question(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    question_type = models.CharField(max_length=3, choices=QUESTION_TYPE_CHOICES, default='') 
    is_required = models.BooleanField(default=False)

    def __str__(self):
        return self.text
        
class DropdownChoice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=300)

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    
class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def get_duration(self):
        if self.end_time:
            return self.end_time - self.start_time
        else:
            return None

    def check_if_all_texts_answered(self, request, sample_id):
        user_answers = UserResponse.objects.filter(user_answering=request.user, enrollment__sample_id=sample_id)
        number_of_displayed_texts = user_answers.values('text_id').distinct().count()
        total_texts = TextDataType.objects.filter(sample_id=sample_id).count()
        return number_of_displayed_texts == total_texts
       
class UserAnswersSample(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE)
    is_answered = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.pk}'
    
class UserResponse(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='user_responses')
    data_item = models.ForeignKey('DataItem', on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ManyToManyField(Choice, related_name='answers', blank=True)
    text_answer = models.CharField(max_length=254, null=True, blank=True)
    video_upload = models.ForeignKey(VideoUpload, on_delete=models.CASCADE, null=True, blank=True)
    answer_start_time = models.DateTimeField(null=True, blank=True)
    answer_end_time = models.DateTimeField(null=True, blank=True)
    user_answering = models.ForeignKey(User, on_delete=models.CASCADE)
    text_id = models.ForeignKey(TextDataType, on_delete=models.CASCADE, null=True, blank=True)
    checkboxAnswer = models.BooleanField(default=False)
    
    def __str__(self):
        return f'{self.enrollment.user.username} - {self.question.text} - {self.pk}'
    
    def get_answer(self):
        logger.debug(f"Fetching answer for question type: {self.question.question_type}")
        answer = None
        if self.question.question_type == 'CM':
            answer = self.text_answer
        elif self.question.question_type == 'CB':
                answer = self.checkboxAnswer
        elif self.question.question_type in ['MC', 'SC', 'DD']:
                answer = [choice.text for choice in self.answer.all()]
        logger.debug(f"Answer: {answer}")
        return answer
        
    @property
    def is_answered(self):
        return self.answer_end_time is not None
    
    def time_taken_for_answers(self):
        if self.is_answered:
            time_diff = self.answer_end_time - self.answer_start_time
            return time_diff.total_seconds()  
        return None
    
    def all_answered(self):
        total_questions = Question.objects.filter(classroom=self.enrollment.sample.classroom).count()
        answered_questions = UserAnswersSample.objects.filter(user=self.user_answering, sample=self.enrollment.sample, is_answered=True).count()
        return total_questions == answered_questions
        
class DataItem(models.Model):
    DATA_CHOICES = [
        ('VDUP', 'Video Upload'),
        ('TX', 'Text'),
    ]
    
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    data_type = models.CharField(max_length=5, choices=DATA_CHOICES, null=True)
    is_active = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
class Grade(models.Model):
    user_response = models.OneToOneField(UserResponse, on_delete=models.CASCADE, related_name='grade')
    grader = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    feedback = models.TextField(blank=True)

    def __str__(self):
        return f"{self.score} - {self.user_response}"