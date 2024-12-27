from django.contrib import admin 
from edubridge_portal.models import *

class ClassroomAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'owner', 'data')
    search_fields = ['name', 'owner']
    list_filter = ['data']
    
class SampleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'token')
    search_fields = ['name']
    list_filter = ['classroom']
        
class VideoUploadAdmin(admin.ModelAdmin):
    list_display = ('pk', 'video_upload', 'sr_number')
    search_fields = ['pk', 'sr_number']
    list_filter = ['sr_number']
    
class TextDataTypeAdmin(admin.ModelAdmin):
    list_display = ('pk', 'text_id', 'text', 'sr_number')
    search_fields = ['pk', 'sr_number']
    list_filter = ['sr_number']
    
class QuestionAdmin(admin.ModelAdmin):
   list_display = ('id', 'classroom', 'text', 'question_type')
   search_fields = ['classroom']
   list_filter = ['classroom']

class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('question', 'text')
    search_fields = ['question']
    list_filter = ['question']
    
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'sample', 'start_time', 'end_time')
    search_fields = ['user', 'sample']
    list_filter = ['user', 'sample']
    list_filter = ['user', 'sample']
       
class UserRespondAdmin(admin.ModelAdmin):
    list_display = ('id', 'enrollment', 'display_responses')
    search_fields = ['enrollment']
    list_filter = ['enrollment']
    
    def display_responses(self, obj):
        if obj.question.question_type == 'CB':
            return str(obj.checkboxAnswer)
        elif obj.question.question_type in ['DD']:
            return ", ".join([answer.text for answer in obj.answer.all()])
        elif obj.question.question_type in ['CM']:
            return obj.text_answer
        else:
            return "Invalid question type"
    display_responses.short_description = 'answer'
    
class DataItemAdmin(admin.ModelAdmin):
    list_display = ('classroom', 'data_type', 'is_active')
    search_fields = ['classroom']
    list_filter = ['classroom']

class GradingAdmin(admin.ModelAdmin):
    list_display = ('user_response', 'grader', 'score', 'feedback')
    search_fields = ['user_response__id', 'grader__username']
    list_filter = ['grader']

admin.site.register(Classroom, ClassroomAdmin)
admin.site.register(Sample, SampleAdmin)
admin.site.register(VideoUpload, VideoUploadAdmin)
admin.site.register(TextDataType, TextDataTypeAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice, ChoiceAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
admin.site.register(UserResponse, UserRespondAdmin)
admin.site.register(DataItem, DataItemAdmin)
admin.site.register(Grade, GradingAdmin)   
    
